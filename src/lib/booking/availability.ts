import {
  DateTime,
} from "luxon";

import {
  AvailabilityOverrideType,
  BookingStatus,
} from "@/generated/prisma/enums";

import {
  bookingConfig,
} from "@/lib/booking/config";

import {
  getCalendarProvider,
} from "@/lib/booking/calendar";

import {
  getDb,
} from "@/lib/db";

/* =========================================================
   PUBLIC TYPES
========================================================= */

export type BookingSlot = {
  startsAt: string;
  endsAt: string;
  localTime: string;
};

export type BookingAvailabilityDay = {
  date: string;
  weekday: string;
  label: string;
  slots: BookingSlot[];
};

export type BookingAvailabilityResult = {
  timezone: string;
  slotDurationMinutes: number;
  days: BookingAvailabilityDay[];
};

export type GetBookingAvailabilityInput = {
  fromDate?: string;
  days?: number;
};

/* =========================================================
   INTERNAL TYPES
========================================================= */

type MinuteWindow = {
  startMinute: number;
  endMinute: number;
};

type BusyPeriod = {
  startsAt: DateTime;
  endsAt: DateTime;
};

/* =========================================================
   DATE HELPERS
========================================================= */

function getDatabaseWeekday(
  date: DateTime,
): number {
  /*
   * Luxon:
   * Monday = 1
   * Sunday = 7
   *
   * DB:
   * Sunday = 0
   * Monday = 1
   */
  return date.weekday === 7
    ? 0
    : date.weekday;
}

function getDateKey(
  date: DateTime,
): string {
  return date.toFormat(
    "yyyy-MM-dd",
  );
}

/* =========================================================
   WINDOW HELPERS
========================================================= */

function normalizeWindow(
  window: MinuteWindow,
): MinuteWindow | null {
  const startMinute =
    Math.max(
      0,
      Math.min(
        1440,
        Math.floor(
          window.startMinute,
        ),
      ),
    );

  const endMinute =
    Math.max(
      0,
      Math.min(
        1440,
        Math.floor(
          window.endMinute,
        ),
      ),
    );

  if (
    endMinute <= startMinute
  ) {
    return null;
  }

  return {
    startMinute,
    endMinute,
  };
}

function mergeWindows(
  windows: MinuteWindow[],
): MinuteWindow[] {
  const normalized =
    windows
      .map(
        normalizeWindow,
      )
      .filter(
        (
          window,
        ): window is MinuteWindow =>
          window !== null,
      )
      .sort(
        (a, b) =>
          a.startMinute -
          b.startMinute,
      );

  if (
    normalized.length === 0
  ) {
    return [];
  }

  const merged: MinuteWindow[] =
    [
      {
        ...normalized[0],
      },
    ];

  for (
    let index = 1;
    index <
    normalized.length;
    index += 1
  ) {
    const current =
      normalized[index];

    const previous =
      merged[
        merged.length - 1
      ];

    if (
      current.startMinute <=
      previous.endMinute
    ) {
      previous.endMinute =
        Math.max(
          previous.endMinute,
          current.endMinute,
        );

      continue;
    }

    merged.push({
      ...current,
    });
  }

  return merged;
}

function subtractWindow(
  source: MinuteWindow[],
  block: MinuteWindow,
): MinuteWindow[] {
  const normalizedBlock =
    normalizeWindow(
      block,
    );

  if (!normalizedBlock) {
    return source;
  }

  const result: MinuteWindow[] =
    [];

  for (
    const window of source
  ) {
    /*
     * No overlap.
     */
    if (
      normalizedBlock.endMinute <=
        window.startMinute ||
      normalizedBlock.startMinute >=
        window.endMinute
    ) {
      result.push(
        window,
      );

      continue;
    }

    /*
     * Keep left side.
     */
    if (
      normalizedBlock.startMinute >
      window.startMinute
    ) {
      result.push({
        startMinute:
          window.startMinute,

        endMinute:
          Math.min(
            normalizedBlock.startMinute,
            window.endMinute,
          ),
      });
    }

    /*
     * Keep right side.
     */
    if (
      normalizedBlock.endMinute <
      window.endMinute
    ) {
      result.push({
        startMinute:
          Math.max(
            normalizedBlock.endMinute,
            window.startMinute,
          ),

        endMinute:
          window.endMinute,
      });
    }
  }

  return mergeWindows(
    result,
  );
}

/* =========================================================
   BUSY HELPERS
========================================================= */

function normalizeBusyPeriod(
  startsAt: Date,
  endsAt: Date,
): BusyPeriod | null {
  const start =
    DateTime.fromJSDate(
      startsAt,
      {
        zone: "utc",
      },
    );

  const end =
    DateTime.fromJSDate(
      endsAt,
      {
        zone: "utc",
      },
    );

  if (
    !start.isValid ||
    !end.isValid ||
    end <= start
  ) {
    return null;
  }

  /*
   * Apply booking buffers around busy time.
   *
   * Example:
   * Google event 18:00–18:30
   * bufferAfter = 15
   *
   * Effective busy period:
   * 18:00–18:45
   */
  return {
    startsAt:
      start.minus({
        minutes:
          bookingConfig
            .bufferBeforeMinutes,
      }),

    endsAt:
      end.plus({
        minutes:
          bookingConfig
            .bufferAfterMinutes,
      }),
  };
}

function periodsOverlap(
  candidateStart: DateTime,
  candidateEnd: DateTime,
  busy: BusyPeriod,
): boolean {
  return (
    candidateStart <
      busy.endsAt &&
    candidateEnd >
      busy.startsAt
  );
}

/* =========================================================
   AVAILABILITY
========================================================= */

export async function getBookingAvailability(
  input: GetBookingAvailabilityInput = {},
): Promise<BookingAvailabilityResult> {
  const timezone =
    bookingConfig.timezone;

  const now =
    DateTime.now().setZone(
      timezone,
    );

  const today =
    now.startOf("day");

  /* =======================================================
     REQUESTED RANGE
  ======================================================= */

  let requestedStart =
    input.fromDate
      ? DateTime.fromISO(
          input.fromDate,
          {
            zone: timezone,
          },
        ).startOf(
          "day",
        )
      : today;

  if (
    !requestedStart.isValid
  ) {
    throw new Error(
      "Invalid availability start date.",
    );
  }

  /*
   * Never allow querying dates
   * before today.
   */
  if (
    requestedStart <
    today
  ) {
    requestedStart =
      today;
  }

  const requestedDays =
    Math.max(
      1,
      Math.min(
        input.days ?? 14,
        bookingConfig
          .bookingHorizonDays +
          1,
      ),
    );

  const horizonEnd =
    today.plus({
      days:
        bookingConfig
          .bookingHorizonDays,
    });

  if (
    requestedStart >
    horizonEnd
  ) {
    return {
      timezone,

      slotDurationMinutes:
        bookingConfig
          .slotDurationMinutes,

      days: [],
    };
  }

  const requestedEnd =
    requestedStart.plus({
      days:
        requestedDays - 1,
    });

  const actualEnd =
    requestedEnd >
    horizonEnd
      ? horizonEnd
      : requestedEnd;

  const rangeStart =
    requestedStart.startOf(
      "day",
    );

  const rangeEndExclusive =
    actualEnd
      .plus({
        days: 1,
      })
      .startOf("day");

  /* =======================================================
     DATABASE
  ======================================================= */

  const db =
    getDb();

  const [
    rules,
    overrides,
    bookings,
  ] =
    await Promise.all([
      db.availabilityRule.findMany({
        where: {
          enabled: true,
        },

        orderBy: [
          {
            weekday: "asc",
          },
          {
            startMinute:
              "asc",
          },
        ],
      }),

      db.availabilityOverride.findMany({
        where: {
          dateKey: {
            gte:
              getDateKey(
                rangeStart,
              ),

            lte:
              getDateKey(
                actualEnd,
              ),
          },
        },

        orderBy: [
          {
            dateKey: "asc",
          },
          {
            startMinute:
              "asc",
          },
        ],
      }),

      db.booking.findMany({
        where: {
          status: {
            in: [
              BookingStatus.PENDING,
              BookingStatus.CONFIRMED,
            ],
          },

          startsAt: {
            lt:
              rangeEndExclusive
                .toUTC()
                .toJSDate(),
          },

          endsAt: {
            gt:
              rangeStart
                .toUTC()
                .toJSDate(),
          },
        },

        select: {
          startsAt: true,
          endsAt: true,
        },
      }),
    ]);

  /* =======================================================
     INTERNAL BOOKING BUSY PERIODS
  ======================================================= */

  const internalBusyPeriods =
    bookings.flatMap(
      (
        booking,
      ): BusyPeriod[] => {
        const busy =
          normalizeBusyPeriod(
            booking.startsAt,
            booking.endsAt,
          );

        return busy
          ? [busy]
          : [];
      },
    );

  /* =======================================================
     GOOGLE CALENDAR BUSY PERIODS
  ======================================================= */

  const calendarProvider =
    getCalendarProvider();

  let externalBusyPeriods: BusyPeriod[] =
    [];

  if (calendarProvider) {
    /*
     * Important:
     *
     * If Google Calendar is configured but
     * unreachable, we intentionally allow
     * this error to propagate.
     *
     * Showing zero busy periods on an API
     * failure could cause a double booking.
     * Failing closed is safer.
     */
    const externalBusy =
      await calendarProvider.getBusyPeriods(
        {
          startsAt:
            rangeStart
              .toUTC()
              .toJSDate(),

          endsAt:
            rangeEndExclusive
              .toUTC()
              .toJSDate(),
        },
      );

    externalBusyPeriods =
      externalBusy.flatMap(
        (
          period,
        ): BusyPeriod[] => {
          const busy =
            normalizeBusyPeriod(
              period.startsAt,
              period.endsAt,
            );

          return busy
            ? [busy]
            : [];
        },
      );
  }

  const busyPeriods = [
    ...internalBusyPeriods,
    ...externalBusyPeriods,
  ];

  /* =======================================================
     MINIMUM NOTICE
  ======================================================= */

  const minimumStart =
    now
      .plus({
        minutes:
          bookingConfig
            .minimumNoticeMinutes,
      })
      .toUTC();

  /* =======================================================
     BUILD DAYS
  ======================================================= */

  const days: BookingAvailabilityDay[] =
    [];

  let currentDay =
    rangeStart;

  while (
    currentDay <= actualEnd
  ) {
    const dateKey =
      getDateKey(
        currentDay,
      );

    const weekday =
      getDatabaseWeekday(
        currentDay,
      );

    /* =====================================================
       RECURRING WINDOWS
    ===================================================== */

    let windows =
      mergeWindows(
        rules
          .filter(
            (rule) =>
              rule.weekday ===
              weekday,
          )
          .map(
            (rule) => ({
              startMinute:
                rule.startMinute,

              endMinute:
                rule.endMinute,
            }),
          ),
      );

    /* =====================================================
       OVERRIDES
    ===================================================== */

    const dayOverrides =
      overrides.filter(
        (override) =>
          override.dateKey ===
          dateKey,
      );

    /*
     * BLOCK first.
     *
     * AVAILABLE overrides are then able
     * to reopen a specific period.
     */
    for (
      const override of dayOverrides.filter(
        (item) =>
          item.type ===
          AvailabilityOverrideType.BLOCK,
      )
    ) {
      /*
       * No start/end = block whole day.
       */
      if (
        override.startMinute ===
          null ||
        override.endMinute ===
          null
      ) {
        windows = [];

        continue;
      }

      windows =
        subtractWindow(
          windows,
          {
            startMinute:
              override.startMinute,

            endMinute:
              override.endMinute,
          },
        );
    }

    /*
     * Explicit availability overrides.
     */
    for (
      const override of dayOverrides.filter(
        (item) =>
          item.type ===
          AvailabilityOverrideType.AVAILABLE,
      )
    ) {
      /*
       * Whole-day AVAILABLE override.
       */
      if (
        override.startMinute ===
          null ||
        override.endMinute ===
          null
      ) {
        windows.push({
          startMinute: 0,
          endMinute: 1440,
        });

        continue;
      }

      windows.push({
        startMinute:
          override.startMinute,

        endMinute:
          override.endMinute,
      });
    }

    windows =
      mergeWindows(
        windows,
      );

    /* =====================================================
       GENERATE SLOTS
    ===================================================== */

    const slots: BookingSlot[] =
      [];

    for (
      const window of windows
    ) {
      let slotMinute =
        window.startMinute;

      while (
        slotMinute +
          bookingConfig
            .slotDurationMinutes <=
        window.endMinute
      ) {
        const localStart =
          currentDay.plus({
            minutes:
              slotMinute,
          });

        const localEnd =
          localStart.plus({
            minutes:
              bookingConfig
                .slotDurationMinutes,
          });

        const utcStart =
          localStart.toUTC();

        const utcEnd =
          localEnd.toUTC();

        /* ===============================================
           MINIMUM NOTICE
        =============================================== */

        if (
          utcStart <
          minimumStart
        ) {
          slotMinute +=
            bookingConfig
              .slotDurationMinutes;

          continue;
        }

        /* ===============================================
           BUSY CHECK

           Includes:
           - website bookings
           - Google Calendar events
           - configured buffers
        =============================================== */

        const hasConflict =
          busyPeriods.some(
            (busy) =>
              periodsOverlap(
                utcStart,
                utcEnd,
                busy,
              ),
          );

        if (
          hasConflict
        ) {
          slotMinute +=
            bookingConfig
              .slotDurationMinutes;

          continue;
        }

        const startsAt =
          utcStart.toISO({
            suppressMilliseconds:
              true,
          });

        const endsAt =
          utcEnd.toISO({
            suppressMilliseconds:
              true,
          });

        if (
          startsAt &&
          endsAt
        ) {
          slots.push({
            startsAt,
            endsAt,

            localTime:
              localStart.toFormat(
                "HH:mm",
              ),
          });
        }

        slotMinute +=
          bookingConfig
            .slotDurationMinutes;
      }
    }

    days.push({
      date:
        dateKey,

      weekday:
        currentDay.toFormat(
          "cccc",
        ),

      label:
        currentDay.toFormat(
          "d LLL",
        ),

      slots,
    });

    currentDay =
      currentDay.plus({
        days: 1,
      });
  }

  return {
    timezone,

    slotDurationMinutes:
      bookingConfig
        .slotDurationMinutes,

    days,
  };
}