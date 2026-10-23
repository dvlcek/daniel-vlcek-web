import { NextRequest } from "next/server";
import { z } from "zod";
import { DateTime } from "luxon";
import { BookingStatus, LeadStatus } from "@/generated/prisma/enums";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "./auth";
import { readBody, readJson, requireSameOrigin, SecurityError } from "@/lib/security/http";
import { limitRequest } from "@/lib/security/rate-limit";

const id = z.string().trim().min(1).max(128).regex(/^[a-zA-Z0-9_-]+$/);
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const optionalTime = z.union([time, z.literal("")]).optional();
const rule = z.object({
  action: z.enum(["save", "delete"]).default("save"), ruleId: z.union([id, z.literal("")]).optional(),
  weekday: z.string().regex(/^[0-6]$/).optional(), start: optionalTime, end: optionalTime,
  enabled: z.enum(["on", ""]).optional(),
}).strict().refine(v => v.action === "delete" ? !!v.ruleId : !!v.weekday && !!v.start && !!v.end && v.end > v.start);
const schemas = {
  lead: z.object({ leadId: id, status: z.enum(LeadStatus) }).strict(),
  booking: z.object({ bookingId: id, status: z.enum([BookingStatus.CONFIRMED, BookingStatus.COMPLETED, BookingStatus.NO_SHOW]) }).strict(),
  rule,
  override: z.object({
    dateKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => DateTime.fromISO(value).isValid), type: z.enum(["BLOCK", "AVAILABLE"]),
    wholeDay: z.enum(["on", ""]).optional(), start: optionalTime, end: optionalTime,
    note: z.string().trim().max(300).optional(),
  }).strict().refine(v => v.wholeDay === "on" || !!v.start && !!v.end && v.end > v.start),
  deleteOverride: z.object({ overrideId: id }).strict(),
};

export async function requireAdminMutation(request: NextRequest): Promise<void> {
  requireSameOrigin(request);
  if (!await verifyAdminSessionToken(request.cookies.get(ADMIN_COOKIE_NAME)?.value ?? "")) {
    throw new SecurityError(401, "Unauthorized.");
  }
  await limitRequest(request, "admin");
}

export async function readAdminForm(request: NextRequest, kind: keyof typeof schemas): Promise<FormData> {
  await requireAdminMutation(request);
  const contentType = request.headers.get("content-type") ?? "";
  let input: Record<string, unknown>;
  if (contentType.split(";")[0].trim() === "application/json") {
    input = await readJson(request, 8192);
  } else {
    if (!contentType.startsWith("application/x-www-form-urlencoded") && !contentType.startsWith("multipart/form-data;")) {
      throw new SecurityError(415, "Invalid request.");
    }
    const body = await readBody(request, 8192);
    let form: FormData;
    try { form = await new Request(request.url, { method: "POST", headers: { "content-type": contentType }, body }).formData(); }
    catch { throw new SecurityError(400, "Invalid request."); }
    input = {};
    for (const [key, value] of form.entries()) {
      if (Object.hasOwn(input, key) || typeof value !== "string") throw new SecurityError(400, "Invalid request.");
      Object.defineProperty(input, key, { value, enumerable: true });
    }
  }
  const parsed = schemas[kind].safeParse(input);
  if (!parsed.success) throw new SecurityError(400, "Invalid request.");
  const form = new FormData();
  for (const [key, value] of Object.entries(parsed.data)) if (value !== undefined) form.set(key, value);
  return form;
}
