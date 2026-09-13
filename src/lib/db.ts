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

  if (
    process.env.NODE_ENV !==
    "production"
  ) {
    globalForPrisma.__danielVlkoPrisma =
      client;
  }

  return client;
}