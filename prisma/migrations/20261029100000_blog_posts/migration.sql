-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "titleFr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleEs" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "excerptFr" TEXT NOT NULL DEFAULT '',
    "excerptEn" TEXT NOT NULL DEFAULT '',
    "excerptEs" TEXT NOT NULL DEFAULT '',
    "excerptAr" TEXT NOT NULL DEFAULT '',
    "bodyFr" TEXT NOT NULL DEFAULT '',
    "bodyEn" TEXT NOT NULL DEFAULT '',
    "bodyEs" TEXT NOT NULL DEFAULT '',
    "bodyAr" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT,
    "altFr" TEXT NOT NULL DEFAULT '',
    "altEn" TEXT NOT NULL DEFAULT '',
    "altEs" TEXT NOT NULL DEFAULT '',
    "altAr" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

