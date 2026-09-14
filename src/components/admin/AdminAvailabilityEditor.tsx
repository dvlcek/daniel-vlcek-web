"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  Ban,
  CalendarClock,
  CalendarDays,
  Check,
  Circle,
  Clock3,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import {
  AdminDatePicker,
} from "@/components/admin/AdminDatePicker";

import {
  AdminSelect,
  type AdminSelectOption,
} from "@/components/admin/AdminSelect";

import {
  AdminTimeSelect,
} from "@/components/admin/AdminTimeSelect";

export type AdminAvailabilityRule = {
  id: string;
  weekday: number;
  startMinute: number;
  endMinute: number;
  enabled: boolean;
};

export type AdminAvailabilityOverride = {
  id: string;
  dateKey: string;
  startMinute:
    number | null;
  endMinute:
    number | null;
  type:
    "BLOCK" |
    "AVAILABLE";
  note:
    string | null;
};

type AdminAvailabilityEditorProps = {
  rules:
    AdminAvailabilityRule[];

  overrides:
    AdminAvailabilityOverride[];

  todayKey:
    string;

  timezone:
    string;
};

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const weekdayOptions:
  AdminSelectOption[] =
  weekdays.map(
    (
      weekday,
      index,
    ) => ({
      value:
        String(
          index,
        ),

      label:
        weekday,
    }),
  );

const overrideTypeOptions:
  AdminSelectOption[] =
  [
    {
      value:
        "BLOCK",

      label:
        "Unavailable",

      description:
        "Remove this time from booking",
    },

    {
      value:
        "AVAILABLE",

      label:
        "Extra availability",

      description:
        "Open additional booking time",
    },
  ];

function minuteToTime(
  minute: number,
): string {
  const hour =
    Math.floor(
      minute / 60,
    );

  const minutes =
    minute % 60;

  return `${hour
    .toString()
    .padStart(
      2,
      "0",
    )}:${minutes
    .toString()
    .padStart(
      2,
      "0",
    )}`;
}

function Toggle({
  name,
  defaultChecked = false,
  checked,
  onChange,
  label,
}: {
  name: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (
    checked: boolean,
  ) => void;
  label: string;
}) {
  const controlled =
    checked !== undefined;

  return (
    <label
      className="
        flex
        cursor-pointer
        items-center
        gap-2.5
      "
    >
      <input
        type="checkbox"
        name={name}
        defaultChecked={
          controlled
            ? undefined
            : defaultChecked
        }
        checked={
          controlled
            ? checked
            : undefined
        }
        onChange={
          controlled
            ? (
                event,
              ) =>
                onChange?.(
                  event.target.checked,
                )
            : undefined
        }
        className="
          peer
          sr-only
        "
      />

      <span
        className="
          relative
          h-[20px]
          w-[35px]
          rounded-full
          border
          border-white/[0.13]
          bg-[#1B262C]
          transition-all

          after:absolute
          after:left-[3px]
          after:top-[3px]
          after:h-[12px]
          after:w-[12px]
          after:rounded-full
          after:bg-white/45
          after:transition-all

          peer-checked:border-[#FF6B36]/35
          peer-checked:bg-[#FF5A1F]/[0.16]

          peer-checked:after:translate-x-[15px]
          peer-checked:after:bg-[#FF8054]
          peer-checked:after:shadow-[0_0_12px_rgba(255,90,31,0.42)]
        "
      />

      <span
        className="
          text-[11px]
          font-medium
          text-white/50
        "
      >
        {label}
      </span>
    </label>
  );
}

function WeeklyRuleCard({
  rule,
}: {
  rule:
    AdminAvailabilityRule;
}) {
  return (
    <form
      method="POST"
      action="/api/admin/availability/rules"
      className="
        rounded-[15px]
        border
        border-white/[0.10]
        bg-[#152027]
        p-3.5
        shadow-[0_7px_20px_rgba(0,0,0,0.10)]
        transition-all

        hover:border-white/[0.16]
        hover:bg-[#18242A]
      "
    >
      <input
        type="hidden"
        name="ruleId"
        value={rule.id}
      />

      <input
        type="hidden"
        name="weekday"
        value={rule.weekday}
      />

      <div
        className="
          flex
          flex-col
          gap-3

          lg:flex-row
          lg:items-center
        "
      >
        <div
          className="
            flex
            min-w-[120px]
            items-center
            gap-2.5
          "
        >
          <span
            className={`
              h-[7px]
              w-[7px]
              rounded-full

              ${
                rule.enabled
                  ? "bg-[#FF6B36] shadow-[0_0_12px_rgba(255,90,31,0.45)]"
                  : "bg-white/20"
              }
            `}
          />

          <span
            className="
              text-[12px]
              font-medium
              text-white/70
            "
          >
            {
              weekdays[
                rule.weekday
              ]
            }
          </span>
        </div>

        <div
          className="
            grid
            min-w-0
            flex-1
            grid-cols-[1fr_auto_1fr]
            items-center
            gap-2
          "
        >
          <AdminTimeSelect
            name="start"
            defaultValue={minuteToTime(
              rule.startMinute,
            )}
            compact
          />

          <span
            className="
              text-[10px]
              text-white/30
            "
          >
            to
          </span>

          <AdminTimeSelect
            name="end"
            defaultValue={minuteToTime(
              rule.endMinute,
            )}
            compact
          />
        </div>

        <div
          className="
            flex
            items-center
            justify-between
            gap-3

            lg:justify-end
          "
        >
          <Toggle
            name="enabled"
            defaultChecked={
              rule.enabled
            }
            label="Active"
          />

          <button
            type="submit"
            name="action"
            value="save"
            className="
              h-[36px]
              rounded-[9px]
              border
              border-white/[0.11]
              bg-[#1A252B]
              px-3.5
              text-[10px]
              font-semibold
              text-white/45
              transition-all

              hover:border-[#FF6B36]/30
              hover:bg-[#202D34]
              hover:text-[#FF8054]
            "
          >
            Save
          </button>

          <button
            type="submit"
            name="action"
            value="delete"
            aria-label="Delete rule"
            className="
              flex
              h-[36px]
              w-[36px]
              items-center
              justify-center
              rounded-[9px]
              border
              border-white/[0.10]
              bg-[#1A252B]
              text-white/30
              transition-all

              hover:border-red-300/25
              hover:bg-red-300/[0.06]
              hover:text-red-200/80
            "
          >
            <Trash2
              size={12}
              strokeWidth={1.6}
            />
          </button>
        </div>
      </div>
    </form>
  );
}

function AddWeeklyWindow() {
  return (
    <form
      method="POST"
      action="/api/admin/availability/rules"
      className="
        mt-3
        rounded-[15px]
        border
        border-dashed
        border-white/[0.13]
        bg-[#131D22]
        p-4
      "
    >
      <div
        className="
          flex
          items-center
          gap-2.5
        "
      >
        <div
          className="
            flex
            h-[30px]
            w-[30px]
            items-center
            justify-center
            rounded-[8px]
            border
            border-white/[0.10]
            bg-[#1A252B]
          "
        >
          <Plus
            size={12}
            strokeWidth={1.8}
            className="
              text-white/50
            "
          />
        </div>

        <div>
          <div
            className="
              text-[11px]
              font-semibold
              text-white/55
            "
          >
            Add recurring window
          </div>

          <div
            className="
              mt-0.5
              text-[9px]
              text-white/30
            "
          >
            Add another day or a second window.
          </div>
        </div>
      </div>

      <div
        className="
          mt-4
          grid
          gap-2.5

          sm:grid-cols-2

          xl:grid-cols-[1fr_1fr_1fr_auto]
        "
      >
        <AdminSelect
          name="weekday"
          options={weekdayOptions}
          defaultValue="1"
        />

        <AdminTimeSelect
          name="start"
          defaultValue="17:00"
        />

        <AdminTimeSelect
          name="end"
          defaultValue="20:00"
        />

        <input
          type="hidden"
          name="enabled"
          value="on"
        />

        <button
          type="submit"
          name="action"
          value="save"
          className="
            h-[42px]
            rounded-[11px]
            border
            border-white/[0.11]
            bg-[#1B272D]
            px-4
            text-[11px]
            font-semibold
            text-white/55
            transition-all

            hover:border-[#FF6B36]/30
            hover:bg-[#202E35]
            hover:text-[#FF8054]
          "
        >
          Add window
        </button>
      </div>
    </form>
  );
}

function AddOverride({
  todayKey,
}: {
  todayKey: string;
}) {
  const [
    wholeDay,
    setWholeDay,
  ] =
    useState(
      true,
    );

  const [
    type,
    setType,
  ] =
    useState(
      "BLOCK",
    );

  const minDate =
    useMemo(
      () => {
        const [
          year,
          month,
          day,
        ] =
          todayKey
            .split(
              "-",
            )
            .map(
              Number,
            );

        return new Date(
          year,
          month - 1,
          day,
        );
      },
      [
        todayKey,
      ],
    );

  return (
    <form
      method="POST"
      action="/api/admin/availability/overrides"
      className="
        mt-5
        rounded-[16px]
        border
        border-white/[0.11]
        bg-[#152027]
        p-4
        shadow-[0_8px_24px_rgba(0,0,0,0.10)]
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
          <div
            className="
              text-[12px]
              font-semibold
              text-white/65
            "
          >
            New schedule exception
          </div>

          <p
            className="
              mt-1
              text-[10px]
              leading-[1.5]
              text-white/35
            "
          >
            Block unavailable time or open a special slot.
          </p>
        </div>

        <CalendarClock
          size={15}
          strokeWidth={1.5}
          className="
            text-[#FF8054]
          "
        />
      </div>

      <div
        className="
          mt-4
          grid
          gap-2.5

          md:grid-cols-2
        "
      >
        <AdminDatePicker
          name="dateKey"
          minDate={minDate}
          placeholder="Choose date"
        />

        <AdminSelect
          name="type"
          options={
            overrideTypeOptions
          }
          value={type}
          onValueChange={
            setType
          }
        />
      </div>

      <div
        className="
          mt-3
          flex
          flex-wrap
          items-center
          justify-between
          gap-3
          rounded-[11px]
          border
          border-white/[0.09]
          bg-[#1A252B]
          px-3.5
          py-3
        "
      >
        <div>
          <div
            className="
              text-[11px]
              font-medium
              text-white/55
            "
          >
            Whole day
          </div>

          <div
            className="
              mt-0.5
              text-[9px]
              text-white/30
            "
          >
            Apply this exception for the entire day.
          </div>
        </div>

        <Toggle
          name="wholeDay"
          checked={wholeDay}
          onChange={
            setWholeDay
          }
          label={
            wholeDay
              ? "Enabled"
              : "Custom time"
          }
        />
      </div>

      {!wholeDay && (
        <div
          className="
            mt-3
            grid
            grid-cols-[1fr_auto_1fr]
            items-center
            gap-2.5
          "
        >
          <AdminTimeSelect
            name="start"
            defaultValue="17:00"
          />

          <span
            className="
              text-[10px]
              text-white/30
            "
          >
            to
          </span>

          <AdminTimeSelect
            name="end"
            defaultValue={
              type ===
              "BLOCK"
                ? "18:00"
                : "20:00"
            }
          />
        </div>
      )}

      <input
        name="note"
        maxLength={300}
        placeholder="Optional note — travel, client meeting, holiday..."
        className="
          mt-3
          h-[42px]
          w-full
          rounded-[11px]
          border
          border-white/[0.12]
          bg-[#162026]
          px-4
          text-[11px]
          text-white/70
          outline-none
          transition-all
          placeholder:text-white/30

          hover:border-white/[0.18]

          focus:border-[#FF6B36]/40
        "
      />

      <div
        className="
          mt-4
          flex
          justify-end
        "
      >
        <button
          type="submit"
          className="
            flex
            h-[40px]
            items-center
            gap-2
            rounded-[11px]
            bg-[#FF5A1F]
            px-5
            text-[11px]
            font-semibold
            text-white
            shadow-[0_12px_30px_rgba(255,90,31,0.18)]
            transition-all

            hover:-translate-y-px
            hover:bg-[#FF6B36]
          "
        >
          {type ===
          "BLOCK" ? (
            <Ban
              size={12}
              strokeWidth={1.7}
            />
          ) : (
            <Plus
              size={12}
              strokeWidth={1.7}
            />
          )}

          {type ===
          "BLOCK"
            ? "Block time"
            : "Open time"}
        </button>
      </div>
    </form>
  );
}

function OverrideList({
  overrides,
}: {
  overrides:
    AdminAvailabilityOverride[];
}) {
  if (
    overrides.length ===
    0
  ) {
    return (
      <div
        className="
          mt-4
          rounded-[14px]
          border
          border-dashed
          border-white/[0.10]
          bg-[#131D22]
          px-5
          py-7
          text-center
        "
      >
        <ShieldCheck
          size={18}
          strokeWidth={1.4}
          className="
            mx-auto
            text-emerald-300/50
          "
        />

        <div
          className="
            mt-3
            text-[11px]
            font-medium
            text-white/50
          "
        >
          Schedule is clear.
        </div>

        <div
          className="
            mt-1
            text-[9px]
            text-white/30
          "
        >
          No upcoming exceptions.
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        mt-4
      "
    >
      {overrides.map(
        (
          override,
          index,
        ) => {
          const blocked =
            override.type ===
            "BLOCK";

          return (
            <div
              key={override.id}
              className={`
                flex
                items-center
                gap-3
                py-3.5

                ${
                  index >
                  0
                    ? "border-t border-white/[0.08]"
                    : ""
                }
              `}
            >
              <div
                className={`
                  flex
                  h-[36px]
                  w-[36px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-[9px]
                  border

                  ${
                    blocked
                      ? "border-red-300/[0.14] bg-red-300/[0.055]"
                      : "border-emerald-300/[0.14] bg-emerald-300/[0.055]"
                  }
                `}
              >
                {blocked ? (
                  <Ban
                    size={13}
                    strokeWidth={1.6}
                    className="
                      text-red-200/70
                    "
                  />
                ) : (
                  <Check
                    size={13}
                    strokeWidth={1.7}
                    className="
                      text-emerald-200/70
                    "
                  />
                )}
              </div>

              <div
                className="
                  min-w-0
                  flex-1
                "
              >
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  <span
                    className="
                      text-[11px]
                      font-medium
                      text-white/65
                    "
                  >
                    {
                      override.dateKey
                    }
                  </span>

                  <span
                    className={`
                      rounded-full
                      border
                      px-2
                      py-0.5
                      text-[9px]
                      font-semibold

                      ${
                        blocked
                          ? "border-red-300/[0.15] bg-red-300/[0.055] text-red-200/70"
                          : "border-emerald-300/[0.15] bg-emerald-300/[0.055] text-emerald-200/70"
                      }
                    `}
                  >
                    {blocked
                      ? "Unavailable"
                      : "Open"}
                  </span>
                </div>

                <div
                  className="
                    mt-1
                    flex
                    flex-wrap
                    items-center
                    gap-2
                    text-[10px]
                    text-white/40
                  "
                >
                  <span>
                    {override.startMinute ===
                      null ||
                    override.endMinute ===
                      null
                      ? "Whole day"
                      : `${minuteToTime(
                          override.startMinute,
                        )} — ${minuteToTime(
                          override.endMinute,
                        )}`}
                  </span>

                  {override.note && (
                    <>
                      <Circle
                        size={3}
                        fill="currentColor"
                        strokeWidth={0}
                      />

                      <span
                        className="
                          truncate
                        "
                      >
                        {
                          override.note
                        }
                      </span>
                    </>
                  )}
                </div>
              </div>

              <form
                method="POST"
                action="/api/admin/availability/overrides/delete"
              >
                <input
                  type="hidden"
                  name="overrideId"
                  value={
                    override.id
                  }
                />

                <button
                  type="submit"
                  aria-label="Delete schedule exception"
                  className="
                    flex
                    h-[34px]
                    w-[34px]
                    items-center
                    justify-center
                    rounded-[9px]
                    border
                    border-white/[0.09]
                    bg-[#182329]
                    text-white/30
                    transition-all

                    hover:border-red-300/25
                    hover:bg-red-300/[0.06]
                    hover:text-red-200/80
                  "
                >
                  <Trash2
                    size={11}
                    strokeWidth={1.6}
                  />
                </button>
              </form>
            </div>
          );
        },
      )}
    </div>
  );
}

export function AdminAvailabilityEditor({
  rules,
  overrides,
  todayKey,
  timezone,
}: AdminAvailabilityEditorProps) {
  const activeRules =
    rules.filter(
      (
        rule,
      ) =>
        rule.enabled,
    ).length;

  const blockedUpcoming =
    overrides.filter(
      (
        override,
      ) =>
        override.type ===
        "BLOCK",
    ).length;

  return (
    <section
      id="availability"
      className="
        mt-5
        scroll-mt-6
        overflow-visible
        rounded-[21px]
        border
        border-white/[0.11]
        bg-[#11191E]
        shadow-[0_18px_50px_rgba(0,0,0,0.15)]
      "
    >
      <div
        className="
          border-b
          border-white/[0.09]
          px-5
          py-5

          sm:px-6
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4

            md:flex-row
            md:items-end
            md:justify-between
          "
        >
          <div>
            <div
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-[#FF8054]
              "
            >
              Booking engine
            </div>

            <h2
              className="
                mt-2
                text-[19px]
                font-medium
                tracking-[-0.035em]
                text-white/95
              "
            >
              Availability control.
            </h2>

            <p
              className="
                mt-1.5
                max-w-[580px]
                text-[11px]
                leading-[1.6]
                text-white/45
              "
            >
              Define your regular booking schedule and block
              exact dates or times whenever you are unavailable.
            </p>
          </div>

          <div
            className="
              flex
              flex-wrap
              gap-2
            "
          >
            <div
              className="
                rounded-full
                border
                border-white/[0.10]
                bg-[#172127]
                px-3
                py-2
                text-[10px]
                text-white/45
              "
            >
              {activeRules} active windows
            </div>

            <div
              className="
                rounded-full
                border
                border-white/[0.10]
                bg-[#172127]
                px-3
                py-2
                text-[10px]
                text-white/45
              "
            >
              {blockedUpcoming} upcoming blocks
            </div>
          </div>
        </div>
      </div>

      <div
        className="
          grid

          xl:grid-cols-[1.12fr_0.88fr]
        "
      >
        <div
          className="
            border-b
            border-white/[0.09]
            p-5

            sm:p-6

            xl:border-b-0
            xl:border-r
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
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-[38px]
                  w-[38px]
                  items-center
                  justify-center
                  rounded-[10px]
                  border
                  border-[#FF6B36]/20
                  bg-[#FF5A1F]/[0.09]
                "
              >
                <Clock3
                  size={15}
                  strokeWidth={1.5}
                  className="
                    text-[#FF8054]
                  "
                />
              </div>

              <div>
                <h3
                  className="
                    text-[13px]
                    font-medium
                    text-white/75
                  "
                >
                  Regular schedule
                </h3>

                <p
                  className="
                    mt-0.5
                    text-[10px]
                    text-white/35
                  "
                >
                  Repeats every week · {timezone}
                </p>
              </div>
            </div>

            <CalendarDays
              size={16}
              strokeWidth={1.5}
              className="
                text-white/30
              "
            />
          </div>

          <div
            className="
              mt-5
              space-y-2
            "
          >
            {rules.length ===
            0 ? (
              <div
                className="
                  rounded-[14px]
                  border
                  border-dashed
                  border-white/[0.10]
                  bg-[#131D22]
                  px-5
                  py-8
                  text-center
                "
              >
                <div
                  className="
                    text-[11px]
                    text-white/50
                  "
                >
                  No recurring availability.
                </div>

                <div
                  className="
                    mt-1
                    text-[9px]
                    text-white/28
                  "
                >
                  Add your first booking window below.
                </div>
              </div>
            ) : (
              rules.map(
                (
                  rule,
                ) => (
                  <WeeklyRuleCard
                    key={rule.id}
                    rule={rule}
                  />
                ),
              )
            )}
          </div>

          <AddWeeklyWindow />
        </div>

        <div
          className="
            p-5

            sm:p-6
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
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-[38px]
                  w-[38px]
                  items-center
                  justify-center
                  rounded-[10px]
                  border
                  border-white/[0.10]
                  bg-[#172127]
                "
              >
                <CalendarClock
                  size={15}
                  strokeWidth={1.5}
                  className="
                    text-white/50
                  "
                />
              </div>

              <div>
                <h3
                  className="
                    text-[13px]
                    font-medium
                    text-white/75
                  "
                >
                  Schedule exceptions
                </h3>

                <p
                  className="
                    mt-0.5
                    text-[10px]
                    text-white/35
                  "
                >
                  Travel, meetings, holidays or extra availability.
                </p>
              </div>
            </div>
          </div>

          <AddOverride
            todayKey={todayKey}
          />

          <div
            className="
              mt-6
              flex
              items-center
              justify-between
            "
          >
            <div
              className="
                text-[10px]
                font-semibold
                text-white/40
              "
            >
              Upcoming exceptions
            </div>

            <div
              className="
                text-[10px]
                text-white/30
              "
            >
              {overrides.length} total
            </div>
          </div>

          <OverrideList
            overrides={overrides}
          />
        </div>
      </div>
    </section>
  );
}