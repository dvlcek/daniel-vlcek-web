import {
  DateTime,
} from "luxon";

import {
  BookingStatus,
  AvailabilityOverrideType,
} from "@/generated/prisma/enums";

import {
  bookingConfig,
} from "@/lib/booking/config";

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
   HELPERS
========================================================= */

function weekdayForDatabase(
  date: DateTime,
): number {
  /*
   * Luxon:
   * Monday = 1
   * ...
   * Sunday = 7
   *
   * Database:
   * Sunday = 0
   * Monday = 1
   * ...
   * Saturday = 6
   */
  return date.weekday % 7;
}

function normalizeWindows(
  windows: MinuteWindow[],
): MinuteWindow[] {
  const sorted = windows
    .filter(
      (window) =>
        Number.isInteger(
          window.startMinute,
        ) &&
        Number.isInteger(
          window.endMinute,
        ) &&
        window.startMinute >= 0 &&
        window.endMinute <= 1440 &&
        window.startMinute <
          window.endMinute,
    )
    .sort(
      (a, b) =>
        a.startMinute -
        b.startMinute,
    );

  const result: MinuteWindow[] =
    [];

  for (const current of sorted) {
    const previous =
      result[result.length - 1];

    if (
      !previous ||
      current.startMinute >
        previous.endMinute
    ) {
      result.push({
        ...current,
      });

      continue;
    }

    previous.endMinute =
      Math.max(
        previous.endMinute,
        current.endMinute,
      );
  }

  return result;
}

/* =========================================================
   BLOCK WINDOW
========================================================= */

function subtractWindow(
  source: MinuteWindow,
  block: MinuteWindow,
): MinuteWindow[] {
  /*
   * No overlap.
   */
  if (
    block.endMinute <=
      source.startMinute ||
    block.startMinute >=
      source.endMinute
  ) {
    return [source];
  }

  const result: MinuteWindow[] =
    [];

  /*
   * Keep portion before block.
   */
  if (
    block.startMinute >
    source.startMinute
  ) {
    result.push({
      startMinute:
        source.startMinute,

      endMinute:
        Math.min(
          block.startMinute,
          source.endMinute,
        ),
    });
  }

  /*
   * Keep portion after block.
   */
  if (
    block.endMinute <
    source.endMinute
  ) {
    result.push({
      startMinute:
        Math.max(
          block.endMinute,
          source.startMinute,
        ),

      endMinute:
        source.endMinute,
    });
  }

  return result;
}

function applyBlockedWindows(
  windows: MinuteWindow[],
  blocks: MinuteWindow[],
): MinuteWindow[] {
  let result =
    normalizeWindows(windows);

  for (const block of blocks) {
    result = result.flatMap(
      (window) =>
        subtractWindow(
          window,
          block,
        ),
    );
  }

  return normalizeWindows(result);
}

/* =========================================================
   DATE LABELS
========================================================= */

function createDateLabels(
  date: DateTime,
): {
  weekday: string;
  label: string;
} {
  return {
    weekday:
      date.toFormat(
        "cccc",
        {
          locale: "en",
        },
      ),

    label:
      date.toFormat(
        "d LLL",
        {
          locale: "en",
        },
      ),
  };
}

/* =========================================================
   BUSY CHECK
========================================================= */

function overlapsBusyPeriod(
  startsAt: DateTime,
  endsAt: DateTime,
  busyPeriods: BusyPeriod[],
): boolean {
  /*
   * Treat configured buffers as part
   * of the reservation footprint.
   */

  const candidateStart =
    startsAt.minus({
      minutes:
        bookingConfig
          .bufferBeforeMinutes,
    });

  const candidateEnd =
    endsAt.plus({
      minutes:
        bookingConfig
          .bufferAfterMinutes,
    });

  return busyPeriods.some(
    (busy) => {
      const busyStart =
        busy.startsAt.minus({
          minutes:
            bookingConfig
              .bufferBeforeMinutes,
        });

      const busyEnd =
        busy.endsAt.plus({
          minutes:
            bookingConfig
              .bufferAfterMinutes,
        });

      return (
        candidateStart <
          busyEnd &&
        candidateEnd >
          busyStart
      );
    },
  );
}

/* =========================================================
   GENERATE AVAILABILITY
========================================================= */

export async function getBookingAvailability(
  options?: {
    fromDate?: string;
    days?: number;
  },
): Promise<BookingAvailabilityResult> {
  const db =
    getDb();

  const timezone =
    bookingConfig.timezone;

  const now =
    DateTime.now().setZone(
      timezone,
    );

  /* =======================================================
     RANGE
  ======================================================= */

  let startDay =
    now.startOf("day");

  if (options?.fromDate) {
    const requested =
      DateTime.fromISO(
        options.fromDate,
        {
          zone: timezone,
        },
      ).startOf("day");

    if (requested.isValid) {
      startDay =
        requested < now.startOf("day")
          ? now.startOf("day")
          : requested;
    }
  }

  const requestedDays =
    options?.days ?? 14;

  const days = Math.min(
    Math.max(
      Math.floor(
        requestedDays,
      ),
      1,
    ),
    bookingConfig.bookingHorizonDays,
  );

  const absoluteHorizon =
    now
      .startOf("day")
      .plus({
        days:
          bookingConfig
            .bookingHorizonDays,
      });

  let endDay =
    startDay.plus({
      days,
    });

  if (
    endDay >
    absoluteHorizon
  ) {
    endDay =
      absoluteHorizon;
  }

  /* =======================================================
     DATABASE DATA
  ======================================================= */

  const startKey =
    startDay.toFormat(
      "yyyy-MM-dd",
    );

  const endKey =
    endDay.toFormat(
      "yyyy-MM-dd",
    );

  const [
    rules,
    overrides,
    bookings,
  ] = await Promise.all([
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
          gte: startKey,
          lt: endKey,
        },
      },

      orderBy: {
        dateKey: "asc",
      },
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
          lt: endDay
            .toUTC()
            .toJSDate(),
        },

        endsAt: {
          gt: startDay
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
     BOOKING BUSY PERIODS
  ======================================================= */

  const busyPeriods: BusyPeriod[] =
    bookings.map(
      (booking) => ({
        startsAt:
          DateTime.fromJSDate(
            booking.startsAt,
            {
              zone: "utc",
            },
          ),

        endsAt:
          DateTime.fromJSDate(
            booking.endsAt,
            {
              zone: "utc",
            },
          ),
      }),
    );

  /* =======================================================
     MINIMUM NOTICE
  ======================================================= */

  const earliestAllowed =
    now.plus({
      minutes:
        bookingConfig
          .minimumNoticeMinutes,
    });

  /* =======================================================
     BUILD DAYS
  ======================================================= */

  const resultDays: BookingAvailabilityDay[] =
    [];

  for (
    let index = 0;
    index < days;
    index += 1
  ) {
    const date =
      startDay.plus({
        days: index,
      });

    if (
      date >=
      absoluteHorizon
    ) {
      break;
    }

    const dateKey =
      date.toFormat(
        "yyyy-MM-dd",
      );

    const weekday =
      weekdayForDatabase(
        date,
      );

    /* =====================================================
       BASE WEEKLY RULES
    ===================================================== */

    let windows: MinuteWindow[] =
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
        );

    windows =
      normalizeWindows(
        windows,
      );

    /* =====================================================
       OVERRIDES FOR THIS DATE
    ===================================================== */

    const dayOverrides =
      overrides.filter(
        (override) =>
          override.dateKey ===
          dateKey,
      );

    const hasWholeDayBlock =
      dayOverrides.some(
        (override) =>
          override.type ===
            AvailabilityOverrideType.BLOCK &&
          override.startMinute ===
            null &&
          override.endMinute ===
            null,
      );

    if (hasWholeDayBlock) {
      windows = [];
    }

    /*
     * AVAILABLE overrides can add
     * extra windows outside the
     * recurring schedule.
     */
    const availableOverrides =
      dayOverrides
        .filter(
          (override) =>
            override.type ===
              AvailabilityOverrideType.AVAILABLE &&
            override.startMinute !==
              null &&
            override.endMinute !==
              null,
        )
        .map(
          (override) => ({
            startMinute:
              override.startMinute!,
            endMinute:
              override.endMinute!,
          }),
        );

    windows = normalizeWindows([
      ...windows,
      ...availableOverrides,
    ]);

    /*
     * Partial BLOCK overrides are
     * subtracted last.
     */
    const blockedWindows =
      dayOverrides
        .filter(
          (override) =>
            override.type ===
              AvailabilityOverrideType.BLOCK &&
            override.startMinute !==
              null &&
            override.endMinute !==
              null,
        )
        .map(
          (override) => ({
            startMinute:
              override.startMinute!,
            endMinute:
              override.endMinute!,
          }),
        );

    windows =
      applyBlockedWindows(
        windows,
        blockedWindows,
      );

    /* =====================================================
       GENERATE SLOTS
    ===================================================== */

    const slots: BookingSlot[] =
      [];

    for (const window of windows) {
      for (
        let minute =
          window.startMinute;

        minute +
            bookingConfig
              .slotDurationMinutes <=
          window.endMinute;

        minute +=
          bookingConfig
            .slotDurationMinutes
      ) {
        const startsAt =
          date
            .startOf("day")
            .plus({
              minutes:
                minute,
            });

        const endsAt =
          startsAt.plus({
            minutes:
              bookingConfig
                .slotDurationMinutes,
          });

        /*
         * Skip slots that violate
         * minimum notice.
         */
        if (
          startsAt <
          earliestAllowed
        ) {
          continue;
        }

        /*
         * Skip existing bookings.
         */
        if (
          overlapsBusyPeriod(
            startsAt.toUTC(),
            endsAt.toUTC(),
            busyPeriods,
          )
        ) {
          continue;
        }

        slots.push({
          startsAt:
            startsAt
              .toUTC()
              .toISO({
                suppressMilliseconds:
                  true,
              }) ?? "",

          endsAt:
            endsAt
              .toUTC()
              .toISO({
                suppressMilliseconds:
                  true,
              }) ?? "",

          localTime:
            startsAt.toFormat(
              "HH:mm",
            ),
        });
      }
    }

    const labels =
      createDateLabels(
        date,
      );

    resultDays.push({
      date:
        dateKey,

      weekday:
        labels.weekday,

      label:
        labels.label,

      slots,
    });
  }

  return {
    timezone,

    slotDurationMinutes:
      bookingConfig
        .slotDurationMinutes,

    days:
      resultDays,
  };
}