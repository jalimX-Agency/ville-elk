-- CreateTable
CREATE TABLE "Suite" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "level" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameEs" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "descriptionFr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionEs" TEXT NOT NULL,
    "descriptionAr" TEXT NOT NULL,
    "areaSqm" INTEGER,
    "imageUrl" TEXT,
    "altFr" TEXT,
    "altEn" TEXT,
    "altEs" TEXT,
    "altAr" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Suite_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "imageUrl" TEXT NOT NULL,
    "altFr" TEXT NOT NULL,
    "altEn" TEXT NOT NULL,
    "altEs" TEXT NOT NULL,
    "altAr" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "Suite_slug_key" ON "Suite"("slug");
-- CreateIndex
CREATE INDEX "Suite_position_idx" ON "Suite"("position");
-- CreateIndex
CREATE INDEX "GalleryImage_position_idx" ON "GalleryImage"("position");
