/* =========================================================
   SHARED BOOKING DOMAIN TYPES
========================================================= */

export type TimePeriod = {
  startsAt: Date;
  endsAt: Date;
};

export type AvailableSlot = TimePeriod & {
  timezone: string;
};

export type BookingLeadInput = {
  name: string;
  email: string;

  company?: string;
  website?: string;
  phone?: string;
  message?: string;

  timezone?: string;
};