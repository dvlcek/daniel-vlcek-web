"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  Loader2,
  RotateCcw,
  Trash2,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "motion/react";

type Credentials = {
  bookingId: string;
  token: string;
};

type Booking = {
  id: string;

  startsAt: string;
  endsAt: string;

  timezone: string;
  status: string;

  clientName: string;
  clientEmail: string;
};

type Slot = {
  startsAt: string;
  endsAt: string;
  localTime: string;
};

type AvailabilityDay = {
  date: string;
  weekday: string;
  label: string;
  slots: Slot[];
};

type AvailabilityResponse = {
  ok: boolean;
  timezone: string;
  days: AvailabilityDay[];
  message?: string;
};

type View =
  | "loading"
  | "ready"
  | "reschedule"
  | "cancel"
  | "cancelled"
  | "error";

const SESSION_KEY =
  "danielvlko.booking.manage";

function formatDate(
  value: string,
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
    new Date(value),
  );
}

function formatTime(
  value: string,
  timezone: string,
): string {
  return new Intl.DateTimeFormat(
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
  ).format(
    new Date(value),
  );
}

function readCredentials():
  Credentials | null {
  const hash =
    window.location.hash.replace(
      /^#/,
      "",
    );

  if (hash) {
    const params =
      new URLSearchParams(hash);

    const bookingId =
      params.get("booking");

    const token =
      params.get("token");

    if (
      bookingId &&
      token
    ) {
      const credentials = {
        bookingId,
        token,
      };

      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify(
          credentials,
        ),
      );

      window.history.replaceState(
        null,
        "",
        window.location.pathname,
      );

      return credentials;
    }
  }

  const stored =
    sessionStorage.getItem(
      SESSION_KEY,
    );

  if (!stored) {
    return null;
  }

  try {
    const parsed =
      JSON.parse(
        stored,
      ) as Partial<Credentials>;

    if (
      parsed.bookingId &&
      parsed.token
    ) {
      return {
        bookingId:
          parsed.bookingId,

        token:
          parsed.token,
      };
    }
  } catch {
    sessionStorage.removeItem(
      SESSION_KEY,
    );
  }

  return null;
}

export function ManageBookingClient() {
  const [
    view,
    setView,
  ] =
    useState<View>(
      "loading",
    );

  const [
    credentials,
    setCredentials,
  ] =
    useState<Credentials | null>(
      null,
    );

  const [
    booking,
    setBooking,
  ] =
    useState<Booking | null>(
      null,
    );

  const [
    availability,
    setAvailability,
  ] =
    useState<AvailabilityResponse | null>(
      null,
    );

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
    useState<Slot | null>(
      null,
    );

  const [
    pending,
    setPending,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const loadBooking =
    async (
      input:
        Credentials,
    ) => {
      const response =
        await fetch(
          "/api/booking/manage",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                input,
              ),
          },
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.ok ||
        !result.booking
      ) {
        throw new Error(
          result.message ??
            "Could not load this booking.",
        );
      }

      setBooking(
        result.booking,
      );

      if (
        result.booking.status ===
        "CANCELLED"
      ) {
        setView(
          "cancelled",
        );
      } else {
        setView(
          "ready",
        );
      }
    };

  useEffect(
    () => {
      const input =
        readCredentials();

      if (!input) {
        setError(
          "This booking link is invalid or has expired.",
        );

        setView(
          "error",
        );

        return;
      }

      setCredentials(
        input,
      );

      void loadBooking(
        input,
      ).catch(
        (
          loadError,
        ) => {
          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Could not load this booking.",
          );

          setView(
            "error",
          );
        },
      );
    },
    [],
  );

  const availableDays =
    useMemo(
      () =>
        availability?.days.filter(
          (
            day,
          ) =>
            day.slots.length >
            0,
        ) ?? [],
      [availability],
    );

  const selectedDay =
    useMemo(
      () =>
        availableDays.find(
          (
            day,
          ) =>
            day.date ===
            selectedDate,
        ) ?? null,
      [
        availableDays,
        selectedDate,
      ],
    );

  const loadAvailability =
    async () => {
      setPending(
        true,
      );

      setError(
        "",
      );

      try {
        const response =
          await fetch(
            "/api/booking/availability?days=14",
            {
              cache:
                "no-store",
            },
          );

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

        setAvailability(
          result,
        );

        const first =
          result.days.find(
            (
              day,
            ) =>
              day.slots.length >
              0,
          );

        setSelectedDate(
          first?.date ??
            null,
        );

        setSelectedSlot(
          null,
        );

        setView(
          "reschedule",
        );
      } catch (
        loadError
      ) {
        setError(
          loadError instanceof
            Error
            ? loadError.message
            : "Could not load availability.",
        );
      } finally {
        setPending(
          false,
        );
      }
    };

  const handleReschedule =
    async () => {
      if (
        !credentials ||
        !booking ||
        !selectedSlot ||
        pending
      ) {
        return;
      }

      setPending(
        true,
      );

      setError(
        "",
      );

      try {
        const response =
          await fetch(
            "/api/booking/reschedule",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  bookingId:
                    booking.id,

                  token:
                    credentials.token,

                  startsAt:
                    selectedSlot.startsAt,
                }),
            },
          );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.ok ||
          !result.booking
        ) {
          throw new Error(
            result.message ??
              "Could not reschedule your booking.",
          );
        }

        setBooking(
          (
            current,
          ) =>
            current
              ? {
                  ...current,

                  startsAt:
                    result.booking.startsAt,

                  endsAt:
                    result.booking.endsAt,

                  timezone:
                    result.booking.timezone,

                  status:
                    result.booking.status,
                }
              : current,
        );

        setAvailability(
          null,
        );

        setSelectedDate(
          null,
        );

        setSelectedSlot(
          null,
        );

        setView(
          "ready",
        );
      } catch (
        rescheduleError
      ) {
        setError(
          rescheduleError instanceof
            Error
            ? rescheduleError.message
            : "Could not reschedule your booking.",
        );
      } finally {
        setPending(
          false,
        );
      }
    };

  const handleCancel =
    async () => {
      if (
        !credentials ||
        !booking ||
        pending
      ) {
        return;
      }

      setPending(
        true,
      );

      setError(
        "",
      );

      try {
        const response =
          await fetch(
            "/api/booking/cancel",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  bookingId:
                    booking.id,

                  token:
                    credentials.token,
                }),
            },
          );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.ok
        ) {
          throw new Error(
            result.message ??
              "Could not cancel your booking.",
          );
        }

        sessionStorage.removeItem(
          SESSION_KEY,
        );

        setView(
          "cancelled",
        );
      } catch (
        cancelError
      ) {
        setError(
          cancelError instanceof
            Error
            ? cancelError.message
            : "Could not cancel your booking.",
        );
      } finally {
        setPending(
          false,
        );
      }
    };

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-[650px]
      "
    >
      <div>
        <div
          className="
            text-[15px]
            font-semibold
            tracking-[-0.03em]

            text-white
          "
        >
          Daniel VLKO
        </div>

        <div
          className="
            mt-1.5

            text-[8px]
            font-semibold
            uppercase
            tracking-[0.2em]

            text-white/25
          "
        >
          Software · Automation · AI
        </div>
      </div>

      <div
        className="
          mt-9

          overflow-hidden

          rounded-[22px]

          border
          border-white/[0.08]

          bg-white/[0.025]

          shadow-[0_30px_100px_rgba(0,0,0,0.36)]
        "
      >
        <AnimatePresence
          mode="wait"
        >
          {view ===
            "loading" && (
            <motion.div
              key="loading"
              className="
                flex
                min-h-[430px]

                items-center
                justify-center
              "
            >
              <Loader2
                size={19}
                className="
                  animate-spin
                  text-white/30
                "
              />
            </motion.div>
          )}

          {view ===
            "error" && (
            <motion.div
              key="error"
              className="
                flex
                min-h-[430px]

                flex-col
                items-center
                justify-center

                px-7

                text-center
              "
            >
              <p
                className="
                  text-[20px]
                  font-medium

                  text-white
                "
              >
                We couldn&apos;t
                open this booking.
              </p>

              <p
                className="
                  mt-3

                  max-w-[360px]

                  text-[11px]
                  leading-[1.7]

                  text-white/35
                "
              >
                {error}
              </p>
            </motion.div>
          )}

          {view ===
            "ready" &&
            booking && (
              <motion.div
                key="ready"
                initial={{
                  opacity:
                    0,
                }}
                animate={{
                  opacity:
                    1,
                }}
                className="
                  px-6
                  py-9

                  sm:px-9
                  sm:py-10
                "
              >
                <div
                  className="
                    flex
                    h-[44px]
                    w-[44px]

                    items-center
                    justify-center

                    rounded-full

                    border
                    border-[#FF5A1F]/20

                    bg-[#FF5A1F]/[0.07]
                  "
                >
                  <Check
                    size={17}
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
                    tracking-[0.2em]

                    text-[#FF7040]
                  "
                >
                  Your booking
                </p>

                <h1
                  className="
                    mt-3

                    text-[27px]
                    font-medium
                    tracking-[-0.045em]

                    text-white
                  "
                >
                  Manage your
                  discovery call.
                </h1>

                <p
                  className="
                    mt-3

                    text-[11px]
                    leading-[1.7]

                    text-white/33
                  "
                >
                  Hi{" "}
                  {
                    booking.clientName
                  }
                  . If something
                  has changed,
                  you can move or
                  cancel the call
                  here.
                </p>

                <div
                  className="
                    mt-8

                    rounded-[15px]

                    border
                    border-white/[0.07]

                    bg-black/[0.14]

                    p-5
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <CalendarDays
                      size={15}
                      className="
                        text-white/35
                      "
                    />

                    <span
                      className="
                        text-[13px]
                        font-medium

                        text-white/78
                      "
                    >
                      {formatDate(
                        booking.startsAt,
                        booking.timezone,
                      )}
                    </span>
                  </div>

                  <div
                    className="
                      mt-3

                      flex
                      items-center
                      gap-3
                    "
                  >
                    <Clock3
                      size={15}
                      className="
                        text-white/35
                      "
                    />

                    <span
                      className="
                        text-[12px]

                        text-white/48
                      "
                    >
                      {formatTime(
                        booking.startsAt,
                        booking.timezone,
                      )}
                      {" — "}
                      {formatTime(
                        booking.endsAt,
                        booking.timezone,
                      )}
                    </span>
                  </div>

                  <p
                    className="
                      mt-3

                      text-[8px]
                      uppercase
                      tracking-[0.14em]

                      text-white/18
                    "
                  >
                    {
                      booking.timezone
                    }
                  </p>
                </div>

                {error && (
                  <p
                    className="
                      mt-4

                      text-[10px]

                      text-red-200/65
                    "
                  >
                    {error}
                  </p>
                )}

                <div
                  className="
                    mt-7

                    flex
                    flex-col

                    gap-3

                    sm:flex-row
                  "
                >
                  <button
                    type="button"
                    disabled={
                      pending
                    }
                    onClick={() =>
                      void loadAvailability()
                    }
                    className="
                      inline-flex
                      h-[46px]

                      flex-1

                      items-center
                      justify-center

                      gap-2

                      rounded-full

                      bg-[#FF5A1F]

                      px-5

                      text-[10.5px]
                      font-semibold

                      text-white

                      transition-all

                      hover:bg-[#ff682e]

                      disabled:opacity-50
                    "
                  >
                    {pending ? (
                      <Loader2
                        size={13}
                        className="
                          animate-spin
                        "
                      />
                    ) : (
                      <RotateCcw
                        size={13}
                      />
                    )}

                    Reschedule
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setView(
                        "cancel",
                      )
                    }
                    className="
                      inline-flex
                      h-[46px]

                      flex-1

                      items-center
                      justify-center

                      gap-2

                      rounded-full

                      border
                      border-white/[0.09]

                      px-5

                      text-[10.5px]
                      font-semibold

                      text-white/43

                      transition-all

                      hover:border-red-200/15
                      hover:text-red-100/70
                    "
                  >
                    <Trash2
                      size={13}
                    />

                    Cancel booking
                  </button>
                </div>
              </motion.div>
            )}

          {view ===
            "reschedule" &&
            booking && (
              <motion.div
                key="reschedule"
                initial={{
                  opacity:
                    0,

                  x:
                    8,
                }}
                animate={{
                  opacity:
                    1,

                  x:
                    0,
                }}
                className="
                  px-6
                  py-8

                  sm:px-9
                  sm:py-9
                "
              >
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setView(
                      "ready",
                    );
                  }}
                  className="
                    inline-flex
                    items-center
                    gap-2

                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]

                    text-white/30
                  "
                >
                  <ArrowLeft
                    size={12}
                  />

                  Back
                </button>

                <h2
                  className="
                    mt-6

                    text-[24px]
                    font-medium
                    tracking-[-0.04em]

                    text-white
                  "
                >
                  Choose a new
                  time.
                </h2>

                <p
                  className="
                    mt-2

                    text-[10.5px]
                    leading-[1.65]

                    text-white/30
                  "
                >
                  Your current
                  booking remains
                  active until the
                  new time is
                  confirmed.
                </p>

                <div
                  className="
                    mt-7

                    flex
                    gap-2

                    overflow-x-auto

                    pb-2

                    [scrollbar-width:none]

                    [&::-webkit-scrollbar]:hidden
                  "
                >
                  {availableDays.map(
                    (
                      day,
                    ) => (
                      <button
                        key={
                          day.date
                        }
                        type="button"
                        onClick={() => {
                          setSelectedDate(
                            day.date,
                          );

                          setSelectedSlot(
                            null,
                          );
                        }}
                        className={`
                          min-w-[105px]

                          rounded-[13px]
                          border

                          px-4
                          py-3.5

                          text-left

                          transition-all

                          ${
                            selectedDate ===
                            day.date
                              ? `
                                border-[#FF5A1F]/35
                                bg-[#FF5A1F]/[0.07]
                              `
                              : `
                                border-white/[0.07]
                                bg-white/[0.02]
                              `
                          }
                        `}
                      >
                        <span
                          className="
                            block

                            text-[8px]
                            font-semibold
                            uppercase
                            tracking-[0.16em]

                            text-white/27
                          "
                        >
                          {
                            day.weekday
                          }
                        </span>

                        <span
                          className="
                            mt-1.5
                            block

                            text-[12px]

                            text-white/72
                          "
                        >
                          {
                            day.label
                          }
                        </span>
                      </button>
                    ),
                  )}
                </div>

                {selectedDay && (
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
                      ) => (
                        <button
                          key={
                            slot.startsAt
                          }
                          type="button"
                          onClick={() =>
                            setSelectedSlot(
                              slot,
                            )
                          }
                          className={`
                            h-[45px]

                            rounded-[11px]
                            border

                            text-[11px]
                            font-semibold

                            transition-all

                            ${
                              selectedSlot
                                ?.startsAt ===
                              slot.startsAt
                                ? `
                                  border-[#FF5A1F]/45
                                  bg-[#FF5A1F]/10
                                  text-white
                                `
                                : `
                                  border-white/[0.07]
                                  bg-white/[0.02]
                                  text-white/50
                                `
                            }
                          `}
                        >
                          {
                            slot.localTime
                          }
                        </button>
                      ),
                    )}
                  </div>
                )}

                {error && (
                  <p
                    className="
                      mt-4
                      text-[10px]

                      text-red-200/65
                    "
                  >
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  disabled={
                    !selectedSlot ||
                    pending
                  }
                  onClick={() =>
                    void handleReschedule()
                  }
                  className="
                    mt-7

                    inline-flex
                    h-[46px]
                    w-full

                    items-center
                    justify-center

                    gap-2

                    rounded-full

                    bg-[#FF5A1F]

                    text-[10.5px]
                    font-semibold

                    text-white

                    disabled:opacity-35
                  "
                >
                  {pending && (
                    <Loader2
                      size={13}
                      className="
                        animate-spin
                      "
                    />
                  )}

                  Confirm new time
                </button>
              </motion.div>
            )}

          {view ===
            "cancel" &&
            booking && (
              <motion.div
                key="cancel"
                initial={{
                  opacity:
                    0,
                }}
                animate={{
                  opacity:
                    1,
                }}
                className="
                  flex
                  min-h-[420px]

                  flex-col
                  justify-center

                  px-6
                  py-10

                  text-center

                  sm:px-10
                "
              >
                <div
                  className="
                    mx-auto

                    flex
                    h-[48px]
                    w-[48px]

                    items-center
                    justify-center

                    rounded-full

                    border
                    border-red-200/[0.09]

                    bg-red-300/[0.035]
                  "
                >
                  <Trash2
                    size={17}
                    className="
                      text-red-100/55
                    "
                  />
                </div>

                <h2
                  className="
                    mt-6

                    text-[24px]
                    font-medium
                    tracking-[-0.04em]

                    text-white
                  "
                >
                  Cancel your
                  discovery call?
                </h2>

                <p
                  className="
                    mt-3

                    text-[11px]
                    leading-[1.7]

                    text-white/32
                  "
                >
                  {formatDate(
                    booking.startsAt,
                    booking.timezone,
                  )}
                  <br />

                  {formatTime(
                    booking.startsAt,
                    booking.timezone,
                  )}
                  {" — "}
                  {formatTime(
                    booking.endsAt,
                    booking.timezone,
                  )}
                </p>

                <p
                  className="
                    mx-auto
                    mt-4

                    max-w-[330px]

                    text-[10px]
                    leading-[1.65]

                    text-white/24
                  "
                >
                  The time will
                  immediately be
                  released and become
                  available for
                  another booking.
                </p>

                {error && (
                  <p
                    className="
                      mt-4

                      text-[10px]

                      text-red-200/65
                    "
                  >
                    {error}
                  </p>
                )}

                <div
                  className="
                    mt-7

                    flex
                    flex-col

                    gap-2

                    sm:flex-row
                    sm:justify-center
                  "
                >
                  <button
                    type="button"
                    disabled={
                      pending
                    }
                    onClick={() => {
                      setError("");

                      setView(
                        "ready",
                      );
                    }}
                    className="
                      h-[44px]

                      rounded-full

                      border
                      border-white/[0.09]

                      px-6

                      text-[10px]
                      font-semibold

                      text-white/45
                    "
                  >
                    Keep booking
                  </button>

                  <button
                    type="button"
                    disabled={
                      pending
                    }
                    onClick={() =>
                      void handleCancel()
                    }
                    className="
                      inline-flex
                      h-[44px]

                      items-center
                      justify-center

                      gap-2

                      rounded-full

                      bg-red-300/[0.11]

                      px-6

                      text-[10px]
                      font-semibold

                      text-red-100/75

                      disabled:opacity-50
                    "
                  >
                    {pending && (
                      <Loader2
                        size={12}
                        className="
                          animate-spin
                        "
                      />
                    )}

                    Cancel booking
                  </button>
                </div>
              </motion.div>
            )}

          {view ===
            "cancelled" && (
              <motion.div
                key="cancelled"
                initial={{
                  opacity:
                    0,
                }}
                animate={{
                  opacity:
                    1,
                }}
                className="
                  flex
                  min-h-[430px]

                  flex-col
                  items-center
                  justify-center

                  px-7

                  text-center
                "
              >
                <div
                  className="
                    flex
                    h-[52px]
                    w-[52px]

                    items-center
                    justify-center

                    rounded-full

                    border
                    border-white/[0.08]
                  "
                >
                  <Check
                    size={19}
                    className="
                      text-white/55
                    "
                  />
                </div>

                <h2
                  className="
                    mt-6

                    text-[26px]
                    font-medium
                    tracking-[-0.04em]

                    text-white
                  "
                >
                  Booking cancelled.
                </h2>

                <p
                  className="
                    mt-3

                    text-[11px]

                    text-white/30
                  "
                >
                  The time has been
                  released.
                </p>

                <a
                  href="/"
                  className="
                    mt-7

                    rounded-full

                    border
                    border-white/[0.1]

                    px-6
                    py-3

                    text-[10px]
                    font-semibold

                    text-white/55
                  "
                >
                  Back to Daniel VLKO
                </a>
              </motion.div>
            )}
        </AnimatePresence>
      </div>

      <p
        className="
          mt-5

          text-center

          text-[8px]
          uppercase
          tracking-[0.16em]

          text-white/14
        "
      >
        Secure booking management
      </p>
    </div>
  );
}