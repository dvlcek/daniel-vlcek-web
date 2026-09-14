import { config } from "dotenv";

config({
  path: ".env.local",
});

async function main(): Promise<void> {
  if (
    process.env.RESET_BOOKING_DATA !== "YES"
  ) {
    throw new Error(
      [
        "",
        "RESET BLOCKED.",
        "",
        "This command deletes ALL Bookings and Leads.",
        "",
        "Run:",
        '$env:RESET_BOOKING_DATA="YES"',
        "npx tsx .\\scripts\\reset-booking-data.ts",
        "",
      ].join("\n"),
    );
  }

  const { getDb } =
    await import("../src/lib/db");

  const db = getDb();

  try {
    console.log(
      "\n====================================",
    );

    console.log(
      "DANIEL VLKO — BOOKING RESET",
    );

    console.log(
      "====================================\n",
    );

    const result =
      await db.$transaction(
        async (tx) => {
          /*
           * Booking must be deleted first
           * because it references Lead.
           */
          const bookings =
            await tx.booking.deleteMany();

          const leads =
            await tx.lead.deleteMany();

          return {
            bookings:
              bookings.count,

            leads:
              leads.count,
          };
        },
      );

    console.log(
      `Bookings deleted : ${result.bookings}`,
    );

    console.log(
      `Leads deleted    : ${result.leads}`,
    );

    console.log(
      "\nAvailability rules preserved.",
    );

    console.log(
      "Availability overrides preserved.",
    );

    console.log(
      "\n====================================",
    );

    console.log(
      "RESET COMPLETE",
    );

    console.log(
      "====================================\n",
    );
  } finally {
    await db.$disconnect();
  }
}

main().catch(
  (error: unknown) => {
    console.error(
      "\nBOOKING RESET FAILED\n",
    );

    console.error(error);

    process.exitCode = 1;
  },
);