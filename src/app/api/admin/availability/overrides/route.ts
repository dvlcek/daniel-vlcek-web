import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  revalidatePath,
} from "next/cache";

import {
  DateTime,
} from "luxon";

import {
  AvailabilityOverrideType,
} from "@/generated/prisma/enums";

import {
  isAdminAuthenticated,
} from "@/lib/admin/auth";

import {
  getDb,
} from "@/lib/db";

import {
  bookingConfig,
} from "@/lib/booking/config";

/* =========================================================
   CONFIG
========================================================= */

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

/* =========================================================
   HELPERS
========================================================= */

function redirectToAvailability(
  request: NextRequest,
) {
  return NextResponse.redirect(
    new URL(
      "/admin#availability",
      request.url,
    ),
    303,
  );
}

function timeToMinute(
  value: FormDataEntryValue | null,
): number | null {
  if (
    typeof value !==
      "string" ||
    value.trim() ===
      ""
  ) {
    return null;
  }

  const match =
    /^([01]\d|2[0-3]):([0-5]\d)$/.exec(
      value.trim(),
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

function parseOverrideType(
  value: FormDataEntryValue | null,
): AvailabilityOverrideType | null {
  if (
    value ===
    AvailabilityOverrideType.BLOCK
  ) {
    return AvailabilityOverrideType.BLOCK;
  }

  if (
    value ===
    AvailabilityOverrideType.AVAILABLE
  ) {
    return AvailabilityOverrideType.AVAILABLE;
  }

  return null;
}

/* =========================================================
   POST
========================================================= */

export async function POST(
  request: NextRequest,
) {
  const authenticated =
    await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.redirect(
      new URL(
        "/admin/login",
        request.url,
      ),
      303,
    );
  }

  try {
    const formData =
      await request.formData();

    const dateKey =
      formData
        .get(
          "dateKey",
        )
        ?.toString()
        .trim();

    const type =
      parseOverrideType(
        formData.get(
          "type",
        ),
      );

    const wholeDay =
      formData.get(
        "wholeDay",
      ) ===
      "on";

    const noteRaw =
      formData
        .get(
          "note",
        )
        ?.toString()
        .trim();

    if (
      !dateKey ||
      !type
    ) {
      return redirectToAvailability(
        request,
      );
    }

    const parsedDate =
      DateTime.fromISO(
        dateKey,
        {
          zone:
            bookingConfig.timezone,
        },
      );

    if (
      !parsedDate.isValid ||
      parsedDate.toFormat(
        "yyyy-MM-dd",
      ) !==
        dateKey
    ) {
      return redirectToAvailability(
        request,
      );
    }

    const startMinute =
      wholeDay
        ? null
        : timeToMinute(
            formData.get(
              "start",
            ),
          );

    const endMinute =
      wholeDay
        ? null
        : timeToMinute(
            formData.get(
              "end",
            ),
          );

    if (
      !wholeDay &&
      (
        startMinute ===
          null ||
        endMinute ===
          null ||
        endMinute <=
          startMinute
      )
    ) {
      return redirectToAvailability(
        request,
      );
    }

    const db =
      getDb();

    await db.availabilityOverride.create({
      data: {
        dateKey,

        type,

        startMinute,

        endMinute,

        note:
          noteRaw
            ? noteRaw.slice(
                0,
                300,
              )
            : null,
      },
    });

    revalidatePath(
      "/admin",
    );

    return redirectToAvailability(
      request,
    );
  } catch (error) {
    console.error(
      "Admin availability override creation failed:",
      error,
    );

    return redirectToAvailability(
      request,
    );
  }
}