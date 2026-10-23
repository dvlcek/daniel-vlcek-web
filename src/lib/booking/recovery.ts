import { createHash, randomUUID } from "node:crypto";
import { Prisma, type Booking } from "@/generated/prisma/client";
import { getDb } from "@/lib/db";
import { SecurityError } from "@/lib/security/http";
import { logSecurityFailure, safeErrorCode } from "@/lib/security/log";
import { bookingConfig } from "./config";
import { getCalendarProvider } from "./calendar";
import type { CalendarEventResult } from "./calendar/provider";
import { googleStatus } from "./calendar/google";
import { createBookingManageToken } from "./tokens";
import { buildBookingManageUrl } from "./manage-url";
import { sendBookingConfirmationEmail } from "@/lib/email/booking-confirmation";
import { sendBookingCancellationEmail } from "@/lib/email/booking-cancellation";

type Tx = Prisma.TransactionClient;
export type CalendarOperation = "CREATE" | "RESCHEDULE" | "CANCEL";
const leaseMs = 120_000;

export function stableCalendarId(bookingId: string): string {
  return `dv${createHash("sha256").update(bookingId).digest("hex")}`;
}

// All local reservation writers use the same transaction lock, including distinct attempts.
// External requests are always outside this transaction.
export async function lockReservations(tx: Tx): Promise<void> {
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(731422109)`;
}

export async function requireFreeSlot(tx: Tx, startsAt: Date, endsAt: Date, excludeId?: string): Promise<void> {
  const conflict = await tx.booking.findFirst({ where: {
    ...(excludeId ? { id: { not: excludeId } } : {}),
    status: { in: ["PENDING", "CONFIRMED"] },
    startsAt: { lt: new Date(+endsAt + (bookingConfig.bufferBeforeMinutes + bookingConfig.bufferAfterMinutes) * 60000) },
    endsAt: { gt: new Date(+startsAt - (bookingConfig.bufferBeforeMinutes + bookingConfig.bufferAfterMinutes) * 60000) },
  }, select: { id: true } });
  if (conflict) throw new SecurityError(409, "This time was just booked. Please choose another slot.");
}

export function operationData(kind: CalendarOperation) {
  return { calendarOperation: kind, calendarOperationKey: randomUUID(), calendarOperationEtag: null, calendarLeaseUntil: null, calendarError: null };
}

export async function beginCalendarOperation(booking: Booking, kind: "CANCEL" | "RESCHEDULE", slot?: { startsAt: Date; endsAt: Date }): Promise<void> {
  await getDb().$transaction(async tx => {
    await lockReservations(tx);
    if (slot) await requireFreeSlot(tx, slot.startsAt, slot.endsAt, booking.id);
    const claimed = await tx.booking.updateMany({ where: {
      id: booking.id, status: "CONFIRMED", calendarOperation: null,
      scheduleChangedAt: booking.scheduleChangedAt, calendarOperationKey: booking.calendarOperationKey,
    }, data: { ...operationData(kind), status: "PENDING",
      ...(slot ? { ...slot, activeSlotKey: slot.startsAt.toISOString().replace(".000Z", "Z") } : {}),
    } });
    if (!claimed.count) throw new SecurityError(409, "This booking has changed or is processing. Please refresh and try again.");
  });
}

function description(lead: { name: string; email: string; company: string | null; website: string | null; message: string | null }): string {
  return ["Discovery call booked via danielvlko.com", `Name: ${lead.name}`, `Email: ${lead.email}`,
    lead.company && `Company: ${lead.company}`, lead.website && `Website: ${lead.website}`, lead.message && `Context: ${lead.message}`].filter(Boolean).join("\n");
}

// A failed/ambiguous write keeps the slot and intent. Retry the SAME operation, never compensate blindly.
export async function recoverCalendarOperation(bookingId: string): Promise<boolean> {
  const db = getDb();
  const booking = await db.booking.findUnique({ where: { id: bookingId }, include: { lead: true } });
  if (!booking?.calendarOperation || !booking.calendarOperationKey) return booking?.status === "CONFIRMED" || booking?.status === "CANCELLED";
  const key = booking.calendarOperationKey;
  const lease = new Date(Date.now() + leaseMs);
  const where = { id: bookingId, calendarOperationKey: key, calendarLeaseUntil: lease };
  const claim = await db.booking.updateMany({ where: { id: bookingId, calendarOperationKey: key,
    OR: [{ calendarLeaseUntil: null }, { calendarLeaseUntil: { lt: new Date() } }],
  }, data: { calendarLeaseUntil: lease } });
  if (!claim.count) return false;
  try {
    const provider = getCalendarProvider();
    if (!provider) throw new Error("Calendar unavailable.");
    const externalEventId = booking.externalCalendarEventId ?? (booking.calendarOperation === "CREATE" ? stableCalendarId(booking.id) : null);
    if (!externalEventId) throw new Error("Calendar identity requires operator reconciliation.");
    let event: CalendarEventResult | undefined;
    if (booking.calendarOperation === "CREATE") {
      event = await provider.createEvent({ externalEventId, bookingId, title: `Discovery Call — ${booking.lead.name} × Daniel VLKO`,
        description: description(booking.lead), startsAt: booking.startsAt, endsAt: booking.endsAt, timezone: booking.timezone });
      if (event.externalEventId !== externalEventId) throw new Error("Unexpected calendar identity.");
    } else {
      const current = await provider.getEvent(externalEventId);
      if (booking.calendarOperation === "RESCHEDULE" && !current) throw new Error("Calendar event missing; operator reconciliation required.");
      let etag = booking.calendarOperationEtag;
      if (!etag && current) {
        if (!current.etag) throw new Error("Calendar version unavailable.");
        etag = current.etag;
        const saved = await db.booking.updateMany({ where: { ...where, calendarOperationEtag: null }, data: { calendarOperationEtag: etag } });
        if (!saved.count) return false; // An expired worker cannot obtain a newer provider version.
      }
      if (booking.calendarOperation === "CANCEL") {
        if (current) await provider.cancelEvent(externalEventId, etag ?? undefined);
      } else {
        if (current?.startsAt?.getTime() === booking.startsAt.getTime() && current.endsAt?.getTime() === booking.endsAt.getTime()) {
          event = current;
        } else {
          try {
            event = await provider.updateEvent({ externalEventId, etag: etag!, startsAt: booking.startsAt, endsAt: booking.endsAt, timezone: booking.timezone });
          } catch (error) {
            // A completed identical patch can lose its response. A changed unrelated version is never overwritten.
            if (googleStatus(error) !== 412) throw error;
            const check = await provider.getEvent(externalEventId);
            if (check?.startsAt?.getTime() !== booking.startsAt.getTime() || check.endsAt?.getTime() !== booking.endsAt.getTime()) throw error;
            event = check;
          }
        }
      }
    }
    const cancelled = booking.calendarOperation === "CANCEL";
    const completedAt = new Date();
    const notification = {
      key, kind: cancelled ? "cancelled" : booking.calendarOperation === "CREATE" ? "confirmed" : "rescheduled",
      createdAt: completedAt.toISOString(), bookingId, clientName: booking.lead.name, clientEmail: booking.lead.email,
      startsAt: booking.startsAt.toISOString(), endsAt: booking.endsAt.toISOString(), timezone: booking.timezone,
    };
    await db.$transaction(async tx => {
      await lockReservations(tx);
      const finalized = await tx.booking.updateMany({ where: { ...where, status: "PENDING" }, data: {
        status: cancelled ? "CANCELLED" : "CONFIRMED", activeSlotKey: cancelled ? null : booking.activeSlotKey,
        externalCalendarEventId: externalEventId, externalCalendarUrl: event?.htmlUrl ?? booking.externalCalendarUrl,
        meetingUrl: event?.meetingUrl ?? booking.meetingUrl, scheduleChangedAt: completedAt,
        calendarOperation: null, calendarOperationKey: key, calendarOperationEtag: null, calendarLeaseUntil: null, calendarError: null,
        notification, notificationSentAt: null, notificationFirstAttemptAt: null, notificationLeaseUntil: null,
        reminder24hEmailId: null, reminder30mEmailId: null,
      } });
      if (!finalized.count) throw new SecurityError(409, "Booking operation is already processing.");
      if (!cancelled) await tx.lead.update({ where: { id: booking.leadId }, data: { status: "BOOKED" } });
      else if (!["QUALIFIED", "WON", "LOST", "ARCHIVED"].includes(booking.lead.status)) {
        await tx.lead.update({ where: { id: booking.leadId }, data: { status: "BOOKING_STARTED" } });
      }
    });
    return true;
  } catch (error) {
    logSecurityFailure("booking_calendar_recovery", error);
    // Compare-and-set prevents an old worker from clearing a newer lease/operation.
    await db.booking.updateMany({ where, data: { calendarLeaseUntil: null, calendarError: safeErrorCode(error) } });
    return false;
  }
}

type Notification = { key: string; kind: "confirmed" | "rescheduled" | "cancelled"; createdAt: string; bookingId: string;
  clientName: string; clientEmail: string; startsAt: string; endsAt: string; timezone: string };

export async function deliverBookingNotification(bookingId: string, origin: string): Promise<boolean> {
  const db = getDb();
  const booking = await db.booking.findUnique({ where: { id: bookingId } });
  if (!booking?.notification || booking.calendarOperation) return false;
  if (booking.notificationSentAt) return true;
  const item = booking.notification as unknown as Notification;
  const now = new Date();
  // Resend deduplication is finite. Ambiguous sends beyond that window require operator review.
  if (booking.notificationFirstAttemptAt && +now - +booking.notificationFirstAttemptAt >= 23 * 3600000) {
    logSecurityFailure("booking_email_retry_window_expired"); return false;
  }
  const lease = new Date(+now + leaseMs);
  const identity = { id: bookingId, notification: { equals: booking.notification }, notificationSentAt: null };
  const claim = await db.booking.updateMany({ where: { ...identity, calendarOperation: null,
    OR: [{ notificationLeaseUntil: null }, { notificationLeaseUntil: { lt: now } }],
  }, data: { notificationLeaseUntil: lease, notificationFirstAttemptAt: booking.notificationFirstAttemptAt ?? now } });
  if (!claim.count) return false;
  try {
    const input = { ...item, startsAt: new Date(item.startsAt), endsAt: new Date(item.endsAt), createdAt: new Date(item.createdAt), idempotencyKey: `booking-notification/${item.key}` };
    if (item.kind === "cancelled") await sendBookingCancellationEmail(input);
    else {
      if (!booking.cancelTokenHash) throw new Error("Management capability unavailable.");
      const token = createBookingManageToken({ bookingId, tokenHash: booking.cancelTokenHash });
      await sendBookingConfirmationEmail({ ...input, mode: item.kind, manageUrl: buildBookingManageUrl({ bookingId, token, origin }) });
    }
    const saved = await db.booking.updateMany({ where: { ...identity, notificationLeaseUntil: lease }, data: { notificationSentAt: new Date(), notificationLeaseUntil: null } });
    if (!saved.count) return false;
    if (item.kind === "confirmed") await db.bookingAttempt.updateMany({ where: { bookingId }, data: { confirmationEmailSent: true } });
    return true;
  } catch (error) {
    logSecurityFailure("booking_email_recovery", error);
    await db.booking.updateMany({ where: { ...identity, notificationLeaseUntil: lease }, data: { notificationLeaseUntil: null } });
    return false;
  }
}

export async function processBookingRecovery(origin: string): Promise<{ calendarPending: number; emailPending: number }> {
  const db = getDb();
  const pending = await db.booking.findMany({ where: { calendarOperation: { not: null } }, orderBy: { updatedAt: "asc" }, take: 5 });
  let calendarPending = 0, emailPending = 0;
  for (const booking of pending) if (!await recoverCalendarOperation(booking.id)) calendarPending++;
  const emails = await db.booking.findMany({ where: { notification: { not: Prisma.DbNull }, notificationSentAt: null, calendarOperation: null, OR: [{ notificationFirstAttemptAt: null }, { notificationFirstAttemptAt: { gt: new Date(Date.now() - 23 * 3600000) } }] }, orderBy: { updatedAt: "asc" }, take: 10 });
  for (const booking of emails) if (!await deliverBookingNotification(booking.id, origin)) emailPending++;
  const exhausted = await db.booking.findFirst({ where: { notification: { not: Prisma.DbNull }, notificationSentAt: null,
    notificationFirstAttemptAt: { lte: new Date(Date.now() - 23 * 3600000) } }, select: { id: true } });
  if (exhausted) { emailPending++; logSecurityFailure("booking_email_requires_operator_review"); }
  const legacy = await db.booking.findFirst({ where: { status: "PENDING", calendarOperation: null }, select: { id: true } });
  if (legacy) { calendarPending++; logSecurityFailure("legacy_pending_booking_requires_reconciliation"); }
  return { calendarPending, emailPending };
}
