import { defineConfig } from "prisma/config";

// Deliberately does NOT load .env.local or fall back to application credentials.
const value = process.env.A2_TEST_DATABASE_URL;
if (!value) throw new Error("Disposable acceptance database is required.");
const url = new URL(value);
if (url.hostname !== "127.0.0.1" || url.username !== "dv_a2_test" || url.pathname !== "/dv_a2_acceptance_test") {
  throw new Error("Refusing non-disposable acceptance database.");
}
export default defineConfig({
  schema: "../prisma/schema.prisma",
  migrations: { path: process.env.A2_TEST_MIGRATIONS ?? "../prisma/migrations" },
  datasource: { url: value },
});
