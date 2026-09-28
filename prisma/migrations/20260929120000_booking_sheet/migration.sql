-- AlterTable
ALTER TABLE "Enquiry" ADD COLUMN     "checkInTime" TEXT NOT NULL DEFAULT '15:00',
ADD COLUMN     "checkOutTime" TEXT NOT NULL DEFAULT '11:00',
ADD COLUMN     "depositDh" INTEGER,
ADD COLUMN     "ficheLocale" TEXT,
ADD COLUMN     "ficheNote" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ficheSentAt" TIMESTAMP(3),
ADD COLUMN     "ficheToken" TEXT,
ADD COLUMN     "priceDh" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Enquiry_ficheToken_key" ON "Enquiry"("ficheToken");

