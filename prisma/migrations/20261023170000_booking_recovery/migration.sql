-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "calendarError" TEXT,
ADD COLUMN     "calendarLeaseUntil" TIMESTAMPTZ(3),
ADD COLUMN     "calendarOperation" TEXT,
ADD COLUMN     "calendarOperationEtag" TEXT,
ADD COLUMN     "calendarOperationKey" TEXT,
ADD COLUMN     "notification" JSONB,
ADD COLUMN     "notificationFirstAttemptAt" TIMESTAMPTZ(3),
ADD COLUMN     "notificationLeaseUntil" TIMESTAMPTZ(3),
ADD COLUMN     "notificationSentAt" TIMESTAMPTZ(3);
