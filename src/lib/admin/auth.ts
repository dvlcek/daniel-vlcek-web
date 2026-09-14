import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

import {
  cookies,
} from "next/headers";

/* =========================================================
   CONFIG
========================================================= */

export const ADMIN_COOKIE_NAME =
  "dv_admin_session";

const SESSION_VERSION =
  "v1";

const SESSION_DURATION_SECONDS =
  60 * 60 * 24 * 7;

/* =========================================================
   HELPERS
========================================================= */

function secureEqual(
  left: string,
  right: string,
): boolean {
  const leftBuffer =
    Buffer.from(
      left,
      "utf8",
    );

  const rightBuffer =
    Buffer.from(
      right,
      "utf8",
    );

  if (
    leftBuffer.length !==
    rightBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    leftBuffer,
    rightBuffer,
  );
}

function getSessionSecret(): string {
  const secret =
    process.env
      .ADMIN_SESSION_SECRET
      ?.trim();

  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not configured.",
    );
  }

  if (
    secret.length <
    32
  ) {
    throw new Error(
      "ADMIN_SESSION_SECRET is too short.",
    );
  }

  return secret;
}

function signPayload(
  payload: string,
): string {
  return createHmac(
    "sha256",
    getSessionSecret(),
  )
    .update(
      payload,
      "utf8",
    )
    .digest(
      "base64url",
    );
}

/* =========================================================
   PASSWORD
========================================================= */

export function verifyAdminPassword(
  password: string,
): boolean {
  const expected =
    process.env
      .ADMIN_PASSWORD
      ?.trim();

  if (!expected) {
    throw new Error(
      "ADMIN_PASSWORD is not configured.",
    );
  }

  return secureEqual(
    password,
    expected,
  );
}

/* =========================================================
   SESSION TOKEN
========================================================= */

export function createAdminSessionToken(): string {
  const expiresAt =
    Math.floor(
      Date.now() /
        1000,
    ) +
    SESSION_DURATION_SECONDS;

  const payload =
    `${SESSION_VERSION}.${expiresAt}`;

  const signature =
    signPayload(
      payload,
    );

  return `${payload}.${signature}`;
}

export function verifyAdminSessionToken(
  token: string,
): boolean {
  const parts =
    token.split(
      ".",
    );

  if (
    parts.length !==
    3
  ) {
    return false;
  }

  const [
    version,
    expiresAtRaw,
    signature,
  ] =
    parts;

  if (
    version !==
    SESSION_VERSION
  ) {
    return false;
  }

  const expiresAt =
    Number(
      expiresAtRaw,
    );

  if (
    !Number.isFinite(
      expiresAt,
    )
  ) {
    return false;
  }

  const now =
    Math.floor(
      Date.now() /
        1000,
    );

  if (
    expiresAt <=
    now
  ) {
    return false;
  }

  const payload =
    `${version}.${expiresAt}`;

  const expectedSignature =
    signPayload(
      payload,
    );

  return secureEqual(
    signature,
    expectedSignature,
  );
}

/* =========================================================
   REQUEST AUTH
========================================================= */

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore =
    await cookies();

  const token =
    cookieStore
      .get(
        ADMIN_COOKIE_NAME,
      )
      ?.value;

  if (!token) {
    return false;
  }

  try {
    return verifyAdminSessionToken(
      token,
    );
  } catch {
    return false;
  }
}

/* =========================================================
   SESSION CONFIG
========================================================= */

export function getAdminSessionMaxAge(): number {
  return SESSION_DURATION_SECONDS;
}