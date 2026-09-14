import {
  DateTime,
} from "luxon";

import {
  bookingConfig,
} from "@/lib/booking/config";

import {
  getDb,
} from "@/lib/db";

import {
  AdminAvailabilityEditor,
  type AdminAvailabilityOverride,
  type AdminAvailabilityRule,
} from "@/components/admin/AdminAvailabilityEditor";

/* =========================================================
   COMPONENT
========================================================= */

export async function AdminAvailabilityPanel() {
  const db =
    getDb();

  const todayKey =
    DateTime.now()
      .setZone(
        bookingConfig.timezone,
      )
      .toFormat(
        "yyyy-MM-dd",
      );

  const [
    rules,
    overrides,
  ] =
    await Promise.all([
      db.availabilityRule.findMany({
        orderBy: [
          {
            weekday:
              "asc",
          },

          {
            startMinute:
              "asc",
          },
        ],
      }),

      db.availabilityOverride.findMany({
        where: {
          dateKey: {
            gte:
              todayKey,
          },
        },

        orderBy: [
          {
            dateKey:
              "asc",
          },

          {
            startMinute:
              "asc",
          },
        ],

        take:
          100,
      }),
    ]);

  const serializedRules:
    AdminAvailabilityRule[] =
    rules.map(
      (
        rule,
      ) => ({
        id:
          rule.id,

        weekday:
          rule.weekday,

        startMinute:
          rule.startMinute,

        endMinute:
          rule.endMinute,

        enabled:
          rule.enabled,
      }),
    );

  const serializedOverrides:
    AdminAvailabilityOverride[] =
    overrides.map(
      (
        override,
      ) => ({
        id:
          override.id,

        dateKey:
          override.dateKey,

        startMinute:
          override.startMinute,

        endMinute:
          override.endMinute,

        type:
          override.type,

        note:
          override.note,
      }),
    );

  return (
    <AdminAvailabilityEditor
      rules={
        serializedRules
      }
      overrides={
        serializedOverrides
      }
      todayKey={
        todayKey
      }
      timezone={
        bookingConfig.timezone
      }
    />
  );
}