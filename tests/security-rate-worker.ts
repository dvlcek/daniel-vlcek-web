import { consumeLimit } from "@/lib/security/rate-limit";
import { getDb } from "@/lib/db";
import { SecurityError } from "@/lib/security/http";

async function main() {
  const value = process.env.A2_TEST_DATABASE_URL;
  if (!value || value !== process.env.DATABASE_URL) throw new Error("Refusing unknown database.");
  const url = new URL(value);
  if (url.hostname !== "127.0.0.1" || url.username !== "dv_a2_test" || url.pathname !== "/dv_a2_acceptance_test") throw new Error("Refusing unsafe database.");
  let allowed = 0, limited = 0;
  try {
    const rows = await getDb().$queryRaw<{ db: string; role: string; nonce: string }[]>`
      SELECT current_database() AS db, current_user AS role, (SELECT nonce::text FROM "_A2AcceptanceGuard") AS nonce
    `;
    if (!process.env.A2_TEST_RUN_NONCE || rows[0]?.db !== "dv_a2_acceptance_test" || rows[0]?.role !== "dv_a2_test" || rows[0]?.nonce !== process.env.A2_TEST_RUN_NONCE) {
      throw new Error("Refusing unverified worker database.");
    }
    const results = await Promise.allSettled(Array.from({ length: 10 }, () => consumeLimit("acceptance-process-race", "fixture", 7, 60)));
    for (const result of results) {
      if (result.status === "fulfilled") allowed++;
      else if (result.reason instanceof SecurityError && result.reason.status === 429) limited++;
      else throw new Error("Unexpected limiter failure.");
    }
    console.log(JSON.stringify({ allowed, limited }));
  } finally { await getDb().$disconnect(); }
}
main().catch(() => { console.error("Isolated rate worker failed."); process.exitCode = 1; });
