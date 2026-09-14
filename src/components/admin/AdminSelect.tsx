"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Check,
  ChevronDown,
} from "lucide-react";

export type AdminSelectOption = {
  value: string;
  label: string;
  description?: string;
};

type AdminSelectProps = {
  name?: string;
  options: AdminSelectOption[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (
    value: string,
  ) => void;
  placeholder?: string;
  disabled?: boolean;
  compact?: boolean;
  className?: string;
};

export function AdminSelect({
  name,
  options,
  defaultValue = "",
  value,
  onValueChange,
  placeholder = "Select option",
  disabled = false,
  compact = false,
  className = "",
}: AdminSelectProps) {
  const controlled =
    value !== undefined;

  const [
    internalValue,
    setInternalValue,
  ] =
    useState(
      defaultValue,
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

  const currentValue =
    controlled
      ? value
      : internalValue;

  const selected =
    useMemo(
      () =>
        options.find(
          (
            option,
          ) =>
            option.value ===
            currentValue,
        ),
      [
        currentValue,
        options,
      ],
    );

  useEffect(
    () => {
      function handlePointerDown(
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
        handlePointerDown,
      );

      document.addEventListener(
        "keydown",
        handleKeyDown,
      );

      return () => {
        document.removeEventListener(
          "mousedown",
          handlePointerDown,
        );

        document.removeEventListener(
          "keydown",
          handleKeyDown,
        );
      };
    },
    [],
  );

  function choose(
    nextValue: string,
  ) {
    if (!controlled) {
      setInternalValue(
        nextValue,
      );
    }

    onValueChange?.(
      nextValue,
    );

    setOpen(
      false,
    );
  }

  return (
    <div
      ref={rootRef}
      className={`
        relative
        ${className}
      `}
    >
      {name && (
        <input
          type="hidden"
          name={name}
          value={currentValue}
        />
      )}

      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
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
          w-full
          items-center
          justify-between
          gap-3
          rounded-[11px]
          border
          border-white/[0.12]
          bg-[#162026]
          text-left
          font-medium
          text-white/80
          shadow-[0_4px_16px_rgba(0,0,0,0.10)]
          outline-none
          transition-all

          hover:border-white/[0.19]
          hover:bg-[#1A252B]

          focus:border-[#FF6B36]/45
          focus:shadow-[0_0_0_3px_rgba(255,90,31,0.07)]

          disabled:pointer-events-none
          disabled:opacity-35

          ${
            compact
              ? "h-[36px] px-3 text-[11px]"
              : "h-[42px] px-4 text-[12px]"
          }

          ${
            open
              ? "border-[#FF5A1F]/35 bg-[#1A252B]"
              : ""
          }
        `}
      >
        <span
          className="
            min-w-0
            truncate
          "
        >
          {selected?.label ??
            placeholder}
        </span>

        <ChevronDown
          size={
            compact
              ? 12
              : 14
          }
          strokeWidth={1.7}
          className={`
            shrink-0
            text-white/35
            transition-transform
            duration-200

            ${
              open
                ? "rotate-180 text-[#FF7040]"
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
            top-[calc(100%+7px)]
            z-[160]
            max-h-[290px]
            w-full
            min-w-[190px]
            overflow-y-auto
            rounded-[13px]
            border
            border-white/[0.14]
            bg-[#172127]
            p-1.5
            shadow-[0_24px_70px_rgba(0,0,0,0.55)]
            backdrop-blur-xl

            [scrollbar-color:rgba(255,255,255,0.13)_transparent]
            [scrollbar-width:thin]
          "
        >
          {options.map(
            (
              option,
            ) => {
              const active =
                option.value ===
                currentValue;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    choose(
                      option.value,
                    )
                  }
                  className={`
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-[9px]
                    px-3
                    py-2.5
                    text-left
                    transition-all

                    ${
                      active
                        ? "bg-[#FF5A1F]/[0.11]"
                        : "hover:bg-white/[0.06]"
                    }
                  `}
                >
                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >
                    <div
                      className={`
                        text-[12px]
                        font-medium

                        ${
                          active
                            ? "text-[#FF8054]"
                            : "text-white/75"
                        }
                      `}
                    >
                      {option.label}
                    </div>

                    {option.description && (
                      <div
                        className="
                          mt-1
                          text-[10px]
                          leading-[1.45]
                          text-white/38
                        "
                      >
                        {
                          option.description
                        }
                      </div>
                    )}
                  </div>

                  {active && (
                    <Check
                      size={12}
                      strokeWidth={2}
                      className="
                        shrink-0
                        text-[#FF8054]
                      "
                    />
                  )}
                </button>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}