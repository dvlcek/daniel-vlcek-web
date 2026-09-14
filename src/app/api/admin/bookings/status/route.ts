import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  revalidatePath,
} from "next/cache";

import {
  BookingStatus,
  LeadStatus,
} from "@/generated/prisma/enums";

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
   ALLOWED STATUSES
========================================================= */

const allowedStatuses =
  new Set<BookingStatus>([
    BookingStatus.CONFIRMED,
    BookingStatus.COMPLETED,
    BookingStatus.NO_SHOW,
  ]);

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

    const bookingId =
      formData
        .get(
          "bookingId",
        )
        ?.toString()
        .trim();

    const statusRaw =
      formData
        .get(
          "status",
        )
        ?.toString()
        .trim();

    if (
      !bookingId ||
      !statusRaw
    ) {
      return NextResponse.redirect(
        new URL(
          "/admin",
          request.url,
        ),
        303,
      );
    }

    const status =
      statusRaw as
        BookingStatus;

    if (
      !allowedStatuses.has(
        status,
      )
    ) {
      return NextResponse.redirect(
        new URL(
          "/admin",
          request.url,
        ),
        303,
      );
    }

    const db =
      getDb();

    const booking =
      await db.booking.findUnique({
        where: {
          id:
            bookingId,
        },

        select: {
          id: true,

          leadId: true,

          lead: {
            select: {
              status:
                true,
            },
          },
        },
      });

    if (!booking) {
      return NextResponse.redirect(
        new URL(
          "/admin",
          request.url,
        ),
        303,
      );
    }

    await db.$transaction(
      async (
        tx,
      ) => {
        await tx.booking.update({
          where: {
            id:
              booking.id,
          },

          data: {
            status,
          },
        });

        /* ===============================================
           NO SHOW
        =============================================== */

        if (
          status ===
          BookingStatus.NO_SHOW
        ) {
          await tx.lead.update({
            where: {
              id:
                booking.leadId,
            },

            data: {
              status:
                LeadStatus.NO_SHOW,
            },
          });

          return;
        }

        /* ===============================================
           RESTORE CONFIRMED BOOKING
        =============================================== */

        if (
          status ===
            BookingStatus.CONFIRMED &&
          (
            booking.lead
              .status ===
              LeadStatus.NO_SHOW ||
            booking.lead
              .status ===
              LeadStatus.NEW ||
            booking.lead
              .status ===
              LeadStatus.BOOKING_STARTED
          )
        ) {
          await tx.lead.update({
            where: {
              id:
                booking.leadId,
            },

            data: {
              status:
                LeadStatus.BOOKED,
            },
          });
        }

        /*
         * COMPLETED intentionally does not automatically
         * convert the CRM lead to QUALIFIED/WON.
         *
         * Those remain deliberate sales decisions.
         */
      },
    );

    revalidatePath(
      "/admin",
    );

    return NextResponse.redirect(
      new URL(
        "/admin",
        request.url,
      ),
      303,
    );
  } catch (error) {
    console.error(
      "Admin booking status update failed:",
      error,
    );

    return NextResponse.redirect(
      new URL(
        "/admin",
        request.url,
      ),
      303,
    );
  }
}