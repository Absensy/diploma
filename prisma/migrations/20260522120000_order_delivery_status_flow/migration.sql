-- Step 1: Новые поля времени переходов в orders
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "in_production_at" TIMESTAMP(3);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "in_delivery_at"   TIMESTAMP(3);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "completed_at"     TIMESTAMP(3);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "cancelled_at"     TIMESTAMP(3);

-- Step 2: Пересоздание enum order_status под новый поток статусов:
-- NEW -> PAID -> IN_PRODUCTION -> IN_DELIVERY -> COMPLETED (+ CANCELLED)
CREATE TYPE "order_status_new" AS ENUM (
  'NEW',
  'PAID',
  'IN_PRODUCTION',
  'IN_DELIVERY',
  'COMPLETED',
  'CANCELLED'
);

ALTER TABLE "orders" ADD COLUMN "status_new" "order_status_new" NOT NULL DEFAULT 'NEW';

UPDATE "orders" SET "status_new" = CASE "status"::text
  WHEN 'PENDING_CONFIRMATION' THEN 'NEW'::"order_status_new"
  WHEN 'CONFIRMED'            THEN 'NEW'::"order_status_new"
  WHEN 'PAID'                 THEN 'PAID'::"order_status_new"
  WHEN 'CANCELLED'            THEN 'CANCELLED'::"order_status_new"
  ELSE 'NEW'::"order_status_new"
END;

ALTER TABLE "orders" DROP COLUMN "status";
ALTER TABLE "orders" RENAME COLUMN "status_new" TO "status";
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'NEW';

DROP TYPE "order_status";
ALTER TYPE "order_status_new" RENAME TO "order_status";

-- Step 3: Backfill дат для уже существующих оплаченных заказов
-- (если поле paid_at пустое, проставим order_date, чтобы трекер не отображался "пустым")
UPDATE "orders"
SET "paid_at" = COALESCE("paid_at", "order_date")
WHERE "status" = 'PAID';
