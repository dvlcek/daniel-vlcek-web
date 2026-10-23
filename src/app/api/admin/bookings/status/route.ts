import { randomUUID } from "node:crypto";
import { lockReservations, requireFreeSlot } from "@/lib/booking/recovery";
import { readAdminForm } from "@/lib/admin/request";
import { SecurityError, securityResponse } from "@/lib/security/http";
import { logSecurityFailure } from "@/lib/security/log";
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
  try {
    const formData =
      await readAdminForm(request, "booking");

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
          status: true, calendarOperationKey: true, calendarOperation: true, scheduleChangedAt: true, startsAt: true, endsAt: true,
          activeSlotKey: true, externalCalendarEventId: true,

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

    if (booking.calendarOperation || ![BookingStatus.CONFIRMED, BookingStatus.NO_SHOW].includes(booking.status as "CONFIRMED" | "NO_SHOW")
      || !booking.activeSlotKey || !booking.externalCalendarEventId) {
      throw new SecurityError(409, "This booking cannot be changed through a status update.");
    }
    await db.$transaction(
      async (
        tx,
      ) => {
        await lockReservations(tx);
        if (status === BookingStatus.CONFIRMED) await requireFreeSlot(tx, booking.startsAt, booking.endsAt, booking.id);
        const changed = await tx.booking.updateMany({
          where: {
            id:
              booking.id,
            status: booking.status, calendarOperationKey: booking.calendarOperationKey, calendarOperation: null, scheduleChangedAt: booking.scheduleChangedAt,
          },

          data: {
            status, calendarOperationKey: randomUUID(),
          },
        });

        if (!changed.count) throw new SecurityError(409, "This booking has changed. Please refresh.");

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
    if (error instanceof SecurityError) return securityResponse(error, "admin_mutation");
    logSecurityFailure("Admin booking status update failed:", error);

    return NextResponse.redirect(
      new URL(
        "/admin",
        request.url,
      ),
      303,
    );
  }
}