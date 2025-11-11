-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_notifications" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notification_preferences" JSONB DEFAULT '{"daily": true, "weekly": false, "monthly": false}';
