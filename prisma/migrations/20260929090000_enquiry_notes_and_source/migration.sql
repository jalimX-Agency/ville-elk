-- AlterTable
ALTER TABLE "Enquiry" ADD COLUMN     "notes" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'site',
ADD COLUMN     "statusChangedAt" TIMESTAMP(3);
