import {
  PrismaPg,
} from "@prisma/adapter-pg";

import {
  PrismaClient,
} from "@/generated/prisma/client";

/* =========================================================
   GLOBAL PRISMA CACHE
========================================================= */

type PrismaGlobal = typeof globalThis & {
  __danielVlkoPrisma?: PrismaClient;
};

const globalForPrisma =
  globalThis as PrismaGlobal;

/* =========================================================
   CLIENT FACTORY
========================================================= */

function createPrismaClient(): PrismaClient {
  const connectionString =
    process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not configured.",
    );
  }

  const adapter =
    new PrismaPg({
      connectionString,
      connectionTimeoutMillis: 5000,
      statement_timeout: 10_000,
      max: 5,
      idleTimeoutMillis: 30_000,
    });

  return new PrismaClient({
    adapter,
  });
}

/* =========================================================
   PUBLIC DATABASE ACCESS
========================================================= */

/**
 * Lazy database access.
 *
 * Important:
 * importing this file does NOT require DATABASE_URL.
 *
 * This means the public website can still render even if
 * the booking database is temporarily unavailable or not
 * configured.
 */
export function getDb(): PrismaClient {
  if (
    globalForPrisma.__danielVlkoPrisma
  ) {
    return globalForPrisma
      .__danielVlkoPrisma;
  }

  const client =
    createPrismaClient();

  // Rate guards and handlers must share one bounded pool in each runtime,
  // including production. Durable limiter state still lives in PostgreSQL.
  globalForPrisma.__danielVlkoPrisma = client;

  return client;
}
