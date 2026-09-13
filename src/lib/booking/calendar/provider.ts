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