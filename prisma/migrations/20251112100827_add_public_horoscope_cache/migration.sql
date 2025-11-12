-- CreateTable
CREATE TABLE "public_horoscope_cache" (
    "id" TEXT NOT NULL,
    "zodiac_sign" TEXT NOT NULL,
    "reading_type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "public_horoscope_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "public_horoscope_cache_zodiac_sign_reading_type_date_idx" ON "public_horoscope_cache"("zodiac_sign", "reading_type", "date");

-- CreateIndex
CREATE INDEX "public_horoscope_cache_expires_at_idx" ON "public_horoscope_cache"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "public_horoscope_cache_zodiac_sign_reading_type_date_key" ON "public_horoscope_cache"("zodiac_sign", "reading_type", "date");
