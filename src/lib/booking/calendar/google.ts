import {
  randomUUID,
} from "node:crypto";

import {
  google,
} from "googleapis";

import {
  DateTime,
} from "luxon";

import type {
  CalendarEventResult,
  CalendarProvider,
  CreateCalendarEventInput,
  GetBusyPeriodsExcludingEventInput,
  GetBusyPeriodsInput,
  UpdateCalendarEventInput,
} from "@/lib/booking/calendar/provider";

import type {
  TimePeriod,
} from "@/lib/booking/types";

/* =========================================================
   CONFIG
========================================================= */

type GoogleCalendarConfig = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  calendarId: string;
};

function getGoogleCalendarConfig(): GoogleCalendarConfig {
  const clientId =
    process.env
      .GOOGLE_CALENDAR_CLIENT_ID;

  const clientSecret =
    process.env
      .GOOGLE_CALENDAR_CLIENT_SECRET;

  const refreshToken =
    process.env
      .GOOGLE_CALENDAR_REFRESH_TOKEN;

  const calendarId =
    process.env
      .GOOGLE_CALENDAR_ID ??
    "primary";

  if (!clientId) {
    throw new Error(
      "GOOGLE_CALENDAR_CLIENT_ID is not configured.",
    );
  }

  if (!clientSecret) {
    throw new Error(
      "GOOGLE_CALENDAR_CLIENT_SECRET is not configured.",
    );
  }

  if (!refreshToken) {
    throw new Error(
      "GOOGLE_CALENDAR_REFRESH_TOKEN is not configured.",
    );
  }

  return {
    clientId,
    clientSecret,
    refreshToken,
    calendarId,
  };
}

/* =========================================================
   AUTH
========================================================= */

function createGoogleAuth() {
  const {
    clientId,
    clientSecret,
    refreshToken,
  } =
    getGoogleCalendarConfig();

  const auth =
    new google.auth.OAuth2(
      clientId,
      clientSecret,
    );

  auth.setCredentials({
    refresh_token:
      refreshToken,
  });

  return auth;
}

/* =========================================================
   DATE HELPERS
========================================================= */

function parseGoogleEventDate({
  dateTime,
  date,
  timezone,
}: {
  dateTime:
    | string
    | null
    | undefined;

  date:
    | string
    | null
    | undefined;

  timezone:
    string;
}): Date | null {
  if (dateTime) {
    const parsed =
      new Date(
        dateTime,
      );

    return Number.isNaN(
      parsed.getTime(),
    )
      ? null
      : parsed;
  }

  if (!date) {
    return null;
  }

  const parsed =
    DateTime.fromISO(
      date,
      {
        zone:
          timezone,
      },
    ).startOf(
      "day",
    );

  return parsed.isValid
    ? parsed.toJSDate()
    : null;
}

/* =========================================================
   PROVIDER
========================================================= */

export class GoogleCalendarProvider
  implements CalendarProvider
{
  private readonly calendar;

  private readonly calendarId:
    string;

  constructor() {
    const {
      calendarId,
    } =
      getGoogleCalendarConfig();

    this.calendarId =
      calendarId;

    this.calendar =
      google.calendar({
        version:
          "v3",

        auth:
          createGoogleAuth(),
      });
  }

  /* =======================================================
     FREE / BUSY

     Standard customer-facing availability.
  ======================================================= */

  async getBusyPeriods(
    input: GetBusyPeriodsInput,
  ): Promise<TimePeriod[]> {
    const response =
      await this.calendar.freebusy.query({
        requestBody: {
          timeMin:
            input.startsAt.toISOString(),

          timeMax:
            input.endsAt.toISOString(),

          items: [
            {
              id:
                this.calendarId,
            },
          ],
        },
      });

    const calendarData =
      response.data.calendars?.[
        this.calendarId
      ];

    const busy =
      calendarData?.busy ??
      [];

    return busy.flatMap(
      (
        period,
      ): TimePeriod[] => {
        if (
          !period.start ||
          !period.end
        ) {
          return [];
        }

        const startsAt =
          new Date(
            period.start,
          );

        const endsAt =
          new Date(
            period.end,
          );

        if (
          Number.isNaN(
            startsAt.getTime(),
          ) ||
          Number.isNaN(
            endsAt.getTime(),
          ) ||
          endsAt <=
            startsAt
        ) {
          return [];
        }

        return [
          {
            startsAt,
            endsAt,
          },
        ];
      },
    );
  }

  /* =======================================================
     BUSY PERIODS EXCLUDING ONE EVENT

     Used only when rescheduling an existing booking.

     Important:
     We intentionally use events.list instead of FreeBusy
     here.

     FreeBusy removes event identity. If the current booking
     overlaps another real event, blindly subtracting the
     current time range could incorrectly make occupied time
     appear available.

     Event-level results allow us to remove ONLY the exact
     Google event belonging to the booking being moved.
  ======================================================= */

  async getBusyPeriodsExcludingEvent(
    input:
      GetBusyPeriodsExcludingEventInput,
  ): Promise<TimePeriod[]> {
    const response =
      await this.calendar.events.list({
        calendarId:
          this.calendarId,

        timeMin:
          input.startsAt.toISOString(),

        timeMax:
          input.endsAt.toISOString(),

        singleEvents:
          true,

        showDeleted:
          false,

        orderBy:
          "startTime",

        maxResults:
          2500,
      });

    const calendarTimezone =
      response.data.timeZone ??
      "UTC";

    const events =
      response.data.items ??
      [];

    return events.flatMap(
      (
        event,
      ): TimePeriod[] => {
        /*
         * Remove only the Google event belonging to the
         * booking currently being rescheduled.
         */
        if (
          event.id ===
          input.excludeExternalEventId
        ) {
          return [];
        }

        /*
         * Cancelled and transparent events do not block
         * booking availability.
         */
        if (
          event.status ===
            "cancelled" ||
          event.transparency ===
            "transparent"
        ) {
          return [];
        }

        const startTimezone =
          event.start?.timeZone ??
          calendarTimezone;

        const endTimezone =
          event.end?.timeZone ??
          calendarTimezone;

        const startsAt =
          parseGoogleEventDate({
            dateTime:
              event.start
                ?.dateTime,

            date:
              event.start
                ?.date,

            timezone:
              startTimezone,
          });

        const endsAt =
          parseGoogleEventDate({
            dateTime:
              event.end
                ?.dateTime,

            date:
              event.end
                ?.date,

            timezone:
              endTimezone,
          });

        if (
          !startsAt ||
          !endsAt ||
          endsAt <=
            startsAt
        ) {
          return [];
        }

        return [
          {
            startsAt,
            endsAt,
          },
        ];
      },
    );
  }

  /* =======================================================
     CREATE EVENT

     Google Calendar is infrastructure only.

     The customer is intentionally NOT added as a Google
     attendee. Resend owns customer communication.
  ======================================================= */

  async createEvent(
    input: CreateCalendarEventInput,
  ): Promise<CalendarEventResult> {
    const response =
      await this.calendar.events.insert({
        calendarId:
          this.calendarId,

        conferenceDataVersion:
          1,

        requestBody: {
          summary:
            input.title,

          description:
            input.description,

          start: {
            dateTime:
              input.startsAt.toISOString(),

            timeZone:
              input.timezone,
          },

          end: {
            dateTime:
              input.endsAt.toISOString(),

            timeZone:
              input.timezone,
          },

          /*
           * No customer attendees.
           */
          conferenceData: {
            createRequest: {
              requestId:
                randomUUID(),

              conferenceSolutionKey: {
                type:
                  "hangoutsMeet",
              },
            },
          },

          reminders: {
            useDefault:
              true,
          },
        },
      });

    const eventId =
      response.data.id;

    if (!eventId) {
      throw new Error(
        "Google Calendar did not return an event ID.",
      );
    }

    return {
      externalEventId:
        eventId,

      htmlUrl:
        response.data
          .htmlLink ??
        undefined,

      meetingUrl:
        response.data
          .hangoutLink ??
        undefined,
    };
  }

  /* =======================================================
     UPDATE EVENT
  ======================================================= */

  async updateEvent(
    input: UpdateCalendarEventInput,
  ): Promise<CalendarEventResult> {
    const response =
      await this.calendar.events.patch({
        calendarId:
          this.calendarId,

        eventId:
          input.externalEventId,

        conferenceDataVersion:
          1,

        requestBody: {
          summary:
            input.title,

          description:
            input.description,

          start:
            input.startsAt
              ? {
                  dateTime:
                    input.startsAt.toISOString(),

                  timeZone:
                    input.timezone,
                }
              : undefined,

          end:
            input.endsAt
              ? {
                  dateTime:
                    input.endsAt.toISOString(),

                  timeZone:
                    input.timezone,
                }
              : undefined,

          /*
           * Again: no customer attendees.
           */
        },
      });

    const eventId =
      response.data.id;

    if (!eventId) {
      throw new Error(
        "Google Calendar did not return an event ID.",
      );
    }

    return {
      externalEventId:
        eventId,

      htmlUrl:
        response.data
          .htmlLink ??
        undefined,

      meetingUrl:
        response.data
          .hangoutLink ??
        undefined,
    };
  }

  /* =======================================================
     DELETE EVENT
  ======================================================= */

  async cancelEvent(
    externalEventId:
      string,
  ): Promise<void> {
    await this.calendar.events.delete({
      calendarId:
        this.calendarId,

      eventId:
        externalEventId,
    });
  }
}