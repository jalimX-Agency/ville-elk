-- AlterTable
ALTER TABLE "Suite" ADD COLUMN     "featuresAr" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "featuresEn" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "featuresEs" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "featuresFr" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "GalleryImage" ADD COLUMN     "suiteId" TEXT;

-- CreateIndex
CREATE INDEX "GalleryImage_suiteId_position_idx" ON "GalleryImage"("suiteId", "position");

-- AddForeignKey
ALTER TABLE "GalleryImage" ADD CONSTRAINT "GalleryImage_suiteId_fkey" FOREIGN KEY ("suiteId") REFERENCES "Suite"("id") ON DELETE SET NULL ON UPDATE CASCADE;

