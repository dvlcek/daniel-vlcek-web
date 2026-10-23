"use client";

import styles from "@/app/admin/AdminDashboard.module.css";

import {
  useEffect,
  useId,
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
  id?: string;
  ariaLabel?: string;
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
  id,
  ariaLabel,
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
  const generatedId = useId();
  const controlId = id ?? generatedId;
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
    rootRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }

  return (
    <div
      ref={rootRef}
      className={`
        relative
        min-w-0
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
        id={controlId}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-controls={open ? `${controlId}-options` : undefined}
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
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
            requestAnimationFrame(() => {
              const options = rootRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]');
              if (options?.length) options[event.key === "ArrowUp" ? options.length - 1 : 0].focus();
            });
          }
        }}
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
          transition-colors

          hover:border-white/[0.19]
          hover:bg-[#1A252B]

          focus:border-[#FF6B36]/45
          focus:shadow-[0_0_0_3px_rgba(255,90,31,0.07)]

          disabled:pointer-events-none
          disabled:opacity-35

          ${
            compact
              ? "h-[40px] px-3 text-[13px]"
              : "h-[44px] px-4 text-[14px]"
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
            text-white/60
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
          id={`${controlId}-options`}
          role="listbox"
          aria-label={ariaLabel ?? "Options"}
          onKeyDown={(event) => {
            const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="option"]'));
            const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              buttons[(index + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length]?.focus();
            } else if (event.key === "Home" || event.key === "End") {
              event.preventDefault();
              buttons[event.key === "Home" ? 0 : buttons.length - 1]?.focus();
            } else if (event.key === "Escape") {
              event.preventDefault();
              setOpen(false);
              rootRef.current?.querySelector<HTMLButtonElement>(`[id="${controlId}"]`)?.focus();
            } else if (event.key === "Tab") {
              setOpen(false);
            }
          }}
          className={`${styles.selectPopover}
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
          `}
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
                    role="option"
                    aria-selected={active}
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
                    transition-colors

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
                        text-[14px]
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
                          text-[12px]
                          leading-[1.45]
                          text-white/60
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
