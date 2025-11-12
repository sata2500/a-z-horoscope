-- AlterTable
ALTER TABLE "users" ADD COLUMN     "birth_latitude" DOUBLE PRECISION,
ADD COLUMN     "birth_longitude" DOUBLE PRECISION,
ADD COLUMN     "birth_place" TEXT,
ADD COLUMN     "birth_time" TEXT,
ADD COLUMN     "natal_chart_calculated_at" TIMESTAMP(3),
ADD COLUMN     "natal_chart_data" JSONB;
