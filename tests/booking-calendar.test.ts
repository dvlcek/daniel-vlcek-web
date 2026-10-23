import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import { google, calendar_v3 } from "googleapis";
import { GoogleCalendarProvider } from "@/lib/booking/calendar/google";
import { createBookingIcs } from "@/lib/booking/ics";
import { buildBookingManageUrl } from "@/lib/booking/manage-url";

const calendarApi = google as unknown as { calendar: () => calendar_v3.Calendar };
const startsAt = new Date("2026-10-25T08:00:00Z"); // Vienna switches back to CET on this date.
const endsAt = new Date("2026-10-25T08:30:00Z");
beforeEach(() => Object.assign(process.env, {
  GOOGLE_CALENDAR_CLIENT_ID: "fixture", GOOGLE_CALENDAR_CLIENT_SECRET: "fixture", GOOGLE_CALENDAR_REFRESH_TOKEN: "fixture", GOOGLE_CALENDAR_ID: "primary",
}));
afterEach(() => mock.restoreAll());

function provider(data: calendar_v3.Schema$FreeBusyResponse) {
  mock.method(calendarApi, "calendar", () => ({ freebusy: { query: async () => ({ data }) } } as unknown as calendar_v3.Calendar));
  return new GoogleCalendarProvider();
}

test("calendar errors, missing calendars and malformed periods fail closed", async () => {
  const cases: calendar_v3.Schema$FreeBusyResponse[] = [
    {}, { calendars: {} }, { calendars: { primary: { errors: [{ reason: "notFound" }] } } },
    { calendars: { primary: { busy: [{ start: "invalid", end: "invalid" }] } } },
    { calendars: { primary: { busy: [{ start: startsAt.toISOString() }] } } },
  ];
  for (const data of cases) {
    const calendar = provider(data);
    await assert.rejects(calendar.getBusyPeriods({ startsAt, endsAt }));
    mock.restoreAll();
  }
  assert.deepEqual(await provider({ calendars: { primary: { busy: [] } } }).getBusyPeriods({ startsAt, endsAt }), []);
});

test("busy UTC instants survive the Vienna DST boundary", async () => {
  const busy = await provider({ calendars: { primary: { busy: [{ start: startsAt.toISOString(), end: endsAt.toISOString() }] } } }).getBusyPeriods({ startsAt, endsAt });
  assert.deepEqual(busy, [{ startsAt, endsAt }]);
  assert.equal(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Vienna" }).format(startsAt), "09:00");
});

test("reschedule fails closed on a truncated calendar event list", async () => {
  mock.method(calendarApi, "calendar", () => ({ events: { list: async () => ({ data: { nextPageToken: "fixture-next", items: [] } }) } } as unknown as calendar_v3.Calendar));
  await assert.rejects(new GoogleCalendarProvider().getBusyPeriodsExcludingEvent({ startsAt, endsAt, excludeExternalEventId: "own-event" }));
});

test("internal Google event uses UTC instants/Vienna timezone and never adds customer attendees", async () => {
  let request: calendar_v3.Params$Resource$Events$Insert | undefined;
  mock.method(calendarApi, "calendar", () => ({ events: { insert: async (input: calendar_v3.Params$Resource$Events$Insert) => {
    request = input;
    return { data: { id: "fixture-event", hangoutLink: "https://example.test/meet" } };
  } } } as unknown as calendar_v3.Calendar));
  await new GoogleCalendarProvider().createEvent({ title: "Synthetic discovery", description: "Fixture only", startsAt, endsAt, timezone: "Europe/Vienna" });
  assert.equal(request?.requestBody?.start?.dateTime, startsAt.toISOString());
  assert.equal(request?.requestBody?.start?.timeZone, "Europe/Vienna");
  assert.equal(request?.requestBody?.end?.dateTime, endsAt.toISOString());
  assert.equal(request?.requestBody?.attendees, undefined);
  assert.equal(request?.conferenceDataVersion, 1);
});

test("management secrets remain in fragments and ICS preserves UTC/DST timing", () => {
  process.env.SITE_URL = "https://example.test";
  const url = new URL(buildBookingManageUrl({ origin: "https://ignored.test", bookingId: "fixture", token: "fixture-token" }));
  assert.equal(url.origin + url.pathname, "https://example.test/booking/manage"); assert.equal(url.search, "");
  assert.equal(new URLSearchParams(url.hash.slice(1)).get("token"), "fixture-token");
  const ics = createBookingIcs({ bookingId: "fixture", clientEmail: "client@test.local", organizerEmail: "owner@test.local", startsAt, endsAt });
  assert(ics.includes("DTSTART:20261025T080000Z")); assert(ics.includes("DTEND:20261025T083000Z"));
  assert(ics.includes("ATTENDEE;RSVP=FALSE:mailto:client@test.local"));
});


test("stable create identity and conflict recovery verify booking ownership and schedule", async () => {
  const id = "dv123abc";
  let inserted: calendar_v3.Params$Resource$Events$Insert | undefined;
  let wrongOwner = false;
  mock.method(calendarApi, "calendar", () => ({ events: {
    insert: async (input: calendar_v3.Params$Resource$Events$Insert) => { inserted = input; throw Object.assign(new Error("conflict"), { code: 409 }); },
    get: async () => ({ data: { id, start: { dateTime: startsAt.toISOString() }, end: { dateTime: endsAt.toISOString() }, extendedProperties: { private: { bookingId: wrongOwner ? "other-booking" : "fixture" } } } }),
  } } as unknown as calendar_v3.Calendar));
  const calendar = new GoogleCalendarProvider();
  const input = { externalEventId: id, bookingId: "fixture", title: "Synthetic call", startsAt, endsAt, timezone: "Europe/Vienna" };
  assert.equal((await calendar.createEvent(input)).externalEventId, id);
  assert.equal(inserted?.requestBody?.id, id); assert.equal(inserted?.requestBody?.extendedProperties?.private?.bookingId, "fixture");
  assert.equal(inserted?.requestBody?.conferenceData?.createRequest?.requestId, id);
  wrongOwner = true; await assert.rejects(calendar.createEvent(input));
});

test("calendar cancellation converges on scoped 404/410; version conflicts are not swallowed", async () => {
  let code = 404, request: unknown, options: unknown;
  mock.method(calendarApi, "calendar", () => ({ events: { delete: async (input: unknown, opts: unknown) => { request = input; options = opts; throw Object.assign(new Error("provider-secret"), { code }); } } } as unknown as calendar_v3.Calendar));
  const calendar = new GoogleCalendarProvider();
  await calendar.cancelEvent("fixture-event", "v1"); code = 410; await calendar.cancelEvent("fixture-event", "v1");
  assert.deepEqual(request, { calendarId: "primary", eventId: "fixture-event" }); assert.deepEqual(options, { headers: { "If-Match": "v1" } });
  code = 412; await assert.rejects(calendar.cancelEvent("fixture-event", "v1"));
});

test("Google Meet retrieval reads real video endpoints and repairs failed conferences with a version guard", async () => {
  let data: calendar_v3.Schema$Event = { id: "fixture-event", etag: "v1", conferenceData: { createRequest: { status: { statusCode: "pending" } } } };
  let repairs = 0, request: calendar_v3.Params$Resource$Events$Patch | undefined, options: unknown;
  mock.method(calendarApi, "calendar", () => ({ events: {
    get: async () => ({ data }),
    patch: async (input: calendar_v3.Params$Resource$Events$Patch, opts: unknown) => { repairs++; request = input; options = opts; return { data: { id: "fixture-event", conferenceData: { entryPoints: [{ entryPointType: "video", uri: "https://meet.google.com/fixture-only" }] } } }; },
  } } as unknown as calendar_v3.Calendar));
  const calendar = new GoogleCalendarProvider();
  assert.equal((await calendar.getEvent("fixture-event", true))?.meetingUrl, undefined); assert.equal(repairs, 0);
  data = { ...data, conferenceData: { createRequest: { status: { statusCode: "failure" } } } };
  assert.equal((await calendar.getEvent("fixture-event", true))?.meetingUrl, "https://meet.google.com/fixture-only");
  assert.equal(repairs, 1); assert.equal(request?.conferenceDataVersion, 1); assert.deepEqual(options, { headers: { "If-Match": "v1" } });
  assert.equal(request?.requestBody?.attendees, undefined);
});

test("calendar patch uses persisted version and preserves UTC timestamps", async () => {
  let request: calendar_v3.Params$Resource$Events$Patch | undefined, options: unknown;
  mock.method(calendarApi, "calendar", () => ({ events: { patch: async (input: calendar_v3.Params$Resource$Events$Patch, opts: unknown) => { request = input; options = opts; return { data: { id: "fixture-event" } }; } } } as unknown as calendar_v3.Calendar));
  await new GoogleCalendarProvider().updateEvent({ externalEventId: "fixture-event", etag: "v1", startsAt, endsAt, timezone: "Europe/Vienna" });
  assert.deepEqual(options, { headers: { "If-Match": "v1" } }); assert.equal(request?.requestBody?.start?.dateTime, startsAt.toISOString());
});
