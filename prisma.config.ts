import { config } from "dotenv";
import { defineConfig } from "prisma/config";

/* =========================================================
   ENVIRONMENT
========================================================= */

config({
  path: ".env.local",
});

config();

/* =========================================================
   DATABASE
========================================================= */

/*
 * Prisma CLI / migrations should prefer a DIRECT database
 * connection.
 *
 * The Next.js application itself continues to use
 * DATABASE_URL through src/lib/db.ts, so runtime traffic
 * can keep using Neon's pooled connection.
 */
const databaseUrl =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DIRECT_URL or DATABASE_URL must be configured.",
  );
}

/* =========================================================
   PRISMA CONFIG
========================================================= */

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: databaseUrl,
  },
});