-- CreateTable
CREATE TABLE "favorite_readings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "reading_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_readings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "favorite_readings_user_id_idx" ON "favorite_readings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_readings_user_id_reading_id_key" ON "favorite_readings"("user_id", "reading_id");

-- AddForeignKey
ALTER TABLE "favorite_readings" ADD CONSTRAINT "favorite_readings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_readings" ADD CONSTRAINT "favorite_readings_reading_id_fkey" FOREIGN KEY ("reading_id") REFERENCES "horoscope_readings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
