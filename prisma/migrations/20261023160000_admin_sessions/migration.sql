-- Additive: no existing customer or booking tables are changed.
CREATE TABLE "AdminSession" (
    "tokenHash" TEXT NOT NULL,
    "credentialVersion" TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "revokedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("tokenHash")
);
CREATE INDEX "AdminSession_expiresAt_idx" ON "AdminSession"("expiresAt");
