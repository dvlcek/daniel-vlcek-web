import {
  createHash,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

/* =========================================================
   HASH
========================================================= */

export function hashBookingToken(
  token: string,
): string {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

/* =========================================================
   CREATE
========================================================= */

export function createBookingToken(): {
  token: string;
  tokenHash: string;
} {
  const token =
    randomBytes(32).toString(
      "base64url",
    );

  return {
    token,
    tokenHash:
      hashBookingToken(token),
  };
}

/* =========================================================
   VERIFY
========================================================= */

export function verifyBookingToken(
  token: string,
  expectedHash: string,
): boolean {
  const receivedHash =
    hashBookingToken(token);

  const receivedBuffer =
    Buffer.from(
      receivedHash,
      "hex",
    );

  const expectedBuffer =
    Buffer.from(
      expectedHash,
      "hex",
    );

  if (
    receivedBuffer.length !==
    expectedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    receivedBuffer,
    expectedBuffer,
  );
}