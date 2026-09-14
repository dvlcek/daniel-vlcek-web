"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  format,
  isValid,
  parseISO,
} from "date-fns";

import {
  CalendarDays,
  ChevronDown,
} from "lucide-react";

import {
  DayPicker,
} from "react-day-picker";

type AdminDatePickerProps = {
  name: string;
  defaultValue?: string;
  minDate?: Date;
  placeholder?: string;
};

function parseInitialDate(
  value:
    string | undefined,
): Date | undefined {
  if (!value) {
    return undefined;
  }

  const date =
    parseISO(
      value,
    );

  return isValid(
    date,
  )
    ? date
    : undefined;
}

export function AdminDatePicker({
  name,
  defaultValue,
  minDate,
  placeholder = "Choose date",
}: AdminDatePickerProps) {
  const [
    selected,
    setSelected,
  ] =
    useState<
      Date | undefined
    >(
      parseInitialDate(
        defaultValue,
      ),
    );

  const [
    open,
    setOpen,
  ] =
    useState(
      false,
    );

  const rootRef =
    useRef<HTMLDivElement>(
      null,
    );

  useEffect(
    () => {
      function handleOutside(
        event: MouseEvent,
      ) {
        if (
          rootRef.current &&
          !rootRef.current.contains(
            event.target as Node,
          )
        ) {
          setOpen(
            false,
          );
        }
      }

      function handleKeyDown(
        event: KeyboardEvent,
      ) {
        if (
          event.key ===
          "Escape"
        ) {
          setOpen(
            false,
          );
        }
      }

      document.addEventListener(
        "mousedown",
        handleOutside,
      );

      document.addEventListener(
        "keydown",
        handleKeyDown,
      );

      return () => {
        document.removeEventListener(
          "mousedown",
          handleOutside,
        );

        document.removeEventListener(
          "keydown",
          handleKeyDown,
        );
      };
    },
    [],
  );

  const formValue =
    selected
      ? format(
          selected,
          "yyyy-MM-dd",
        )
      : "";

  const displayValue =
    selected
      ? format(
          selected,
          "EEE, d MMM yyyy",
        )
      : placeholder;

  return (
    <div
      ref={rootRef}
      className="
        relative
      "
    >
      <input
        type="hidden"
        name={name}
        value={formValue}
      />

      <button
        type="button"
        onClick={() =>
          setOpen(
            (
              previous,
            ) =>
              !previous,
          )
        }
        className={`
          flex
          h-[42px]
          w-full
          items-center
          justify-between
          gap-3
          rounded-[11px]
          border
          bg-[#162026]
          px-4
          text-left
          text-[12px]
          font-medium
          shadow-[0_4px_16px_rgba(0,0,0,0.10)]
          outline-none
          transition-all

          hover:border-white/[0.19]
          hover:bg-[#1A252B]

          ${
            open
              ? "border-[#FF6B36]/40"
              : "border-white/[0.12]"
          }

          ${
            selected
              ? "text-white/80"
              : "text-white/40"
          }
        `}
      >
        <span
          className="
            flex
            min-w-0
            items-center
            gap-2.5
          "
        >
          <CalendarDays
            size={14}
            strokeWidth={1.6}
            className="
              shrink-0
              text-[#FF8054]
            "
          />

          <span
            className="
              truncate
            "
          >
            {
              displayValue
            }
          </span>
        </span>

        <ChevronDown
          size={13}
          strokeWidth={1.7}
          className={`
            shrink-0
            text-white/35
            transition-transform

            ${
              open
                ? "rotate-180 text-[#FF8054]"
                : ""
            }
          `}
        />
      </button>

      {open && (
        <div
          className="
            absolute
            left-0
            top-[calc(100%+8px)]
            z-[180]
            w-[320px]
            max-w-[calc(100vw-40px)]
            rounded-[17px]
            border
            border-white/[0.14]
            bg-[#172127]
            p-3
            shadow-[0_30px_90px_rgba(0,0,0,0.58)]
            backdrop-blur-xl
          "
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(
              next,
            ) => {
              if (
                next
              ) {
                setSelected(
                  next,
                );

                setOpen(
                  false,
                );
              }
            }}
            disabled={
              minDate
                ? {
                    before:
                      minDate,
                  }
                : undefined
            }
            showOutsideDays
            classNames={{
              root:
                "w-full",

              months:
                "w-full",

              month:
                "w-full",

              month_caption:
                "relative flex h-10 items-center justify-center mb-1",

              caption_label:
                "text-[13px] font-medium tracking-[-0.02em] text-white/80",

              nav:
                "absolute left-3 right-3 top-3 z-10 flex items-center justify-between pointer-events-none",

              button_previous:
                "pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.10] text-white/45 transition-all hover:bg-white/[0.06] hover:text-white/80",

              button_next:
                "pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.10] text-white/45 transition-all hover:bg-white/[0.06] hover:text-white/80",

              month_grid:
                "w-full border-collapse",

              weekdays:
                "grid grid-cols-7 mb-1",

              weekday:
                "flex h-8 items-center justify-center text-[9px] font-semibold uppercase tracking-[0.09em] text-white/30",

              week:
                "grid grid-cols-7",

              day:
                "relative flex aspect-square items-center justify-center p-[2px]",

              day_button:
                "flex h-full w-full items-center justify-center rounded-[9px] text-[11px] text-white/62 outline-none transition-all hover:bg-white/[0.07] hover:text-white focus-visible:ring-1 focus-visible:ring-[#FF5A1F]/50",

              selected:
                "[&>button]:bg-[#FF5A1F] [&>button]:text-white [&>button]:shadow-[0_7px_24px_rgba(255,90,31,0.24)] hover:[&>button]:bg-[#FF5A1F]",

              today:
                "[&>button]:border [&>button]:border-[#FF5A1F]/35 [&>button]:text-[#FF8054]",

              outside:
                "opacity-20",

              disabled:
                "opacity-10 pointer-events-none",
            }}
          />

          <div
            className="
              mt-2
              border-t
              border-white/[0.08]
              px-1
              pt-3
              text-[9px]
              leading-[1.5]
              text-white/30
            "
          >
            Schedule timezone: Europe/Vienna
          </div>
        </div>
      )}
    </div>
  );
}