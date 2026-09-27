-- AlterTable
ALTER TABLE "GalleryImage" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'rdc';

-- CreateIndex
CREATE INDEX "GalleryImage_category_position_idx" ON "GalleryImage"("category", "position");

