"use client";

import Link from "next/link";
import styles from "@/app/admin/AdminDashboard.module.css";

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
    <section className={styles.filters} aria-labelledby="filter-heading">
      <div className={styles.filterHeading}>
        <h2 id="filter-heading">Find leads & bookings</h2>
        <p>Filters apply to the lists below. Overview totals stay unchanged.</p>
      </div>
      <form method="GET" action="/admin" className={styles.filterGrid}>
        <div className={styles.searchField}>
          <label htmlFor="admin-search" className={styles.fieldLabel}>Search</label>
          <div className={styles.searchInput}>
            <Search size={17} strokeWidth={1.7} aria-hidden="true" />
            <input id="admin-search" name="q" defaultValue={query}
              placeholder="Name, email, company or website" className={styles.input} />
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor="admin-lead-status" className={styles.fieldLabel}>Lead status</label>
          <AdminSelect id="admin-lead-status" ariaLabel="Lead status" name="leadStatus"
            options={leadOptions} defaultValue={leadStatus} />
        </div>
        <div className={styles.field}>
          <label htmlFor="admin-booking-status" className={styles.fieldLabel}>Booking status</label>
          <AdminSelect id="admin-booking-status" ariaLabel="Booking status" name="bookingStatus"
            options={bookingOptions} defaultValue={bookingStatus} />
        </div>
        <div className={styles.field}>
          <label htmlFor="admin-booking-view" className={styles.fieldLabel}>Booking view</label>
          <AdminSelect id="admin-booking-view" ariaLabel="Booking view" name="bookingView"
            options={bookingViewOptions} defaultValue={bookingView} />
        </div>
        <div className={styles.filterActions}>
          <button type="submit" className={styles.primaryButton}>Apply</button>
          <Link href="/admin" className={styles.button}>Reset</Link>
        </div>
      </form>
    </section>
  );
}
