import { randomUUID } from "node:crypto";

import { google } from "googleapis";

import type {
  CalendarEventResult,
  CalendarProvider,
  CreateCalendarEventInput,
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
    process.env.GOOGLE_CALENDAR_CLIENT_ID;

  const clientSecret =
    process.env.GOOGLE_CALENDAR_CLIENT_SECRET;

  const refreshToken =
    process.env.GOOGLE_CALENDAR_REFRESH_TOKEN;

  const calendarId =
    process.env.GOOGLE_CALENDAR_ID ??
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
  } = getGoogleCalendarConfig();

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
   PROVIDER
========================================================= */

export class GoogleCalendarProvider
  implements CalendarProvider
{
  private readonly calendar;

  private readonly calendarId: string;

  constructor() {
    const {
      calendarId,
    } =
      getGoogleCalendarConfig();

    this.calendarId =
      calendarId;

    this.calendar =
      google.calendar({
        version: "v3",
        auth:
          createGoogleAuth(),
      });
  }

  /* =======================================================
     FREE / BUSY
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
      calendarData?.busy ?? [];

    return busy.flatMap(
      (period) => {
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
          )
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

     IMPORTANT:
     Client is intentionally NOT added as Google attendee.

     Google Calendar is infrastructure only:
     - stores Daniel's event
     - creates Google Meet
     - blocks availability

     Customer communication is handled by Resend.
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
           * No attendees.
           *
           * This prevents Google from becoming
           * the customer-facing invitation layer.
           */

          conferenceData: {
            createRequest: {
              requestId:
                randomUUID(),

              conferenceSolutionKey:
                {
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
        response.data.htmlLink ??
        undefined,

      meetingUrl:
        response.data.hangoutLink ??
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
           * Again: no attendees.
           * Resend owns customer communication.
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
        response.data.htmlLink ??
        undefined,

      meetingUrl:
        response.data.hangoutLink ??
        undefined,
    };
  }

  /* =======================================================
     DELETE EVENT
  ======================================================= */

  async cancelEvent(
    externalEventId: string,
  ): Promise<void> {
    await this.calendar.events.delete({
      calendarId:
        this.calendarId,

      eventId:
        externalEventId,
    });
  }
}