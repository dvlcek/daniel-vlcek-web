"use client";

import {
  Search,
} from "lucide-react";

import {
  BookingStatus,
  LeadStatus,
} from "@/generated/prisma/enums";

import {
  AdminSelect,
  type AdminSelectOption,
} from "@/components/admin/AdminSelect";

type AdminFiltersProps = {
  query: string;
  leadStatus: string;
  bookingStatus: string;
  bookingView: string;
};

function statusLabel(
  value: string,
): string {
  return value
    .toLowerCase()
    .replaceAll(
      "_",
      " ",
    )
    .replace(
      /\b\w/g,
      (
        character,
      ) =>
        character.toUpperCase(),
    );
}

const leadOptions:
  AdminSelectOption[] =
  [
    {
      value: "",
      label:
        "All lead statuses",
    },

    ...Object.values(
      LeadStatus,
    ).map(
      (
        status,
      ) => ({
        value:
          status,

        label:
          statusLabel(
            status,
          ),
      }),
    ),
  ];

const bookingOptions:
  AdminSelectOption[] =
  [
    {
      value: "",
      label:
        "All booking statuses",
    },

    ...Object.values(
      BookingStatus,
    ).map(
      (
        status,
      ) => ({
        value:
          status,

        label:
          statusLabel(
            status,
          ),
      }),
    ),
  ];

const bookingViewOptions:
  AdminSelectOption[] =
  [
    {
      value:
        "upcoming",

      label:
        "Upcoming bookings",

      description:
        "Only future calls",
    },

    {
      value:
        "all",

      label:
        "All bookings",

      description:
        "Full booking history",
    },
  ];

export function AdminFilters({
  query,
  leadStatus,
  bookingStatus,
  bookingView,
}: AdminFiltersProps) {
  return (
    <section
      className="
        mt-6
        rounded-[18px]
        border
        border-white/[0.11]
        bg-[#11191E]
        p-3
        shadow-[0_14px_40px_rgba(0,0,0,0.14)]
      "
    >
      <form
        method="GET"
        action="/admin"
        className="
          grid
          gap-2.5

          md:grid-cols-2

          xl:grid-cols-[minmax(260px,1fr)_190px_205px_190px_auto_auto]
        "
      >
        <div
          className="
            relative

            md:col-span-2
            xl:col-span-1
          "
        >
          <Search
            size={14}
            strokeWidth={1.7}
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              z-10
              -translate-y-1/2
              text-white/35
            "
          />

          <input
            name="q"
            defaultValue={query}
            placeholder="Search lead, email, company, website..."
            className="
              h-[42px]
              w-full
              rounded-[11px]
              border
              border-white/[0.12]
              bg-[#162026]
              pl-10
              pr-4
              text-[12px]
              font-medium
              text-white/75
              outline-none
              transition-all
              placeholder:text-white/30

              hover:border-white/[0.18]

              focus:border-[#FF6B36]/40
              focus:shadow-[0_0_0_3px_rgba(255,90,31,0.05)]
            "
          />
        </div>

        <AdminSelect
          name="leadStatus"
          options={leadOptions}
          defaultValue={
            leadStatus
          }
        />

        <AdminSelect
          name="bookingStatus"
          options={
            bookingOptions
          }
          defaultValue={
            bookingStatus
          }
        />

        <AdminSelect
          name="bookingView"
          options={
            bookingViewOptions
          }
          defaultValue={
            bookingView
          }
        />

        <button
          type="submit"
          className="
            h-[42px]
            rounded-[11px]
            bg-[#FF5A1F]
            px-5
            text-[11px]
            font-semibold
            text-white
            shadow-[0_12px_30px_rgba(255,90,31,0.15)]
            transition-all

            hover:-translate-y-px
            hover:bg-[#ff682e]
          "
        >
          Apply
        </button>

        <a
          href="/admin"
          className="
            flex
            h-[42px]
            items-center
            justify-center
            rounded-[11px]
            border
            border-white/[0.10]
            bg-[#162026]
            px-5
            text-[11px]
            font-semibold
            text-white/45
            transition-all

            hover:border-white/[0.17]
            hover:bg-[#1A252B]
            hover:text-white/75
          "
        >
          Reset
        </a>
      </form>
    </section>
  );
}