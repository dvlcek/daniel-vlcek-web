"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  RefreshCcw,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

/* =========================================================
   TYPES
========================================================= */

type FlowView =
  | "time"
  | "details"
  | "success";

type RequestStatus =
  | "idle"
  | "loading"
  | "error";

type DatePickerMode =
  | "quick"
  | "calendar";

type BookingDetails = {
  name: string;
  email: string;
  website: string;
  bottleneck: string;
};

type BookingSlot = {
  startsAt: string;
  endsAt: string;
  localTime: string;
};

type AvailabilityDay = {
  date: string;
  weekday: string;
  label: string;
  slots: BookingSlot[];
};

type AvailabilityResponse = {
  ok: boolean;

  timezone: string;
  slotDurationMinutes: number;

  days: AvailabilityDay[];

  message?: string;
};

type ConfirmedBooking = {
  id: string;

  startsAt: string;
  endsAt: string;

  timezone: string;
  status: string;
};

type ConfirmBookingResponse = {
  ok: boolean;

  booking?: ConfirmedBooking;

  confirmationEmailSent?: boolean;

  message?: string;
};

/* =========================================================
   AVAILABILITY CACHE
========================================================= */

const AVAILABILITY_CACHE_MS =
  30_000;

const AVAILABILITY_DAYS =
  30;

let cachedAvailability:
  | AvailabilityResponse
  | null = null;

let cachedAvailabilityAt =
  0;

let availabilityPromise:
  | Promise<AvailabilityResponse>
  | null = null;

async function requestAvailability(
  force = false,
): Promise<AvailabilityResponse> {
  const cacheIsFresh =
    cachedAvailability !== null &&
    Date.now() -
      cachedAvailabilityAt <
      AVAILABILITY_CACHE_MS;

  if (
    !force &&
    cacheIsFresh &&
    cachedAvailability
  ) {
    return cachedAvailability;
  }

  if (
    !force &&
    availabilityPromise
  ) {
    return availabilityPromise;
  }

  const promise =
    fetch(
      `/api/booking/availability?days=${AVAILABILITY_DAYS}`,
      {
        method: "GET",
        cache: "no-store",
      },
    )
      .then(
        async (
          response,
        ) => {
          const result =
            (await response.json()) as
              AvailabilityResponse;

          if (
            !response.ok ||
            !result.ok
          ) {
            throw new Error(
              result.message ??
                "Could not load availability.",
            );
          }

          cachedAvailability =
            result;

          cachedAvailabilityAt =
            Date.now();

          return result;
        },
      )
      .finally(
        () => {
          availabilityPromise =
            null;
        },
      );

  availabilityPromise =
    promise;

  return promise;
}

export function preloadBookingAvailability(): void {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  void requestAvailability().catch(
    () => {
      /*
       * Silent background preload.
       * BookingWizard retries if needed.
       */
    },
  );
}

/* =========================================================
   UI
========================================================= */

const fieldClassName = `
  h-[50px]
  w-full

  rounded-[12px]

  border
  border-white/[0.09]

  bg-white/[0.035]

  px-4

  text-[13px]
  text-white

  outline-none

  transition-all
  duration-200

  placeholder:text-white/24

  hover:border-white/[0.14]

  focus:border-[#FF5A1F]/45
  focus:bg-white/[0.05]
  focus:shadow-[0_0_0_3px_rgba(255,90,31,0.06)]
`;

const labelClassName = `
  mb-2

  block

  text-[9px]
  font-semibold
  uppercase
  tracking-[0.22em]

  text-white/38
`;

/* =========================================================
   DATE HELPERS
========================================================= */

function getBrowserTimezone(): string {
  try {
    return (
      Intl.DateTimeFormat()
        .resolvedOptions()
        .timeZone ||
      "Europe/Vienna"
    );
  } catch {
    return "Europe/Vienna";
  }
}

function pad2(
  value: number,
): string {
  return value
    .toString()
    .padStart(
      2,
      "0",
    );
}

function getMonthKey(
  dateKey: string,
): string {
  return dateKey.slice(
    0,
    7,
  );
}

function formatMonthTitle(
  monthKey: string,
): string {
  const [
    year,
    month,
  ] =
    monthKey
      .split("-")
      .map(Number);

  if (
    !year ||
    !month
  ) {
    return monthKey;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      month:
        "long",

      year:
        "numeric",

      timeZone:
        "UTC",
    },
  ).format(
    new Date(
      Date.UTC(
        year,
        month - 1,
        1,
        12,
      ),
    ),
  );
}

function buildMonthCells(
  monthKey: string,
): Array<
  string | null
> {
  const [
    year,
    month,
  ] =
    monthKey
      .split("-")
      .map(Number);

  if (
    !year ||
    !month
  ) {
    return [];
  }

  const firstDay =
    new Date(
      Date.UTC(
        year,
        month - 1,
        1,
      ),
    );

  /*
   * JS:
   * Sunday = 0
   *
   * Calendar:
   * Monday = 0
   */
  const firstWeekday =
    (
      firstDay.getUTCDay() +
      6
    ) % 7;

  const daysInMonth =
    new Date(
      Date.UTC(
        year,
        month,
        0,
      ),
    ).getUTCDate();

  const cells:
    Array<
      string | null
    > = [];

  for (
    let index = 0;
    index <
    firstWeekday;
    index += 1
  ) {
    cells.push(
      null,
    );
  }

  for (
    let day = 1;
    day <=
    daysInMonth;
    day += 1
  ) {
    cells.push(
      `${year}-${pad2(
        month,
      )}-${pad2(
        day,
      )}`,
    );
  }

  /*
   * Complete final row.
   */
  while (
    cells.length %
      7 !==
    0
  ) {
    cells.push(
      null,
    );
  }

  return cells;
}

function formatDateKey(
  dateKey: string,
): string {
  const [
    year,
    month,
    day,
  ] =
    dateKey
      .split("-")
      .map(Number);

  if (
    !year ||
    !month ||
    !day
  ) {
    return dateKey;
  }

  const value =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day,
        12,
      ),
    );

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      weekday:
        "long",

      day:
        "numeric",

      month:
        "long",

      timeZone:
        "UTC",
    },
  ).format(
    value,
  );
}

function formatBookingDate(
  startsAt: string,
  timezone: string,
): string {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      weekday:
        "long",

      day:
        "numeric",

      month:
        "long",

      year:
        "numeric",

      timeZone:
        timezone,
    },
  ).format(
    new Date(
      startsAt,
    ),
  );
}

function formatBookingTimeRange(
  startsAt: string,
  endsAt: string,
  timezone: string,
): string {
  const formatter =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        hour:
          "2-digit",

        minute:
          "2-digit",

        hour12:
          false,

        timeZone:
          timezone,
      },
    );

  return `${formatter.format(
    new Date(
      startsAt,
    ),
  )} — ${formatter.format(
    new Date(
      endsAt,
    ),
  )}`;
}

/* =========================================================
   STEPPER
========================================================= */

function BookingStepper({
  active,
  onTimeClick,
}: {
  active:
    | "time"
    | "details";

  onTimeClick: () => void;
}) {
  return (
    <div
      className="
        mx-auto
        flex
        w-full
        max-w-[680px]
        items-center
        px-5
        pt-6

        sm:px-7
        sm:pt-7
      "
    >
      <button
        type="button"
        onClick={
          onTimeClick
        }
        className="
          group
          flex
          min-w-0
          flex-1
          items-center
          gap-3
          text-left
        "
      >
        <div
          className={`
            flex
            h-[28px]
            w-[28px]
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            text-[8px]
            font-semibold
            transition-all
            duration-300

            ${
              active ===
              "time"
                ? `
                  border-[#FF5A1F]/45
                  bg-[#FF5A1F]/10
                  text-[#FF7040]
                  shadow-[0_0_22px_rgba(255,90,31,0.08)]
                `
                : `
                  border-white/[0.13]
                  bg-white/[0.04]
                  text-white/55
                `
            }
          `}
        >
          {active ===
          "details" ? (
            <Check
              size={11}
              strokeWidth={
                1.9
              }
            />
          ) : (
            "01"
          )}
        </div>

        <span
          className={`
            text-[8px]
            font-semibold
            uppercase
            tracking-[0.21em]

            ${
              active ===
              "time"
                ? "text-white/75"
                : "text-white/38"
            }
          `}
        >
          Time
        </span>
      </button>

      <div
        className="
          mx-4
          h-px
          flex-1
          overflow-hidden
          bg-white/[0.07]

          sm:mx-6
        "
      >
        <div
          className={`
            h-full
            bg-[#FF5A1F]/45
            transition-all
            duration-500

            ${
              active ===
              "details"
                ? "w-full"
                : "w-0"
            }
          `}
        />
      </div>

      <div
        className="
          flex
          min-w-0
          flex-1
          items-center
          justify-end
          gap-3
        "
      >
        <span
          className={`
            text-[8px]
            font-semibold
            uppercase
            tracking-[0.21em]

            ${
              active ===
              "details"
                ? "text-white/75"
                : "text-white/22"
            }
          `}
        >
          Details
        </span>

        <div
          className={`
            flex
            h-[28px]
            w-[28px]
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            text-[8px]
            font-semibold

            ${
              active ===
              "details"
                ? `
                  border-[#FF5A1F]/45
                  bg-[#FF5A1F]/10
                  text-[#FF7040]
                  shadow-[0_0_22px_rgba(255,90,31,0.08)]
                `
                : `
                  border-white/[0.07]
                  bg-white/[0.015]
                  text-white/22
                `
            }
          `}
        >
          02
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   AVAILABILITY PICKER
========================================================= */

function AvailabilityPicker({
  availability,
  status,
  error,
  selectedDate,
  selectedSlot,
  onDateChange,
  onSlotSelect,
  onRetry,
}: {
  availability:
    | AvailabilityResponse
    | null;

  status:
    RequestStatus;

  error:
    string;

  selectedDate:
    string | null;

  selectedSlot:
    BookingSlot | null;

  onDateChange:
    (
      date: string,
    ) => void;

  onSlotSelect:
    (
      slot: BookingSlot,
    ) => void;

  onRetry:
    () => void;
}) {
  const reduceMotion =
    useReducedMotion();

  const dateScrollerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const [
    pickerMode,
    setPickerMode,
  ] =
    useState<DatePickerMode>(
      "quick",
    );

  const [
    canScrollLeft,
    setCanScrollLeft,
  ] =
    useState(false);

  const [
    canScrollRight,
    setCanScrollRight,
  ] =
    useState(false);

  const [
    calendarMonthIndex,
    setCalendarMonthIndex,
  ] =
    useState(0);

  const allDays =
    useMemo(
      () =>
        availability?.days ??
        [],
      [
        availability,
      ],
    );

  const availableDays =
    useMemo(
      () =>
        allDays.filter(
          (
            day,
          ) =>
            day.slots.length >
            0,
        ),
      [
        allDays,
      ],
    );

  const dayMap =
    useMemo(
      () =>
        new Map(
          allDays.map(
            (
              day,
            ) => [
              day.date,
              day,
            ],
          ),
        ),
      [
        allDays,
      ],
    );

  const selectedDay =
    useMemo(
      () =>
        selectedDate
          ? dayMap.get(
              selectedDate,
            ) ??
            null
          : null,
      [
        dayMap,
        selectedDate,
      ],
    );

  const monthKeys =
    useMemo(
      () => {
        const months:
          string[] = [];

        const seen =
          new Set<string>();

        for (
          const day of
          allDays
        ) {
          const key =
            getMonthKey(
              day.date,
            );

          if (
            !seen.has(
              key,
            )
          ) {
            seen.add(
              key,
            );

            months.push(
              key,
            );
          }
        }

        return months;
      },
      [
        allDays,
      ],
    );

  const currentMonthKey =
    monthKeys[
      calendarMonthIndex
    ] ??
    monthKeys[0] ??
    "";

  const calendarCells =
    useMemo(
      () =>
        currentMonthKey
          ? buildMonthCells(
              currentMonthKey,
            )
          : [],
      [
        currentMonthKey,
      ],
    );

  /* =======================================================
     SCROLLER
  ======================================================= */

  const updateScrollButtons =
    useCallback(
      () => {
        const element =
          dateScrollerRef.current;

        if (!element) {
          setCanScrollLeft(
            false,
          );

          setCanScrollRight(
            false,
          );

          return;
        }

        const maxScroll =
          element.scrollWidth -
          element.clientWidth;

        setCanScrollLeft(
          element.scrollLeft >
            4,
        );

        setCanScrollRight(
          element.scrollLeft <
            maxScroll - 4,
        );
      },
      [],
    );

  useEffect(
    () => {
      const element =
        dateScrollerRef.current;

      if (!element) {
        return;
      }

      updateScrollButtons();

      element.addEventListener(
        "scroll",
        updateScrollButtons,
        {
          passive:
            true,
        },
      );

      const resizeObserver =
        new ResizeObserver(
          () => {
            updateScrollButtons();
          },
        );

      resizeObserver.observe(
        element,
      );

      return () => {
        element.removeEventListener(
          "scroll",
          updateScrollButtons,
        );

        resizeObserver.disconnect();
      };
    },
    [
      availableDays.length,
      pickerMode,
      updateScrollButtons,
    ],
  );

  const scrollDates =
    (
      direction:
        | "left"
        | "right",
    ) => {
      const element =
        dateScrollerRef.current;

      if (!element) {
        return;
      }

      const amount =
        Math.max(
          240,
          element.clientWidth *
            0.72,
        );

      element.scrollBy({
        left:
          direction ===
          "right"
            ? amount
            : -amount,

        behavior:
          reduceMotion
            ? "auto"
            : "smooth",
      });
    };

  /* =======================================================
     CALENDAR MONTH SYNC
  ======================================================= */

  useEffect(
    () => {
      if (
        !selectedDate ||
        monthKeys.length ===
          0
      ) {
        return;
      }

      const selectedMonth =
        getMonthKey(
          selectedDate,
        );

      const index =
        monthKeys.indexOf(
          selectedMonth,
        );

      if (
        index >= 0
      ) {
        setCalendarMonthIndex(
          index,
        );
      }
    },
    [
      selectedDate,
      monthKeys,
    ],
  );

  /* =======================================================
     LOADING
  ======================================================= */

  if (
    status ===
      "loading" &&
    !availability
  ) {
    return (
      <div className="mt-7">
        <div
          className="
            flex
            gap-2
            overflow-hidden
          "
        >
          {Array.from({
            length:
              5,
          }).map(
            (
              _,
              index,
            ) => (
              <div
                key={
                  index
                }
                className="
                  h-[68px]
                  min-w-[104px]
                  flex-1
                  animate-pulse
                  rounded-[13px]
                  border
                  border-white/[0.05]
                  bg-white/[0.025]
                "
              />
            ),
          )}
        </div>

        <div
          className="
            mt-5
            rounded-[16px]
            border
            border-white/[0.055]
            bg-black/[0.12]
            p-5
          "
        >
          <div
            className="
              h-[11px]
              w-[130px]
              animate-pulse
              rounded-full
              bg-white/[0.05]
            "
          />

          <div
            className="
              mt-5
              grid
              grid-cols-2
              gap-2

              sm:grid-cols-3
            "
          >
            {Array.from({
              length:
                6,
            }).map(
              (
                _,
                index,
              ) => (
                <div
                  key={
                    index
                  }
                  className="
                    h-[44px]
                    animate-pulse
                    rounded-[11px]
                    bg-white/[0.035]
                  "
                />
              ),
            )}
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (
    status ===
      "error" &&
    !availability
  ) {
    return (
      <div
        className="
          mt-7
          flex
          min-h-[250px]
          flex-col
          items-center
          justify-center
          rounded-[16px]
          border
          border-white/[0.06]
          bg-black/[0.13]
          px-6
          text-center
        "
      >
        <CalendarDays
          size={
            23
          }
          strokeWidth={
            1.5
          }
          className="
            text-white/25
          "
        />

        <p
          className="
            mt-4
            text-[12px]
            text-white/48
          "
        >
          {error}
        </p>

        <button
          type="button"
          onClick={
            onRetry
          }
          className="
            mt-5
            inline-flex
            h-[40px]
            items-center
            gap-2
            rounded-full
            border
            border-white/[0.1]
            px-5
            text-[10px]
            font-semibold
            text-white/60
            transition-all

            hover:border-white/[0.18]
            hover:bg-white/[0.035]
            hover:text-white
          "
        >
          <RefreshCcw
            size={
              12
            }
            strokeWidth={
              1.7
            }
          />

          Try again
        </button>
      </div>
    );
  }

  /* =======================================================
     NO AVAILABILITY
  ======================================================= */

  if (
    availableDays.length ===
    0
  ) {
    return (
      <div
        className="
          mt-7
          flex
          min-h-[250px]
          flex-col
          items-center
          justify-center
          rounded-[16px]
          border
          border-white/[0.06]
          bg-black/[0.13]
          px-6
          text-center
        "
      >
        <CalendarDays
          size={
            23
          }
          strokeWidth={
            1.5
          }
          className="
            text-white/24
          "
        />

        <p
          className="
            mt-4
            text-[13px]
            font-medium
            text-white/72
          "
        >
          No times available.
        </p>

        <p
          className="
            mt-2
            max-w-[320px]
            text-[10.5px]
            leading-[1.65]
            text-white/30
          "
        >
          There are currently
          no open discovery call
          slots in the next 30
          days.
        </p>
      </div>
    );
  }

  /* =======================================================
     PICKER
  ======================================================= */

  return (
    <>
      {/* HEADER */}

      <div
        className="
          mt-7

          flex
          items-center
          justify-between

          gap-4
        "
      >
        <div>
          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.2em]

              text-white/23
            "
          >
            Available dates
          </p>

          <p
            className="
              mt-1

              text-[9px]

              text-white/19
            "
          >
            {pickerMode ===
            "quick"
              ? "Closest available times"
              : "30-day booking window"}
          </p>
        </div>

        {/* VIEW SWITCH */}

        <button
          type="button"
          onClick={() =>
            setPickerMode(
              (
                current,
              ) =>
                current ===
                "quick"
                  ? "calendar"
                  : "quick",
            )
          }
          className="
            group

            inline-flex
            h-[36px]

            shrink-0

            items-center
            gap-2

            rounded-full

            border
            border-white/[0.08]

            bg-white/[0.025]

            px-4

            text-[9px]
            font-semibold

            text-white/43

            transition-all
            duration-200

            hover:border-white/[0.15]
            hover:bg-white/[0.045]
            hover:text-white/72
          "
        >
          <CalendarDays
            size={
              12
            }
            strokeWidth={
              1.7
            }
            className="
              transition-colors

              group-hover:text-[#FF7040]
            "
          />

          {pickerMode ===
          "quick"
            ? "View calendar"
            : "Quick dates"}
        </button>
      </div>

      <AnimatePresence
        mode="wait"
        initial={false}
      >
        {/* =================================================
            QUICK DATES
        ================================================= */}

        {pickerMode ===
          "quick" && (
          <motion.div
            key="quick-dates"
            initial={
              reduceMotion
                ? false
                : {
                    opacity:
                      0,

                    y:
                      4,
                  }
            }
            animate={{
              opacity:
                1,

              y:
                0,
            }}
            exit={{
              opacity:
                0,

              y:
                -3,
            }}
            transition={{
              duration:
                0.2,
            }}
          >
            {/* NAV */}

            <div
              className="
                mt-4

                flex
                items-center
                justify-end

                gap-2
              "
            >
              <button
                type="button"
                aria-label="Previous available dates"
                disabled={
                  !canScrollLeft
                }
                onClick={() =>
                  scrollDates(
                    "left",
                  )
                }
                className="
                  flex
                  h-[32px]
                  w-[32px]

                  items-center
                  justify-center

                  rounded-full

                  border
                  border-white/[0.075]

                  bg-white/[0.02]

                  text-white/38

                  transition-all

                  hover:border-white/[0.14]
                  hover:bg-white/[0.045]
                  hover:text-white/70

                  disabled:pointer-events-none
                  disabled:opacity-15
                "
              >
                <ChevronLeft
                  size={
                    13
                  }
                  strokeWidth={
                    1.7
                  }
                />
              </button>

              <button
                type="button"
                aria-label="Next available dates"
                disabled={
                  !canScrollRight
                }
                onClick={() =>
                  scrollDates(
                    "right",
                  )
                }
                className="
                  flex
                  h-[32px]
                  w-[32px]

                  items-center
                  justify-center

                  rounded-full

                  border
                  border-white/[0.075]

                  bg-white/[0.02]

                  text-white/38

                  transition-all

                  hover:border-[#FF5A1F]/24
                  hover:bg-[#FF5A1F]/[0.05]
                  hover:text-[#FF7040]

                  disabled:pointer-events-none
                  disabled:opacity-15
                "
              >
                <ChevronRight
                  size={
                    13
                  }
                  strokeWidth={
                    1.7
                  }
                />
              </button>
            </div>

            {/* SCROLLER */}

            <div
              className="
                relative

                mt-2
              "
            >
              {canScrollLeft && (
                <div
                  className="
                    pointer-events-none

                    absolute
                    bottom-[10px]
                    left-0
                    top-0
                    z-10

                    w-[25px]

                    bg-gradient-to-r
                    from-[#071014]
                    to-transparent
                  "
                />
              )}

              {canScrollRight && (
                <div
                  className="
                    pointer-events-none

                    absolute
                    bottom-[10px]
                    right-0
                    top-0
                    z-10

                    w-[34px]

                    bg-gradient-to-l
                    from-[#071014]
                    to-transparent
                  "
                />
              )}

              <div
                ref={
                  dateScrollerRef
                }
                className="
                  flex

                  snap-x
                  snap-mandatory

                  gap-2

                  overflow-x-auto

                  pb-3

                  scroll-smooth

                  [scrollbar-color:rgba(255,255,255,0.15)_transparent]
                  [scrollbar-width:thin]

                  [&::-webkit-scrollbar]:h-[5px]

                  [&::-webkit-scrollbar-track]:rounded-full
                  [&::-webkit-scrollbar-track]:bg-white/[0.025]

                  [&::-webkit-scrollbar-thumb]:rounded-full
                  [&::-webkit-scrollbar-thumb]:bg-white/[0.13]

                  hover:[&::-webkit-scrollbar-thumb]:bg-white/[0.22]
                "
              >
                {availableDays.map(
                  (
                    day,
                  ) => {
                    const active =
                      selectedDate ===
                      day.date;

                    return (
                      <motion.button
                        key={
                          day.date
                        }
                        type="button"
                        onClick={() =>
                          onDateChange(
                            day.date,
                          )
                        }
                        whileHover={
                          reduceMotion
                            ? undefined
                            : {
                                y:
                                  -1,
                              }
                        }
                        whileTap={
                          reduceMotion
                            ? undefined
                            : {
                                scale:
                                  0.98,
                              }
                        }
                        className={`
                          min-w-[105px]

                          snap-start

                          rounded-[13px]

                          border

                          px-4
                          py-3.5

                          text-left

                          transition-all
                          duration-200

                          ${
                            active
                              ? `
                                border-[#FF5A1F]/36

                                bg-[#FF5A1F]/[0.075]

                                shadow-[0_0_28px_rgba(255,90,31,0.045)]
                              `
                              : `
                                border-white/[0.065]

                                bg-white/[0.02]

                                hover:border-white/[0.12]
                                hover:bg-white/[0.035]
                              `
                          }
                        `}
                      >
                        <span
                          className={`
                            block

                            text-[8px]
                            font-semibold
                            uppercase
                            tracking-[0.17em]

                            ${
                              active
                                ? "text-[#FF7040]"
                                : "text-white/25"
                            }
                          `}
                        >
                          {
                            day.weekday
                          }
                        </span>

                        <span
                          className="
                            mt-1.5
                            block

                            text-[13px]
                            font-medium

                            text-white/80
                          "
                        >
                          {
                            day.label
                          }
                        </span>
                      </motion.button>
                    );
                  },
                )}

                {/* MORE DATES */}

                <button
                  type="button"
                  onClick={() =>
                    setPickerMode(
                      "calendar",
                    )
                  }
                  className="
                    group

                    flex
                    min-w-[118px]

                    snap-start

                    flex-col
                    items-start
                    justify-center

                    rounded-[13px]

                    border
                    border-dashed
                    border-white/[0.09]

                    bg-white/[0.012]

                    px-4
                    py-3.5

                    text-left

                    transition-all

                    hover:border-[#FF5A1F]/25
                    hover:bg-[#FF5A1F]/[0.035]
                  "
                >
                  <CalendarDays
                    size={
                      14
                    }
                    strokeWidth={
                      1.6
                    }
                    className="
                      text-white/25

                      transition-colors

                      group-hover:text-[#FF7040]
                    "
                  />

                  <span
                    className="
                      mt-2

                      text-[9px]
                      font-semibold

                      text-white/42

                      transition-colors

                      group-hover:text-white/70
                    "
                  >
                    More dates
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* =================================================
            PREMIUM CALENDAR
        ================================================= */}

        {pickerMode ===
          "calendar" && (
          <motion.div
            key="calendar"
            initial={
              reduceMotion
                ? false
                : {
                    opacity:
                      0,

                    y:
                      5,

                    scale:
                      0.995,
                  }
            }
            animate={{
              opacity:
                1,

              y:
                0,

              scale:
                1,
            }}
            exit={{
              opacity:
                0,

              y:
                -4,
            }}
            transition={{
              duration:
                0.22,

              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="
              mt-4

              overflow-hidden

              rounded-[17px]

              border
              border-white/[0.065]

              bg-gradient-to-b
              from-white/[0.032]
              to-white/[0.014]
            "
          >
            {/* CALENDAR HEADER */}

            <div
              className="
                flex
                items-center
                justify-between

                gap-4

                border-b
                border-white/[0.055]

                px-5
                py-4
              "
            >
              <div>
                <p
                  className="
                    text-[14px]
                    font-medium

                    tracking-[-0.025em]

                    text-white/82
                  "
                >
                  {formatMonthTitle(
                    currentMonthKey,
                  )}
                </p>

                <p
                  className="
                    mt-1

                    text-[8px]
                    uppercase
                    tracking-[0.16em]

                    text-white/18
                  "
                >
                  Select an available
                  day
                </p>
              </div>

              <div
                className="
                  flex
                  items-center

                  rounded-full

                  border
                  border-white/[0.07]

                  bg-black/[0.12]

                  p-[3px]
                "
              >
                <button
                  type="button"
                  aria-label="Previous month"
                  disabled={
                    calendarMonthIndex <=
                    0
                  }
                  onClick={() =>
                    setCalendarMonthIndex(
                      (
                        current,
                      ) =>
                        Math.max(
                          0,
                          current -
                            1,
                        ),
                    )
                  }
                  className="
                    flex
                    h-[30px]
                    w-[30px]

                    items-center
                    justify-center

                    rounded-full

                    text-white/35

                    transition-all

                    hover:bg-white/[0.05]
                    hover:text-white/70

                    disabled:pointer-events-none
                    disabled:opacity-15
                  "
                >
                  <ChevronLeft
                    size={
                      13
                    }
                    strokeWidth={
                      1.7
                    }
                  />
                </button>

                <div
                  className="
                    mx-[3px]

                    h-[16px]
                    w-px

                    bg-white/[0.055]
                  "
                />

                <button
                  type="button"
                  aria-label="Next month"
                  disabled={
                    calendarMonthIndex >=
                    monthKeys.length -
                      1
                  }
                  onClick={() =>
                    setCalendarMonthIndex(
                      (
                        current,
                      ) =>
                        Math.min(
                          monthKeys.length -
                            1,
                          current +
                            1,
                        ),
                    )
                  }
                  className="
                    flex
                    h-[30px]
                    w-[30px]

                    items-center
                    justify-center

                    rounded-full

                    text-white/35

                    transition-all

                    hover:bg-white/[0.05]
                    hover:text-white/70

                    disabled:pointer-events-none
                    disabled:opacity-15
                  "
                >
                  <ChevronRight
                    size={
                      13
                    }
                    strokeWidth={
                      1.7
                    }
                  />
                </button>
              </div>
            </div>

            {/* CALENDAR BODY */}

            <div
              className="
                px-4
                pb-4
                pt-3

                sm:px-5
                sm:pb-5
              "
            >
              {/* WEEKDAYS */}

              <div
                className="
                  grid
                  grid-cols-7
                "
              >
                {[
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                  "Sun",
                ].map(
                  (
                    day,
                  ) => (
                    <div
                      key={
                        day
                      }
                      className="
                        flex
                        h-[30px]

                        items-center
                        justify-center

                        text-[7px]
                        font-semibold
                        uppercase
                        tracking-[0.14em]

                        text-white/17
                      "
                    >
                      {day}
                    </div>
                  ),
                )}
              </div>

              {/* DAYS */}

              <div
                className="
                  mt-1

                  grid
                  grid-cols-7

                  gap-[3px]

                  sm:gap-1
                "
              >
                {calendarCells.map(
                  (
                    dateKey,
                    index,
                  ) => {
                    if (!dateKey) {
                      return (
                        <div
                          key={`empty-${index}`}
                          className="
                            aspect-square
                          "
                        />
                      );
                    }

                    const day =
                      dayMap.get(
                        dateKey,
                      );

                    const available =
                      Boolean(
                        day &&
                          day.slots
                            .length >
                            0,
                      );

                    const active =
                      selectedDate ===
                      dateKey;

                    const dayNumber =
                      Number(
                        dateKey.slice(
                          -2,
                        ),
                      );

                    return (
                      <button
                        key={
                          dateKey
                        }
                        type="button"
                        disabled={
                          !available
                        }
                        onClick={() =>
                          onDateChange(
                            dateKey,
                          )
                        }
                        className={`
                          group/day

                          relative

                          aspect-square

                          min-h-[38px]

                          rounded-[10px]

                          border

                          text-[10px]
                          font-medium

                          transition-all
                          duration-200

                          sm:min-h-[43px]

                          ${
                            active
                              ? `
                                border-[#FF5A1F]/42

                                bg-[#FF5A1F]/10

                                text-white

                                shadow-[0_0_25px_rgba(255,90,31,0.07)]
                              `
                              : available
                                ? `
                                  border-transparent

                                  bg-white/[0.018]

                                  text-white/57

                                  hover:border-white/[0.10]
                                  hover:bg-white/[0.045]
                                  hover:text-white/85
                                `
                                : `
                                  cursor-default

                                  border-transparent

                                  bg-transparent

                                  text-white/[0.10]
                                `
                          }
                        `}
                      >
                        <span>
                          {
                            dayNumber
                          }
                        </span>

                        {available && (
                          <span
                            className={`
                              absolute
                              bottom-[6px]
                              left-1/2

                              h-[2px]
                              w-[2px]

                              -translate-x-1/2

                              rounded-full

                              ${
                                active
                                  ? "bg-[#FF7040]"
                                  : "bg-white/24 group-hover/day:bg-[#FF7040]/70"
                              }
                            `}
                          />
                        )}
                      </button>
                    );
                  },
                )}
              </div>

              {/* LEGEND */}

              <div
                className="
                  mt-4

                  flex
                  items-center
                  justify-between

                  gap-4

                  border-t
                  border-white/[0.05]

                  pt-3
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2

                    text-[8px]

                    text-white/20
                  "
                >
                  <span
                    className="
                      h-[3px]
                      w-[3px]

                      rounded-full

                      bg-[#FF7040]/70
                    "
                  />

                  Available
                </div>

                <span
                  className="
                    text-[8px]

                    text-white/14
                  "
                >
                  Next 30 days
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =================================================
          AVAILABLE TIMES
      ================================================= */}

      {selectedDay && (
        <motion.div
          layout
          className="
            mt-4

            rounded-[16px]

            border
            border-white/[0.06]

            bg-black/[0.13]

            p-5
          "
        >
          <div
            className="
              flex
              items-center
              justify-between

              gap-4
            "
          >
            <div>
              <span
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]

                  text-white/23
                "
              >
                Available times
              </span>

              <p
                className="
                  mt-1.5

                  text-[13px]
                  font-medium

                  text-white/72
                "
              >
                {formatDateKey(
                  selectedDay.date,
                )}
              </p>
            </div>

            {availability && (
              <div
                className="
                  flex
                  items-center
                  gap-2

                  text-[8px]
                  uppercase
                  tracking-[0.14em]

                  text-white/20
                "
              >
                <Clock3
                  size={
                    11
                  }
                  strokeWidth={
                    1.6
                  }
                />

                {
                  availability.timezone
                }
              </div>
            )}
          </div>

          <div
            className="
              mt-4

              grid
              grid-cols-2

              gap-2

              sm:grid-cols-3
            "
          >
            {selectedDay.slots.map(
              (
                slot,
              ) => {
                const active =
                  selectedSlot
                    ?.startsAt ===
                  slot.startsAt;

                return (
                  <motion.button
                    key={
                      slot.startsAt
                    }
                    type="button"
                    onClick={() =>
                      onSlotSelect(
                        slot,
                      )
                    }
                    whileHover={
                      reduceMotion
                        ? undefined
                        : {
                            y:
                              -1,
                          }
                    }
                    whileTap={
                      reduceMotion
                        ? undefined
                        : {
                            scale:
                              0.98,
                          }
                    }
                    className={`
                      h-[45px]

                      rounded-[11px]

                      border

                      text-[11px]
                      font-semibold

                      transition-all
                      duration-200

                      ${
                        active
                          ? `
                            border-[#FF5A1F]/45

                            bg-[#FF5A1F]/10

                            text-white

                            shadow-[0_0_20px_rgba(255,90,31,0.05)]
                          `
                          : `
                            border-white/[0.07]

                            bg-white/[0.022]

                            text-white/55

                            hover:border-white/[0.15]
                            hover:bg-white/[0.04]
                            hover:text-white
                          `
                      }
                    `}
                  >
                    {
                      slot.localTime
                    }
                  </motion.button>
                );
              },
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}

/* =========================================================
   BOOKING WIZARD
========================================================= */

export function BookingWizard() {
  const reduceMotion =
    useReducedMotion();

  const [
    view,
    setView,
  ] =
    useState<FlowView>(
      "time",
    );

  const [
    details,
    setDetails,
  ] =
    useState<BookingDetails>({
      name: "",
      email: "",
      website: "",
      bottleneck: "",
    });

  const [
    availability,
    setAvailability,
  ] =
    useState<AvailabilityResponse | null>(
      cachedAvailability,
    );

  const [
    availabilityStatus,
    setAvailabilityStatus,
  ] =
    useState<RequestStatus>(
      cachedAvailability
        ? "idle"
        : "loading",
    );

  const [
    availabilityError,
    setAvailabilityError,
  ] =
    useState("");

  const [
    selectedDate,
    setSelectedDate,
  ] =
    useState<string | null>(
      null,
    );

  const [
    selectedSlot,
    setSelectedSlot,
  ] =
    useState<BookingSlot | null>(
      null,
    );

  const [
    submitStatus,
    setSubmitStatus,
  ] =
    useState<RequestStatus>(
      "idle",
    );

  const [
    submitError,
    setSubmitError,
  ] =
    useState("");

  const [
    booking,
    setBooking,
  ] =
    useState<ConfirmedBooking | null>(
      null,
    );

  const [
    confirmationEmailSent,
    setConfirmationEmailSent,
  ] =
    useState(false);

  /* =======================================================
     AVAILABILITY
  ======================================================= */

  const applyAvailability =
    useCallback(
      (
        data:
          AvailabilityResponse,
      ) => {
        setAvailability(
          data,
        );

        const firstAvailable =
          data.days.find(
            (
              day,
            ) =>
              day.slots.length >
              0,
          );

        setSelectedDate(
          (
            current,
          ) => {
            if (
              current &&
              data.days.some(
                (
                  day,
                ) =>
                  day.date ===
                    current &&
                  day.slots
                    .length >
                    0,
              )
            ) {
              return current;
            }

            return (
              firstAvailable
                ?.date ??
              null
            );
          },
        );
      },
      [],
    );

  const loadAvailability =
    useCallback(
      async (
        force =
          false,
      ) => {
        if (
          !availability
        ) {
          setAvailabilityStatus(
            "loading",
          );
        }

        setAvailabilityError(
          "",
        );

        try {
          const result =
            await requestAvailability(
              force,
            );

          applyAvailability(
            result,
          );

          setAvailabilityStatus(
            "idle",
          );
        } catch (error) {
          setAvailabilityStatus(
            "error",
          );

          setAvailabilityError(
            error instanceof Error
              ? error.message
              : "Could not load availability.",
          );
        }
      },
      [
        applyAvailability,
        availability,
      ],
    );

  useEffect(
    () => {
      void loadAvailability();
    },
    [
      loadAvailability,
    ],
  );

  /* =======================================================
     DETAILS
  ======================================================= */

  const updateDetail =
    (
      key:
        keyof BookingDetails,

      value:
        string,
    ) => {
      setDetails(
        (
          current,
        ) => ({
          ...current,

          [key]:
            value,
        }),
      );
    };

  /* =======================================================
     CREATE BOOKING
  ======================================================= */

  const handleBookingSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      if (
        !selectedSlot ||
        submitStatus ===
          "loading"
      ) {
        return;
      }

      setSubmitStatus(
        "loading",
      );

      setSubmitError(
        "",
      );

      const formData =
        new FormData(
          event.currentTarget,
        );

      try {
        /* ===============================================
           LEAD
        =============================================== */

        const intakeResponse =
          await fetch(
            "/api/booking/intake",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  name:
                    details.name,

                  email:
                    details.email,

                  website:
                    details.website,

                  message:
                    details.bottleneck,

                  timezone:
                    getBrowserTimezone(),

                  companyWebsite:
                    formData
                      .get(
                        "companyWebsite",
                      )
                      ?.toString() ??
                    "",
                }),
            },
          );

        const intakeResult =
          (await intakeResponse.json()) as {
            ok:
              boolean;

            leadId?:
              string;

            message?:
              string;
          };

        if (
          !intakeResponse.ok ||
          !intakeResult.ok ||
          !intakeResult.leadId
        ) {
          throw new Error(
            intakeResult.message ??
              "Could not start booking.",
          );
        }

        /* ===============================================
           BOOKING
        =============================================== */

        const confirmResponse =
          await fetch(
            "/api/booking/confirm",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  leadId:
                    intakeResult.leadId,

                  startsAt:
                    selectedSlot.startsAt,
                }),
            },
          );

        const confirmResult =
          (await confirmResponse.json()) as
            ConfirmBookingResponse;

        if (
          !confirmResponse.ok ||
          !confirmResult.ok ||
          !confirmResult.booking
        ) {
          if (
            confirmResponse.status ===
            409
          ) {
            setSelectedSlot(
              null,
            );

            setView(
              "time",
            );

            setSubmitStatus(
              "idle",
            );

            setSubmitError(
              confirmResult.message ??
                "That time was just booked. Please choose another.",
            );

            await loadAvailability(
              true,
            );

            return;
          }

          throw new Error(
            confirmResult.message ??
              "Could not confirm booking.",
          );
        }

        /* ===============================================
           SUCCESS
        =============================================== */

        setBooking(
          confirmResult.booking,
        );

        setConfirmationEmailSent(
          Boolean(
            confirmResult.confirmationEmailSent,
          ),
        );

        cachedAvailability =
          null;

        cachedAvailabilityAt =
          0;

        setSubmitStatus(
          "idle",
        );

        setView(
          "success",
        );
      } catch (error) {
        setSubmitStatus(
          "error",
        );

        setSubmitError(
          error instanceof Error
            ? error.message
            : "Could not confirm booking.",
        );
      }
    };

  const selectedDay =
    useMemo(
      () =>
        availability?.days.find(
          (
            day,
          ) =>
            day.date ===
            selectedDate,
        ) ?? null,
      [
        availability,
        selectedDate,
      ],
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="
        min-h-[470px]

        bg-[#020608]/18
      "
    >
      {(view ===
        "time" ||
        view ===
          "details") && (
        <BookingStepper
          active={
            view
          }
          onTimeClick={() => {
            setSubmitError(
              "",
            );

            setView(
              "time",
            );
          }}
        />
      )}

      <AnimatePresence
        mode="wait"
        initial={false}
      >
        {/* =================================================
            TIME
        ================================================= */}

        {view ===
          "time" && (
          <motion.div
            key="time"
            initial={
              reduceMotion
                ? false
                : {
                    opacity:
                      0,

                    x:
                      -8,
                  }
            }
            animate={{
              opacity:
                1,

              x:
                0,
            }}
            exit={{
              opacity:
                0,
            }}
            transition={{
              duration:
                0.22,
            }}
            className="
              mx-auto

              w-full
              max-w-[720px]

              px-5
              pb-8
              pt-7

              sm:px-7
              sm:pb-9
            "
          >
            <h3
              className="
                text-[20px]
                font-medium
                tracking-[-0.035em]

                text-white
              "
            >
              Choose a time.
            </h3>

            <p
              className="
                mt-2

                text-[11px]
                leading-[1.7]

                text-white/34
              "
            >
              Pick an available
              30-minute discovery
              call.
            </p>

            {submitError && (
              <div
                className="
                  mt-5

                  rounded-[11px]

                  border
                  border-[#FF5A1F]/15

                  bg-[#FF5A1F]/[0.045]

                  px-4
                  py-3

                  text-[10.5px]

                  text-white/60
                "
              >
                {
                  submitError
                }
              </div>
            )}

            <AvailabilityPicker
              availability={
                availability
              }
              status={
                availabilityStatus
              }
              error={
                availabilityError
              }
              selectedDate={
                selectedDate
              }
              selectedSlot={
                selectedSlot
              }
              onDateChange={(
                date,
              ) => {
                setSelectedDate(
                  date,
                );

                setSelectedSlot(
                  null,
                );

                setSubmitError(
                  "",
                );
              }}
              onSlotSelect={(
                slot,
              ) => {
                setSelectedSlot(
                  slot,
                );

                setSubmitError(
                  "",
                );

                /*
                 * No extra Continue.
                 * Time selection advances directly.
                 */
                setView(
                  "details",
                );
              }}
              onRetry={() =>
                void loadAvailability(
                  true,
                )
              }
            />
          </motion.div>
        )}

        {/* =================================================
            DETAILS
        ================================================= */}

        {view ===
          "details" &&
          selectedSlot && (
            <motion.div
              key="details"
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity:
                        0,

                      x:
                        8,
                    }
              }
              animate={{
                opacity:
                  1,

                x:
                  0,
              }}
              exit={{
                opacity:
                  0,
              }}
              transition={{
                duration:
                  0.22,
              }}
              className="
                mx-auto

                w-full
                max-w-[680px]

                px-5
                pb-8
                pt-7

                sm:px-7
                sm:pb-9
              "
            >
              <div
                className="
                  flex
                  items-start
                  justify-between

                  gap-5
                "
              >
                <div>
                  <h3
                    className="
                      text-[20px]
                      font-medium
                      tracking-[-0.035em]

                      text-white
                    "
                  >
                    A little context.
                  </h3>

                  <p
                    className="
                      mt-2

                      max-w-[370px]

                      text-[11px]
                      leading-[1.7]

                      text-white/34
                    "
                  >
                    So I can come into
                    the call prepared
                    and focus on what
                    actually matters.
                  </p>
                </div>

                {selectedDay && (
                  <button
                    type="button"
                    onClick={() =>
                      setView(
                        "time",
                      )
                    }
                    className="
                      shrink-0

                      rounded-[12px]

                      border
                      border-white/[0.07]

                      bg-white/[0.025]

                      px-4
                      py-3

                      text-right

                      transition-all

                      hover:border-white/[0.13]
                      hover:bg-white/[0.04]
                    "
                  >
                    <span
                      className="
                        block

                        text-[10px]
                        font-medium

                        text-white/68
                      "
                    >
                      {
                        selectedDay.label
                      }{" "}
                      ·{" "}
                      {
                        selectedSlot.localTime
                      }
                    </span>

                    <span
                      className="
                        mt-1

                        block

                        text-[8px]
                        uppercase
                        tracking-[0.14em]

                        text-white/20
                      "
                    >
                      Change time
                    </span>
                  </button>
                )}
              </div>

              <form
                onSubmit={
                  handleBookingSubmit
                }
                className="
                  mt-7
                "
              >
                {/* HONEYPOT */}

                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    left-[-9999px]
                    top-[-9999px]
                    h-0
                    w-0
                    overflow-hidden
                  "
                >
                  <label>
                    Company website

                    <input
                      name="companyWebsite"
                      type="text"
                      tabIndex={
                        -1
                      }
                      autoComplete="off"
                    />
                  </label>
                </div>

                {/* NAME + EMAIL */}

                <div
                  className="
                    grid

                    gap-4

                    sm:grid-cols-2
                  "
                >
                  <div>
                    <label
                      htmlFor="booking-name"
                      className={
                        labelClassName
                      }
                    >
                      Name{" "}
                      <span
                        className="
                          text-[#FF5A1F]
                        "
                      >
                        *
                      </span>
                    </label>

                    <input
                      id="booking-name"
                      type="text"
                      required
                      maxLength={
                        120
                      }
                      autoComplete="name"
                      autoFocus
                      value={
                        details.name
                      }
                      onChange={(
                        event,
                      ) =>
                        updateDetail(
                          "name",
                          event
                            .target
                            .value,
                        )
                      }
                      placeholder="Your name"
                      className={
                        fieldClassName
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="booking-email"
                      className={
                        labelClassName
                      }
                    >
                      Email{" "}
                      <span
                        className="
                          text-[#FF5A1F]
                        "
                      >
                        *
                      </span>
                    </label>

                    <input
                      id="booking-email"
                      type="email"
                      required
                      maxLength={
                        160
                      }
                      autoComplete="email"
                      value={
                        details.email
                      }
                      onChange={(
                        event,
                      ) =>
                        updateDetail(
                          "email",
                          event
                            .target
                            .value,
                        )
                      }
                      placeholder="you@company.com"
                      className={
                        fieldClassName
                      }
                    />
                  </div>
                </div>

                {/* WEBSITE */}

                <div
                  className="
                    mt-4
                  "
                >
                  <div
                    className="
                      mb-2

                      flex
                      items-center
                      justify-between
                    "
                  >
                    <label
                      htmlFor="booking-website"
                      className="
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.22em]

                        text-white/38
                      "
                    >
                      Website
                    </label>

                    <span
                      className="
                        text-[8px]
                        uppercase
                        tracking-[0.14em]

                        text-white/17
                      "
                    >
                      Optional
                    </span>
                  </div>

                  <input
                    id="booking-website"
                    type="text"
                    maxLength={
                      250
                    }
                    autoComplete="url"
                    value={
                      details.website
                    }
                    onChange={(
                      event,
                    ) =>
                      updateDetail(
                        "website",
                        event
                          .target
                          .value,
                      )
                    }
                    placeholder="yourcompany.com"
                    className={
                      fieldClassName
                    }
                  />
                </div>

                {/* BOTTLENECK */}

                <div
                  className="
                    mt-5

                    rounded-[15px]

                    border
                    border-white/[0.065]

                    bg-white/[0.018]

                    p-4

                    sm:p-5
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      justify-between

                      gap-4
                    "
                  >
                    <div>
                      <label
                        htmlFor="booking-bottleneck"
                        className="
                          block

                          text-[11px]
                          font-medium

                          text-white/72
                        "
                      >
                        What&apos;s your
                        biggest bottleneck
                        right now?
                      </label>

                      <p
                        className="
                          mt-1.5

                          max-w-[500px]

                          text-[9.5px]
                          leading-[1.6]

                          text-white/27
                        "
                      >
                        What&apos;s
                        slowing you down,
                        creating manual
                        work, limiting
                        growth, or simply
                        not working as
                        well as it should?
                      </p>
                    </div>

                    <span
                      className="
                        shrink-0

                        text-[8px]
                        uppercase
                        tracking-[0.14em]

                        text-white/17
                      "
                    >
                      Optional
                    </span>
                  </div>

                  <textarea
                    id="booking-bottleneck"
                    rows={
                      4
                    }
                    maxLength={
                      2000
                    }
                    value={
                      details.bottleneck
                    }
                    onChange={(
                      event,
                    ) =>
                      updateDetail(
                        "bottleneck",
                        event
                          .target
                          .value,
                      )
                    }
                    placeholder="For example: leads are handled manually, the website isn't converting, internal processes take too much time, or the current system doesn't scale..."
                    className="
                      mt-4

                      min-h-[105px]
                      w-full

                      resize-none

                      rounded-[12px]

                      border
                      border-white/[0.085]

                      bg-black/[0.12]

                      px-4
                      py-3.5

                      text-[12.5px]
                      leading-[1.65]

                      text-white

                      outline-none

                      transition-all
                      duration-200

                      placeholder:text-white/20

                      hover:border-white/[0.13]

                      focus:border-[#FF5A1F]/40
                      focus:bg-black/[0.18]
                      focus:shadow-[0_0_0_3px_rgba(255,90,31,0.05)]
                    "
                  />
                </div>

                {submitStatus ===
                  "error" &&
                  submitError && (
                    <div
                      className="
                        mt-5

                        rounded-[11px]

                        border
                        border-red-300/[0.1]

                        bg-red-300/[0.035]

                        px-4
                        py-3

                        text-[10.5px]

                        text-red-200/70
                      "
                    >
                      {
                        submitError
                      }
                    </div>
                  )}

                {/* ACTIONS */}

                <div
                  className="
                    mt-6

                    flex
                    flex-col-reverse

                    gap-3

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      setView(
                        "time",
                      )
                    }
                    className="
                      inline-flex
                      h-[44px]

                      items-center
                      justify-center

                      gap-2

                      rounded-full

                      px-4

                      text-[10px]
                      font-semibold

                      text-white/35

                      transition-colors

                      hover:text-white/70
                    "
                  >
                    <ArrowLeft
                      size={
                        13
                      }
                      strokeWidth={
                        1.7
                      }
                    />

                    Back
                  </button>

                  <motion.button
                    type="submit"
                    disabled={
                      submitStatus ===
                      "loading"
                    }
                    whileHover={
                      reduceMotion
                        ? undefined
                        : {
                            y:
                              -1,
                          }
                    }
                    whileTap={
                      reduceMotion
                        ? undefined
                        : {
                            scale:
                              0.985,
                          }
                    }
                    className="
                      inline-flex
                      h-[48px]

                      min-w-[210px]

                      items-center
                      justify-center

                      gap-3

                      rounded-full

                      bg-[#FF5A1F]

                      px-6

                      text-[11px]
                      font-semibold

                      text-white

                      shadow-[0_14px_38px_rgba(255,90,31,0.17)]

                      transition-all

                      hover:bg-[#ff682e]
                      hover:shadow-[0_18px_45px_rgba(255,90,31,0.22)]

                      disabled:pointer-events-none
                      disabled:opacity-55
                    "
                  >
                    {submitStatus ===
                    "loading" ? (
                      <>
                        Securing your time

                        <Loader2
                          size={
                            14
                          }
                          strokeWidth={
                            1.8
                          }
                          className="
                            animate-spin
                          "
                        />
                      </>
                    ) : (
                      "Confirm discovery call"
                    )}
                  </motion.button>
                </div>

                <p
                  className="
                    mt-4

                    text-center

                    text-[8.5px]
                    leading-[1.55]

                    text-white/17
                  "
                >
                  No payment. No
                  commitment. Just a
                  focused 30-minute
                  discovery call.
                </p>
              </form>
            </motion.div>
          )}

        {/* =================================================
            SUCCESS
        ================================================= */}

        {view ===
          "success" &&
          booking && (
            <motion.div
              key="success"
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity:
                        0,

                      scale:
                        0.985,

                      y:
                        4,
                    }
              }
              animate={{
                opacity:
                  1,

                scale:
                  1,

                y:
                  0,
              }}
              transition={{
                duration:
                  0.32,

                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="
                mx-auto

                flex
                min-h-[480px]
                w-full
                max-w-[600px]

                flex-col
                items-center
                justify-center

                px-6
                py-12

                text-center
              "
            >
              <div
                className="
                  flex
                  h-[60px]
                  w-[60px]

                  items-center
                  justify-center

                  rounded-full

                  border
                  border-[#FF5A1F]/22

                  bg-[#FF5A1F]/[0.075]

                  shadow-[0_0_42px_rgba(255,90,31,0.10)]
                "
              >
                <Check
                  size={
                    22
                  }
                  strokeWidth={
                    1.8
                  }
                  className="
                    text-[#FF7040]
                  "
                />
              </div>

              <p
                className="
                  mt-6

                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.24em]

                  text-[#FF7040]
                "
              >
                Booking confirmed
              </p>

              <h3
                className="
                  mt-3

                  text-[29px]
                  font-medium
                  tracking-[-0.045em]

                  text-white

                  sm:text-[32px]
                "
              >
                Everything&apos;s set.
              </h3>

              <p
                className="
                  mt-3

                  max-w-[380px]

                  text-[11px]
                  leading-[1.7]

                  text-white/31
                "
              >
                Your discovery call
                has been reserved.
              </p>

              <div
                className="
                  mt-8

                  w-full

                  rounded-[16px]

                  border
                  border-white/[0.065]

                  bg-white/[0.022]

                  px-6
                  py-5
                "
              >
                <p
                  className="
                    text-[14px]
                    font-medium

                    text-white/80
                  "
                >
                  {formatBookingDate(
                    booking.startsAt,
                    booking.timezone,
                  )}
                </p>

                <p
                  className="
                    mt-2

                    text-[13px]

                    text-white/48
                  "
                >
                  {formatBookingTimeRange(
                    booking.startsAt,
                    booking.endsAt,
                    booking.timezone,
                  )}
                </p>

                <div
                  className="
                    mt-3

                    flex
                    items-center
                    justify-center

                    gap-2
                  "
                >
                  <Clock3
                    size={
                      10
                    }
                    strokeWidth={
                      1.6
                    }
                    className="
                      text-white/18
                    "
                  />

                  <span
                    className="
                      text-[8px]
                      uppercase
                      tracking-[0.15em]

                      text-white/19
                    "
                  >
                    {
                      booking.timezone
                    }{" "}
                    · 30 minutes
                  </span>
                </div>
              </div>

              <p
                className="
                  mt-7

                  text-[11px]
                  leading-[1.7]

                  text-white/37
                "
              >
                {confirmationEmailSent
                  ? (
                    <>
                      Confirmation sent to{" "}
                      <span
                        className="
                          text-white/60
                        "
                      >
                        {
                          details.email
                        }
                      </span>
                      .
                    </>
                  )
                  : (
                    "Your booking is confirmed."
                  )}
              </p>

              <p
                className="
                  mt-2

                  text-[10px]
                  leading-[1.7]

                  text-white/23
                "
              >
                Your Google Meet link
                will arrive 30 minutes
                before the call.
              </p>

              <div
                className="
                  mt-7

                  h-px
                  w-[80px]

                  bg-white/[0.07]
                "
              />

              <p
                className="
                  mt-5

                  max-w-[330px]

                  text-[8.5px]
                  leading-[1.7]

                  text-white/16
                "
              >
                Need to make a
                change? Use the
                Manage booking link
                in your confirmation
                email.
              </p>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}