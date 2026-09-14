import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  revalidatePath,
} from "next/cache";

import {
  isAdminAuthenticated,
} from "@/lib/admin/auth";

import {
  getDb,
} from "@/lib/db";

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

function redirectToAdmin(
  request: NextRequest,
  anchor =
    "availability",
) {
  return NextResponse.redirect(
    new URL(
      `/admin#${anchor}`,
      request.url,
    ),
    303,
  );
}

function parseInteger(
  value: FormDataEntryValue | null,
): number | null {
  if (
    typeof value !==
    "string"
  ) {
    return null;
  }

  const parsed =
    Number.parseInt(
      value,
      10,
    );

  return Number.isFinite(
    parsed,
  )
    ? parsed
    : null;
}

function timeToMinute(
  value: FormDataEntryValue | null,
): number | null {
  if (
    typeof value !==
    "string"
  ) {
    return null;
  }

  const normalized =
    value.trim();

  const match =
    /^([01]\d|2[0-3]):([0-5]\d)$/.exec(
      normalized,
    );

  if (!match) {
    return null;
  }

  const hour =
    Number(
      match[1],
    );

  const minute =
    Number(
      match[2],
    );

  return (
    hour * 60 +
    minute
  );
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

    const action =
      formData
        .get(
          "action",
        )
        ?.toString()
        .trim() ??
      "save";

    const ruleId =
      formData
        .get(
          "ruleId",
        )
        ?.toString()
        .trim() ||
      null;

    const db =
      getDb();

    /* =====================================================
       DELETE
    ===================================================== */

    if (
      action ===
      "delete"
    ) {
      if (!ruleId) {
        return redirectToAdmin(
          request,
        );
      }

      await db.availabilityRule.deleteMany({
        where: {
          id:
            ruleId,
        },
      });

      revalidatePath(
        "/admin",
      );

      return redirectToAdmin(
        request,
      );
    }

    /* =====================================================
       CREATE / UPDATE
    ===================================================== */

    const weekday =
      parseInteger(
        formData.get(
          "weekday",
        ),
      );

    const startMinute =
      timeToMinute(
        formData.get(
          "start",
        ),
      );

    const endMinute =
      timeToMinute(
        formData.get(
          "end",
        ),
      );

    const enabled =
      formData.get(
        "enabled",
      ) ===
      "on";

    if (
      weekday === null ||
      weekday < 0 ||
      weekday > 6 ||
      startMinute === null ||
      endMinute === null ||
      endMinute <= startMinute
    ) {
      console.error(
        "Invalid admin availability rule request.",
        {
          weekday,
          startMinute,
          endMinute,
        },
      );

      return redirectToAdmin(
        request,
      );
    }

    if (ruleId) {
      await db.availabilityRule.update({
        where: {
          id:
            ruleId,
        },

        data: {
          weekday,
          startMinute,
          endMinute,
          enabled,
        },
      });
    } else {
      await db.availabilityRule.create({
        data: {
          weekday,
          startMinute,
          endMinute,
          enabled,
        },
      });
    }

    revalidatePath(
      "/admin",
    );

    return redirectToAdmin(
      request,
    );
  } catch (error) {
    console.error(
      "Admin availability rule update failed:",
      error,
    );

    return redirectToAdmin(
      request,
    );
  }
}