-- Step 1: Заполняем NULL в products.stock_quantity перед тем как сделать колонку NOT NULL
UPDATE "products" SET "stock_quantity" = 0 WHERE "stock_quantity" IS NULL;
ALTER TABLE "products" ALTER COLUMN "stock_quantity" SET DEFAULT 0;
ALTER TABLE "products" ALTER COLUMN "stock_quantity" SET NOT NULL;

-- Step 2: Новые поля в orders
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "confirmed_at" TIMESTAMP(3);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "paid_at" TIMESTAMP(3);

-- Step 3: Замена enum order_status (PENDING_CONFIRMATION, CONFIRMED, PAID, CANCELLED)
CREATE TYPE "order_status_new" AS ENUM ('PENDING_CONFIRMATION', 'CONFIRMED', 'PAID', 'CANCELLED');
ALTER TABLE "orders" ADD COLUMN "status_new" "order_status_new" NOT NULL DEFAULT 'PENDING_CONFIRMATION';

UPDATE "orders" SET "status_new" = CASE "status"::text
  WHEN 'PENDING' THEN 'PENDING_CONFIRMATION'::"order_status_new"
  WHEN 'PAID' THEN 'PAID'::"order_status_new"
  WHEN 'SHIPPED' THEN 'CONFIRMED'::"order_status_new"
  WHEN 'COMPLETED' THEN 'CONFIRMED'::"order_status_new"
  WHEN 'OFFLINE' THEN 'CONFIRMED'::"order_status_new"
  ELSE 'PENDING_CONFIRMATION'::"order_status_new"
END;

ALTER TABLE "orders" DROP COLUMN "status";
ALTER TABLE "orders" RENAME COLUMN "status_new" TO "status";
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'PENDING_CONFIRMATION';

DROP TYPE "order_status";
ALTER TYPE "order_status_new" RENAME TO "order_status";
