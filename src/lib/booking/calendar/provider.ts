import type {
  TimePeriod,
} from "@/lib/booking/types";

/* =========================================================
   INPUT TYPES
========================================================= */

export type GetBusyPeriodsInput = {
  startsAt: Date;
  endsAt: Date;
};

export type GetBusyPeriodsExcludingEventInput =
  GetBusyPeriodsInput & {
    excludeExternalEventId:
      string;
  };

export type CalendarAttendee = {
  name?: string;
  email: string;
};

export type CreateCalendarEventInput = {
  title: string;

  description?: string;

  startsAt: Date;
  endsAt: Date;

  timezone: string;

  attendees?: CalendarAttendee[];
};

export type UpdateCalendarEventInput = {
  externalEventId: string;

  title?: string;
  description?: string;

  startsAt?: Date;
  endsAt?: Date;

  timezone?: string;

  attendees?: CalendarAttendee[];
};

export type CalendarEventResult = {
  externalEventId: string;

  htmlUrl?: string;

  meetingUrl?: string;
};

/* =========================================================
   PROVIDER CONTRACT
========================================================= */

export interface CalendarProvider {
  getBusyPeriods(
    input: GetBusyPeriodsInput,
  ): Promise<TimePeriod[]>;

  /*
   * Used by rescheduling.
   *
   * A normal FreeBusy response cannot tell us which busy
   * period belongs to the booking currently being moved.
   *
   * Providers that support event-level visibility can
   * exclude the booking's own event while keeping every
   * other real calendar conflict active.
   *
   * Optional by design:
   * providers without support fail closed in the
   * reschedule validator.
   */
  getBusyPeriodsExcludingEvent?(
    input:
      GetBusyPeriodsExcludingEventInput,
  ): Promise<TimePeriod[]>;

  createEvent(
    input: CreateCalendarEventInput,
  ): Promise<CalendarEventResult>;

  updateEvent(
    input: UpdateCalendarEventInput,
  ): Promise<CalendarEventResult>;

  cancelEvent(
    externalEventId: string,
  ): Promise<void>;
}