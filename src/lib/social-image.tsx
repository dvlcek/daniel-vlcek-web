import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const socialImageSize = { width: 1200, height: 630 };
export const twitterImageSize = { width: 1200, height: 600 };

export async function createSocialImage(kind: "og" | "twitter") {
  const asset = kind === "og" ? "og-image.png" : "twitter-image.png";
  const bytes = await readFile(join(process.cwd(), "public", "brand", asset));
  return new Response(new Uint8Array(bytes), { headers: { "Content-Type": "image/png" } });
}
