/* =========================================================
   BOOKING CONFIG
========================================================= */

export type BookingConfig = {
  timezone: string;

  slotDurationMinutes: number;

  minimumNoticeMinutes: number;

  bookingHorizonDays: number;

  bufferBeforeMinutes: number;

  bufferAfterMinutes: number;
};

export const bookingConfig = {
  /*
   * All recurring availability rules are interpreted
   * relative to this timezone.
   */
  timezone: "Europe/Vienna",

  /*
   * Discovery call duration.
   */
  slotDurationMinutes: 30,

  /*
   * Someone cannot book a call less than
   * two hours from now.
   */
  minimumNoticeMinutes: 120,

  /*
   * How far into the future visitors can book.
   */
  bookingHorizonDays: 30,

  /*
   * Reserved space around meetings.
   */
  bufferBeforeMinutes: 0,
  bufferAfterMinutes: 15,
} as const satisfies BookingConfig;