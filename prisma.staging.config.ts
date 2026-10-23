import { defineConfig } from "prisma/config";

// Dedicated opt-in staging CLI configuration. Never loads dotenv or falls back
// to application DATABASE_URL/DIRECT_URL. The owner must first verify in Neon
// that this endpoint belongs to an empty/synthetic, non-production project.
if (process.env.A61_STAGING_ISOLATION_CONFIRMED !== "yes") {
  throw new Error("Explicit staging isolation confirmation is required.");
}

const value = process.env.A61_STAGING_DIRECT_URL;
const expectedHost = process.env.A61_STAGING_DIRECT_HOST;
if (!value || !expectedHost) {
  throw new Error("Dedicated staging URL and verified endpoint host are required.");
}

const target = (() => {
  try { return new URL(value); }
  catch { throw new Error("Invalid staging connection URL; value withheld."); }
})();
if (
  !["postgres:", "postgresql:"].includes(target.protocol) ||
  target.hostname !== expectedHost ||
  !target.hostname.endsWith(".neon.tech") ||
  target.hostname.includes("-pooler") ||
  !target.password ||
  decodeURIComponent(target.username) !== "dv_rc1_staging_owner" ||
  target.pathname !== "/dv_rc1_staging" ||
  !["require", "verify-full"].includes(target.searchParams.get("sslmode") ?? "")
) {
  throw new Error("Refusing a target outside the verified direct staging endpoint/database/role with TLS.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: value },
});
