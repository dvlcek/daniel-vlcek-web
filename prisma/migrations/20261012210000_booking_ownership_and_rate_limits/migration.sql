CREATE TABLE "BookingAttempt" (
  "id" UUID NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "bookingId" TEXT,
  "confirmationEmailSent" BOOLEAN NOT NULL DEFAULT false,
  "expiresAt" TIMESTAMPTZ(3) NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BookingAttempt_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "BookingAttempt_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "BookingAttempt_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "BookingAttempt_tokenHash_key" ON "BookingAttempt"("tokenHash");
CREATE UNIQUE INDEX "BookingAttempt_leadId_key" ON "BookingAttempt"("leadId");
CREATE INDEX "BookingAttempt_expiresAt_idx" ON "BookingAttempt"("expiresAt");
CREATE TABLE "SecurityRateLimit" (
  "key" TEXT NOT NULL,
  "hits" INTEGER NOT NULL,
  "expiresAt" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "SecurityRateLimit_pkey" PRIMARY KEY ("key")
);
CREATE INDEX "SecurityRateLimit_expiresAt_idx" ON "SecurityRateLimit"("expiresAt");
