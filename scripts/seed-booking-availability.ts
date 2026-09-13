import { config } from "dotenv";

import { getDb } from "../src/lib/db";

/* =========================================================
   ENVIRONMENT
========================================================= */

/*
 * Scripts executed through `tsx` do not use Next.js'
 * environment loader automatically.
 */
config({
  path: ".env.local",
});

/* =========================================================
   HELPERS
========================================================= */

function minutes(
  hour: number,
  minute = 0,
): number {
  return hour * 60 + minute;
}

function formatMinutes(
  value: number,
): string {
  const hour =
    Math.floor(value / 60);

  const minute =
    value % 60;

  return `${String(hour).padStart(
    2,
    "0",
  )}:${String(minute).padStart(
    2,
    "0",
  )}`;
}

/* =========================================================
   DEFAULT WEEKLY SCHEDULE

   weekday:
   0 = Sunday
   1 = Monday
   2 = Tuesday
   3 = Wednesday
   4 = Thursday
   5 = Friday
   6 = Saturday

   TEMPORARY DEFAULT:
   Monday-Friday
   17:00-20:00

   Later this will be editable through
   our own admin / booking dashboard.
========================================================= */

const schedule = [
  {
    weekday: 1,
    startMinute: minutes(17),
    endMinute: minutes(20),
  },
  {
    weekday: 2,
    startMinute: minutes(17),
    endMinute: minutes(20),
  },
  {
    weekday: 3,
    startMinute: minutes(17),
    endMinute: minutes(20),
  },
  {
    weekday: 4,
    startMinute: minutes(17),
    endMinute: minutes(20),
  },
  {
    weekday: 5,
    startMinute: minutes(17),
    endMinute: minutes(20),
  },
] as const;

/* =========================================================
   MAIN
========================================================= */

async function main(): Promise<void> {
  const db =
    getDb();

  try {
    /*
     * This initialization intentionally replaces ONLY
     * recurring AvailabilityRule records.
     *
     * It does NOT touch:
     *
     * - leads
     * - bookings
     * - availability overrides
     */
    await db.$transaction(
      async (tx) => {
        await tx.availabilityRule.deleteMany();

        await tx.availabilityRule.createMany({
          data: schedule.map(
            (rule) => ({
              weekday:
                rule.weekday,

              startMinute:
                rule.startMinute,

              endMinute:
                rule.endMinute,

              enabled: true,
            }),
          ),
        });
      },
    );

    console.log(
      "\nBooking availability seeded successfully.\n",
    );

    console.table(
      schedule.map(
        (rule) => ({
          weekday:
            rule.weekday,

          start:
            formatMinutes(
              rule.startMinute,
            ),

          end:
            formatMinutes(
              rule.endMinute,
            ),
        }),
      ),
    );
  } finally {
    await db.$disconnect();
  }
}

/* =========================================================
   EXECUTION
========================================================= */

main().catch(
  (error: unknown) => {
    console.error(
      "\nBooking availability seed failed:\n",
      error,
    );

    process.exitCode = 1;
  },
);