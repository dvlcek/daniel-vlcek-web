import { config } from "dotenv";

config({
  path: ".env.local",
});

async function main(): Promise<void> {
  const {
    GoogleCalendarProvider,
  } = await import(
    "../src/lib/booking/calendar/google"
  );

  const provider =
    new GoogleCalendarProvider();

  const now =
    new Date();

  const tomorrow =
    new Date(
      now.getTime() +
        24 * 60 * 60 * 1000,
    );

  const busy =
    await provider.getBusyPeriods({
      startsAt: now,
      endsAt: tomorrow,
    });

  console.log(
    "\n====================================",
  );

  console.log(
    "GOOGLE CALENDAR CONNECTED",
  );

  console.log(
    "====================================\n",
  );

  console.log(
    `Busy periods in next 24h: ${busy.length}`,
  );

  if (busy.length === 0) {
    console.log(
      "\nNo busy periods found in the next 24 hours.\n",
    );

    return;
  }

  console.table(
    busy.map(
      (period) => ({
        startsAt:
          period.startsAt.toISOString(),

        endsAt:
          period.endsAt.toISOString(),
      }),
    ),
  );
}

main().catch(
  (error: unknown) => {
    console.error(
      "\n====================================",
    );

    console.error(
      "GOOGLE CALENDAR TEST FAILED",
    );

    console.error(
      "====================================\n",
    );

    console.error(error);

    process.exitCode = 1;
  },
);