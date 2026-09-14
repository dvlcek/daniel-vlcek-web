import {
  DateTime,
} from "luxon";

import {
  AvailabilityOverrideType,
  BookingStatus,
} from "@/generated/prisma/enums";

import {
  getCalendarProvider,
} from "@/lib/booking/calendar";

import {
  bookingConfig,
} from "@/lib/booking/config";

import {
  getDb,
} from "@/lib/db";

/* =========================================================
   TYPES
========================================================= */

type MinuteWindow = {
  startMinute: number;
  endMinute: number;
};

export type ValidateRescheduleSlotInput = {
  bookingId: string;

  externalCalendarEventId:
    string;

  requestedStartsAt:
    Date;
};

export type ValidatedRescheduleSlot = {
  startsAt: Date;
  endsAt: Date;
};

/* =========================================================
   WINDOW HELPERS
========================================================= */

function normalizeWindow(
  window:
    MinuteWindow,
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
    endMinute <=
    startMinute
  ) {
    return null;
  }

  return {
    startMinute,
    endMinute,
  };
}

function mergeWindows(
  windows:
    MinuteWindow[],
): MinuteWindow[] {
  const normalized =
    windows
      .map(
        normalizeWindow,
      )
      .filter(
        (
          value,
        ): value is MinuteWindow =>
          value !==
          null,
      )
      .sort(
        (
          left,
          right,
        ) =>
          left.startMinute -
          right.startMinute,
      );

  if (
    normalized.length ===
    0
  ) {
    return [];
  }

  const result:
    MinuteWindow[] =
    [
      {
        ...normalized[0],
      },
    ];

  for (
    let index =
      1;
    index <
    normalized.length;
    index +=
      1
  ) {
    const current =
      normalized[index];

    const previous =
      result[
        result.length -
          1
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

    result.push({
      ...current,
    });
  }

  return result;
}

function subtractWindow(
  source:
    MinuteWindow[],

  block:
    MinuteWindow,
): MinuteWindow[] {
  const normalizedBlock =
    normalizeWindow(
      block,
    );

  if (!normalizedBlock) {
    return source;
  }

  const result:
    MinuteWindow[] =
    [];

  for (
    const window of
    source
  ) {
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
   DATE HELPERS
========================================================= */

function databaseWeekday(
  date:
    DateTime,
): number {
  return date.weekday ===
    7
    ? 0
    : date.weekday;
}

function periodsOverlap(
  candidateStart:
    DateTime,

  candidateEnd:
    DateTime,

  busyStart:
    DateTime,

  busyEnd:
    DateTime,
): boolean {
  return (
    candidateStart <
      busyEnd &&
    candidateEnd >
      busyStart
  );
}

/* =========================================================
   VALIDATOR
========================================================= */

export async function validateRescheduleSlot(
  input:
    ValidateRescheduleSlotInput,
): Promise<
  ValidatedRescheduleSlot | null
> {
  const timezone =
    bookingConfig.timezone;

  const now =
    DateTime.now().setZone(
      timezone,
    );

  const today =
    now.startOf(
      "day",
    );

  const requestedStartUtc =
    DateTime.fromJSDate(
      input.requestedStartsAt,
      {
        zone:
          "utc",
      },
    );

  if (
    !requestedStartUtc.isValid
  ) {
    return null;
  }

  const requestedStartLocal =
    requestedStartUtc.setZone(
      timezone,
    );

  /*
   * Booking slots are minute-aligned.
   */
  if (
    requestedStartLocal.second !==
      0 ||
    requestedStartLocal.millisecond !==
      0
  ) {
    return null;
  }

  const requestedDay =
    requestedStartLocal.startOf(
      "day",
    );

  const horizonDay =
    today.plus({
      days:
        bookingConfig
          .bookingHorizonDays,
    });

  if (
    requestedDay <
      today ||
    requestedDay >
      horizonDay
  ) {
    return null;
  }

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

  if (
    requestedStartUtc <
    minimumStart
  ) {
    return null;
  }

  /* =======================================================
     CANDIDATE SLOT
  ======================================================= */

  const candidateMinute =
    requestedStartLocal.hour *
      60 +
    requestedStartLocal.minute;

  const candidateEndMinute =
    candidateMinute +
    bookingConfig
      .slotDurationMinutes;

  if (
    candidateEndMinute >
    1440
  ) {
    return null;
  }

  const candidateEndUtc =
    requestedStartUtc.plus({
      minutes:
        bookingConfig
          .slotDurationMinutes,
    });

  const dateKey =
    requestedDay.toFormat(
      "yyyy-MM-dd",
    );

  const weekday =
    databaseWeekday(
      requestedDay,
    );

  const db =
    getDb();

  /* =======================================================
     WEEKLY RULES + OVERRIDES
  ======================================================= */

  const [
    rules,
    overrides,
  ] =
    await Promise.all([
      db.availabilityRule.findMany({
        where: {
          weekday,

          enabled:
            true,
        },

        orderBy: {
          startMinute:
            "asc",
        },
      }),

      db.availabilityOverride.findMany({
        where: {
          dateKey,
        },

        orderBy: {
          startMinute:
            "asc",
        },
      }),
    ]);

  let windows =
    mergeWindows(
      rules.map(
        (
          rule,
        ) => ({
          startMinute:
            rule.startMinute,

          endMinute:
            rule.endMinute,
        }),
      ),
    );

  /*
   * BLOCK overrides first.
   */
  for (
    const override of
    overrides.filter(
      (
        item,
      ) =>
        item.type ===
        AvailabilityOverrideType.BLOCK,
    )
  ) {
    if (
      override.startMinute ===
        null ||
      override.endMinute ===
        null
    ) {
      windows =
        [];

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
   * AVAILABLE overrides reopen/add time.
   */
  for (
    const override of
    overrides.filter(
      (
        item,
      ) =>
        item.type ===
        AvailabilityOverrideType.AVAILABLE,
    )
  ) {
    if (
      override.startMinute ===
        null ||
      override.endMinute ===
        null
    ) {
      windows.push({
        startMinute:
          0,

        endMinute:
          1440,
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

  /* =======================================================
     SLOT MUST BELONG TO AN ACTUAL GENERATED GRID

     Example:
     Window 17:00–20:00, duration 30m.

     Valid:
     17:00
     17:30
     18:00
     ...

     Invalid:
     17:12
  ======================================================= */

  const matchingWindow =
    windows.find(
      (
        window,
      ) =>
        candidateMinute >=
          window.startMinute &&
        candidateEndMinute <=
          window.endMinute &&
        (
          candidateMinute -
          window.startMinute
        ) %
          bookingConfig
            .slotDurationMinutes ===
          0,
    );

  if (
    !matchingWindow
  ) {
    return null;
  }

  /* =======================================================
     INTERNAL BOOKINGS

     Exclude the booking being rescheduled.

     Buffers are included in the database conflict test.
  ======================================================= */

  const internalConflict =
    await db.booking.findFirst({
      where: {
        id: {
          not:
            input.bookingId,
        },

        status: {
          in: [
            BookingStatus.PENDING,
            BookingStatus.CONFIRMED,
          ],
        },

        startsAt: {
          lt:
            candidateEndUtc
              .plus({
                minutes:
                  bookingConfig
                    .bufferBeforeMinutes,
              })
              .toJSDate(),
        },

        endsAt: {
          gt:
            requestedStartUtc
              .minus({
                minutes:
                  bookingConfig
                    .bufferAfterMinutes,
              })
              .toJSDate(),
        },
      },

      select: {
        id:
          true,
      },
    });

  if (
    internalConflict
  ) {
    return null;
  }

  /* =======================================================
     GOOGLE CALENDAR

     For rescheduling we MUST be able to remove only the
     current booking event by its Google event ID.

     If the provider cannot do that safely, fail closed.
  ======================================================= */

  const calendarProvider =
    getCalendarProvider();

  if (
    !calendarProvider ||
    !calendarProvider
      .getBusyPeriodsExcludingEvent
  ) {
    return null;
  }

  const dayStartUtc =
    requestedDay
      .toUTC()
      .toJSDate();

  const dayEndUtc =
    requestedDay
      .plus({
        days:
          1,
      })
      .toUTC()
      .toJSDate();

  const externalBusy =
    await calendarProvider
      .getBusyPeriodsExcludingEvent({
        startsAt:
          dayStartUtc,

        endsAt:
          dayEndUtc,

        excludeExternalEventId:
          input.externalCalendarEventId,
      });

  for (
    const period of
    externalBusy
  ) {
    const busyStart =
      DateTime.fromJSDate(
        period.startsAt,
        {
          zone:
            "utc",
        },
      ).minus({
        minutes:
          bookingConfig
            .bufferBeforeMinutes,
      });

    const busyEnd =
      DateTime.fromJSDate(
        period.endsAt,
        {
          zone:
            "utc",
        },
      ).plus({
        minutes:
          bookingConfig
            .bufferAfterMinutes,
      });

    if (
      !busyStart.isValid ||
      !busyEnd.isValid
    ) {
      /*
       * Invalid external calendar data is unsafe.
       * Fail closed.
       */
      return null;
    }

    if (
      periodsOverlap(
        requestedStartUtc,
        candidateEndUtc,
        busyStart,
        busyEnd,
      )
    ) {
      return null;
    }
  }

  return {
    startsAt:
      requestedStartUtc.toJSDate(),

    endsAt:
      candidateEndUtc.toJSDate(),
  };
}