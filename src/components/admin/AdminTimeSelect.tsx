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
  Clock3,
  Search,
} from "lucide-react";

type AdminTimeSelectProps = {
  name: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (
    value: string,
  ) => void;
  disabled?: boolean;
  compact?: boolean;
};

type TimeOption = {
  value: string;
  minutes: number;
};

const TIME_STEP_MINUTES =
  15;

function minutesToTime(
  totalMinutes: number,
): string {
  const hour =
    Math.floor(
      totalMinutes / 60,
    );

  const minute =
    totalMinutes % 60;

  return `${hour
    .toString()
    .padStart(
      2,
      "0",
    )}:${minute
    .toString()
    .padStart(
      2,
      "0",
    )}`;
}

function timeToMinutes(
  value: string,
): number | null {
  const match =
    /^([01]\d|2[0-3]):([0-5]\d)$/.exec(
      value,
    );

  if (!match) {
    return null;
  }

  return (
    Number(
      match[1],
    ) *
      60 +
    Number(
      match[2],
    )
  );
}

function normalizeFinalTime(
  rawValue: string,
): string {
  const value =
    rawValue
      .trim()
      .replace(
        /[^\d:]/g,
        "",
      );

  if (
    /^\d{4}$/.test(
      value,
    )
  ) {
    return `${value.slice(
      0,
      2,
    )}:${value.slice(
      2,
      4,
    )}`;
  }

  if (
    /^\d{3}$/.test(
      value,
    )
  ) {
    return `0${value.slice(
      0,
      1,
    )}:${value.slice(
      1,
      3,
    )}`;
  }

  const match =
    /^(\d{1,2}):(\d{2})$/.exec(
      value,
    );

  if (match) {
    const hour =
      Number(
        match[1],
      );

    const minute =
      Number(
        match[2],
      );

    if (
      hour >= 0 &&
      hour <= 23 &&
      minute >= 0 &&
      minute <= 59
    ) {
      return `${hour
        .toString()
        .padStart(
          2,
          "0",
        )}:${minute
        .toString()
        .padStart(
          2,
          "0",
        )}`;
    }
  }

  return value;
}

function isValidTime(
  value: string,
): boolean {
  return (
    timeToMinutes(
      value,
    ) !== null
  );
}

function createTimeOptions(): TimeOption[] {
  const options:
    TimeOption[] =
    [];

  for (
    let minutes = 0;
    minutes <
    24 * 60;
    minutes +=
      TIME_STEP_MINUTES
  ) {
    options.push({
      value:
        minutesToTime(
          minutes,
        ),

      minutes,
    });
  }

  return options;
}

export function AdminTimeSelect({
  name,
  defaultValue = "17:00",
  value,
  onValueChange,
  disabled = false,
  compact = false,
}: AdminTimeSelectProps) {
  const controlled =
    value !== undefined;

  const startingValue =
    normalizeFinalTime(
      value ??
        defaultValue,
    );

  const [
    internalValue,
    setInternalValue,
  ] =
    useState(
      startingValue,
    );

  const currentValue =
    controlled
      ? normalizeFinalTime(
          value ??
            "",
        )
      : internalValue;

  const [
    query,
    setQuery,
  ] =
    useState(
      currentValue,
    );

  const [
    open,
    setOpen,
  ] =
    useState(
      false,
    );

  const [
    typing,
    setTyping,
  ] =
    useState(
      false,
    );

  const [
    highlightedIndex,
    setHighlightedIndex,
  ] =
    useState(
      0,
    );

  const rootRef =
    useRef<HTMLDivElement>(
      null,
    );

  const inputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const listRef =
    useRef<HTMLDivElement>(
      null,
    );

  const allOptions =
    useMemo(
      () =>
        createTimeOptions(),
      [],
    );

  useEffect(
    () => {
      if (
        controlled
      ) {
        const next =
          normalizeFinalTime(
            value ??
              "",
          );

        setQuery(
          next,
        );
      }
    },
    [
      controlled,
      value,
    ],
  );

  const filteredOptions =
    useMemo(
      () => {
        if (
          !typing
        ) {
          return allOptions;
        }

        const raw =
          query
            .trim()
            .replace(
              /\s+/g,
              "",
            );

        if (!raw) {
          return allOptions;
        }

        const compactQuery =
          raw.replace(
            ":",
            "",
          );

        /*
         * "17" -> all 17:xx.
         */
        if (
          /^\d{1,2}$/.test(
            compactQuery,
          )
        ) {
          const hour =
            Number(
              compactQuery,
            );

          if (
            hour >= 0 &&
            hour <= 23
          ) {
            const prefix =
              `${hour
                .toString()
                .padStart(
                  2,
                  "0",
                )}:`;

            return allOptions.filter(
              (
                option,
              ) =>
                option.value.startsWith(
                  prefix,
                ),
            );
          }
        }

        /*
         * "173" -> 17:30
         * "1730" -> 17:30
         */
        if (
          /^\d{3,4}$/.test(
            compactQuery,
          )
        ) {
          return allOptions.filter(
            (
              option,
            ) =>
              option.value
                .replace(
                  ":",
                  "",
                )
                .startsWith(
                  compactQuery,
                ),
          );
        }

        /*
         * "17:3" -> 17:30.
         */
        return allOptions.filter(
          (
            option,
          ) =>
            option.value.startsWith(
              raw,
            ) ||
            option.value
              .replace(
                ":",
                "",
              )
              .startsWith(
                compactQuery,
              ),
        );
      },
      [
        allOptions,
        query,
        typing,
      ],
    );

  const normalizedTypedValue =
    normalizeFinalTime(
      query,
    );

  const completeTypedInput =
    /^\d{3,4}$/.test(
      query,
    ) ||
    /^\d{1,2}:\d{2}$/.test(
      query,
    );

  const showCustomOption =
    typing &&
    completeTypedInput &&
    isValidTime(
      normalizedTypedValue,
    ) &&
    !allOptions.some(
      (
        option,
      ) =>
        option.value ===
        normalizedTypedValue,
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
          setQuery(
            currentValue,
          );

          setTyping(
            false,
          );

          setOpen(
            false,
          );
        }
      }

      function handleEscape(
        event: KeyboardEvent,
      ) {
        if (
          event.key ===
          "Escape"
        ) {
          setQuery(
            currentValue,
          );

          setTyping(
            false,
          );

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
        handleEscape,
      );

      return () => {
        document.removeEventListener(
          "mousedown",
          handleOutside,
        );

        document.removeEventListener(
          "keydown",
          handleEscape,
        );
      };
    },
    [
      currentValue,
    ],
  );

  useEffect(
    () => {
      if (
        !open ||
        typing
      ) {
        return;
      }

      const currentIndex =
        allOptions.findIndex(
          (
            option,
          ) =>
            option.value ===
            currentValue,
        );

      setHighlightedIndex(
        currentIndex >=
          0
          ? currentIndex
          : 0,
      );
    },
    [
      allOptions,
      currentValue,
      open,
      typing,
    ],
  );

  useEffect(
    () => {
      if (
        !open ||
        !listRef.current
      ) {
        return;
      }

      const element =
        listRef.current.querySelector(
          `[data-time-index="${highlightedIndex}"]`,
        );

      element?.scrollIntoView({
        block:
          "nearest",
      });
    },
    [
      highlightedIndex,
      open,
    ],
  );

  function selectValue(
    nextValue: string,
  ) {
    const normalized =
      normalizeFinalTime(
        nextValue,
      );

    if (
      !isValidTime(
        normalized,
      )
    ) {
      return;
    }

    if (!controlled) {
      setInternalValue(
        normalized,
      );
    }

    setQuery(
      normalized,
    );

    setTyping(
      false,
    );

    onValueChange?.(
      normalized,
    );

    setOpen(
      false,
    );
  }

  function handleKeyDown(
    event:
      React.KeyboardEvent<HTMLInputElement>,
  ) {
    const customOffset =
      showCustomOption
        ? 1
        : 0;

    const totalItems =
      filteredOptions.length +
      customOffset;

    if (
      event.key ===
      "ArrowDown"
    ) {
      event.preventDefault();

      setOpen(
        true,
      );

      setHighlightedIndex(
        (
          previous,
        ) =>
          totalItems >
          0
            ? (
                previous +
                1
              ) %
              totalItems
            : 0,
      );

      return;
    }

    if (
      event.key ===
      "ArrowUp"
    ) {
      event.preventDefault();

      setOpen(
        true,
      );

      setHighlightedIndex(
        (
          previous,
        ) =>
          totalItems >
          0
            ? (
                previous -
                1 +
                totalItems
              ) %
              totalItems
            : 0,
      );

      return;
    }

    if (
      event.key ===
      "Enter"
    ) {
      event.preventDefault();

      if (
        showCustomOption &&
        highlightedIndex ===
          0
      ) {
        selectValue(
          normalizedTypedValue,
        );

        return;
      }

      const optionIndex =
        highlightedIndex -
        customOffset;

      const option =
        filteredOptions[
          optionIndex
        ];

      if (option) {
        selectValue(
          option.value,
        );

        return;
      }

      if (
        completeTypedInput &&
        isValidTime(
          normalizedTypedValue,
        )
      ) {
        selectValue(
          normalizedTypedValue,
        );
      }
    }
  }

  return (
    <div
      ref={rootRef}
      className="
        relative
        w-full
      "
    >
      <input
        type="hidden"
        name={name}
        value={currentValue}
      />

      <div
        className={`
          relative
          flex
          w-full
          items-center
          rounded-[11px]
          border
          bg-[#162026]
          shadow-[0_4px_16px_rgba(0,0,0,0.10)]
          transition-all

          ${
            open
              ? "border-[#FF6B36]/45 shadow-[0_0_0_3px_rgba(255,90,31,0.06)]"
              : "border-white/[0.12]"
          }

          ${
            compact
              ? "h-[36px]"
              : "h-[42px]"
          }

          ${
            disabled
              ? "pointer-events-none opacity-40"
              : "hover:border-white/[0.19] hover:bg-[#1A252B]"
          }
        `}
      >
        <div
          className="
            pointer-events-none
            absolute
            left-3
            flex
            items-center
            justify-center
            text-[#FF8054]/80
          "
        >
          {open ? (
            <Search
              size={
                compact
                  ? 11
                  : 13
              }
              strokeWidth={1.7}
            />
          ) : (
            <Clock3
              size={
                compact
                  ? 11
                  : 13
              }
              strokeWidth={1.6}
            />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
          disabled={disabled}
          value={query}
          placeholder="HH:MM"
          onFocus={() => {
            setOpen(
              true,
            );

            setTyping(
              false,
            );

            requestAnimationFrame(
              () =>
                inputRef.current?.select(),
            );
          }}
          onClick={() =>
            setOpen(
              true,
            )
          }
          onChange={(
            event,
          ) => {
            const nextQuery =
              event.target.value
                .replace(
                  /[^\d:]/g,
                  "",
                )
                .slice(
                  0,
                  5,
                );

            setQuery(
              nextQuery,
            );

            setTyping(
              true,
            );

            setOpen(
              true,
            );

            setHighlightedIndex(
              0,
            );
          }}
          onKeyDown={
            handleKeyDown
          }
          className={`
            h-full
            w-full
            bg-transparent
            font-medium
            tabular-nums
            text-white/85
            outline-none
            placeholder:text-white/30

            ${
              compact
                ? "pl-8 pr-8 text-[11px]"
                : "pl-9 pr-9 text-[12px]"
            }
          `}
        />

        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          aria-label="Open time options"
          onClick={() => {
            setTyping(
              false,
            );

            setOpen(
              (
                previous,
              ) =>
                !previous,
            );

            inputRef.current?.focus();
          }}
          className="
            absolute
            right-2
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-[7px]
            text-white/35
            transition-all

            hover:bg-white/[0.06]
            hover:text-white/70
          "
        >
          <ChevronDown
            size={12}
            strokeWidth={1.7}
            className={`
              transition-transform
              duration-200

              ${
                open
                  ? "rotate-180 text-[#FF8054]"
                  : ""
              }
            `}
          />
        </button>
      </div>

      {open && (
        <div
          className="
            absolute
            left-0
            top-[calc(100%+7px)]
            z-[190]
            w-full
            min-w-[160px]
            overflow-hidden
            rounded-[14px]
            border
            border-white/[0.14]
            bg-[#172127]
            shadow-[0_28px_80px_rgba(0,0,0,0.55)]
            backdrop-blur-xl
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
              border-b
              border-white/[0.08]
              px-3
              py-2.5
            "
          >
            <div>
              <div
                className="
                  text-[11px]
                  font-semibold
                  text-white/65
                "
              >
                Select time
              </div>

              <div
                className="
                  mt-0.5
                  text-[9px]
                  text-white/30
                "
              >
                Type to search
              </div>
            </div>

            {typing && (
              <div
                className="
                  shrink-0
                  rounded-full
                  bg-white/[0.05]
                  px-2
                  py-1
                  text-[9px]
                  text-white/35
                "
              >
                {
                  filteredOptions.length
                }
              </div>
            )}
          </div>

          <div
            ref={listRef}
            className="
              max-h-[260px]
              overflow-y-auto
              p-1.5

              [scrollbar-color:rgba(255,255,255,0.13)_transparent]
              [scrollbar-width:thin]
            "
          >
            {showCustomOption && (
              <button
                type="button"
                data-time-index={0}
                onMouseEnter={() =>
                  setHighlightedIndex(
                    0,
                  )
                }
                onClick={() =>
                  selectValue(
                    normalizedTypedValue,
                  )
                }
                className={`
                  mb-1
                  flex
                  w-full
                  items-center
                  justify-between
                  gap-3
                  rounded-[9px]
                  px-3
                  py-2.5
                  text-left
                  transition-all

                  ${
                    highlightedIndex ===
                    0
                      ? "bg-[#FF5A1F]/[0.13]"
                      : "hover:bg-white/[0.06]"
                  }
                `}
              >
                <div>
                  <div
                    className="
                      text-[12px]
                      font-semibold
                      text-[#FF8054]
                    "
                  >
                    {
                      normalizedTypedValue
                    }
                  </div>

                  <div
                    className="
                      mt-0.5
                      text-[9px]
                      text-white/30
                    "
                  >
                    Use custom time
                  </div>
                </div>

                <Check
                  size={11}
                  strokeWidth={2}
                  className="
                    text-[#FF8054]
                  "
                />
              </button>
            )}

            {filteredOptions.map(
              (
                option,
                index,
              ) => {
                const effectiveIndex =
                  index +
                  (
                    showCustomOption
                      ? 1
                      : 0
                  );

                const active =
                  option.value ===
                  currentValue;

                const highlighted =
                  effectiveIndex ===
                  highlightedIndex;

                return (
                  <button
                    key={option.value}
                    type="button"
                    data-time-index={
                      effectiveIndex
                    }
                    onMouseEnter={() =>
                      setHighlightedIndex(
                        effectiveIndex,
                      )
                    }
                    onClick={() =>
                      selectValue(
                        option.value,
                      )
                    }
                    className={`
                      flex
                      w-full
                      items-center
                      justify-between
                      gap-3
                      rounded-[9px]
                      px-3
                      py-2
                      text-left
                      transition-all

                      ${
                        highlighted
                          ? "bg-white/[0.075]"
                          : ""
                      }

                      ${
                        active
                          ? "text-[#FF8054]"
                          : "text-white/70"
                      }
                    `}
                  >
                    <span
                      className="
                        text-[12px]
                        font-medium
                        tabular-nums
                      "
                    >
                      {
                        option.value
                      }
                    </span>

                    {active && (
                      <Check
                        size={11}
                        strokeWidth={2}
                        className="
                          text-[#FF8054]
                        "
                      />
                    )}
                  </button>
                );
              },
            )}

            {!showCustomOption &&
              filteredOptions.length ===
                0 && (
                <div
                  className="
                    px-3
                    py-6
                    text-center
                  "
                >
                  <div
                    className="
                      text-[11px]
                      font-medium
                      text-white/45
                    "
                  >
                    No matching time
                  </div>

                  <div
                    className="
                      mt-1
                      text-[9px]
                      leading-[1.5]
                      text-white/25
                    "
                  >
                    Try 17, 17:30 or 1730.
                  </div>
                </div>
              )}
          </div>

          <div
            className="
              border-t
              border-white/[0.08]
              px-3
              py-2
              text-[9px]
              text-white/25
            "
          >
            ↑ ↓ navigate · Enter select
          </div>
        </div>
      )}
    </div>
  );
}