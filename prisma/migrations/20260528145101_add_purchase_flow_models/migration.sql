-- CreateEnum
CREATE TYPE "personalization_symbol" AS ENUM ('NONE', 'ORTHODOX_CROSS', 'CATHOLIC_CROSS', 'CRESCENT', 'STAR_OF_DAVID', 'OTHER');

-- CreateEnum
CREATE TYPE "service_unit" AS ENUM ('PER_ITEM', 'PER_ORDER', 'PER_SQM', 'PER_METER');

-- CreateEnum
CREATE TYPE "service_category" AS ENUM ('DELIVERY', 'INSTALLATION', 'LANDSCAPING', 'DEMOLITION', 'ENGRAVING', 'OTHER');

-- CreateEnum
CREATE TYPE "contact_method" AS ENUM ('PHONE', 'EMAIL', 'WHATSAPP', 'TELEGRAM', 'VIBER');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "contact_email" TEXT,
ADD COLUMN     "contact_first_name" TEXT,
ADD COLUMN     "contact_last_name" TEXT,
ADD COLUMN     "contact_patronymic" TEXT,
ADD COLUMN     "contact_phone" TEXT,
ADD COLUMN     "customer_comment" TEXT,
ADD COLUMN     "order_number" TEXT,
ADD COLUMN     "preferred_contact" "contact_method",
ALTER COLUMN "payment_method" SET DEFAULT 'OFFLINE';

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "requires_personalization" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "order_item_personalizations" (
    "id" SERIAL NOT NULL,
    "order_item_id" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "patronymic" TEXT,
    "birth_date" DATE,
    "death_date" DATE,
    "portrait_photo" TEXT,
    "epitaph" TEXT,
    "symbol" "personalization_symbol" NOT NULL DEFAULT 'NONE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_item_personalizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "additional_services" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "unit" "service_unit" NOT NULL DEFAULT 'PER_ITEM',
    "category" "service_category" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "additional_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_additional_services" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "price_at_purchase" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "order_additional_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_deliveries" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "cemetery_name" TEXT,
    "cemetery_address" TEXT NOT NULL,
    "city" TEXT,
    "region" TEXT,
    "contact_phone" TEXT NOT NULL,
    "preferred_date" DATE,
    "comment" TEXT,

    CONSTRAINT "order_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "order_item_personalizations_order_item_id_key" ON "order_item_personalizations"("order_item_id");

-- CreateIndex
CREATE INDEX "additional_services_is_active_category_idx" ON "additional_services"("is_active", "category");

-- CreateIndex
CREATE INDEX "order_additional_services_order_id_idx" ON "order_additional_services"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_deliveries_order_id_key" ON "order_deliveries"("order_id");

-- CreateIndex
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_order_date_idx" ON "orders"("order_date");

-- CreateIndex
CREATE INDEX "products_is_active_stock_quantity_idx" ON "products"("is_active", "stock_quantity");

-- AddForeignKey
ALTER TABLE "order_item_personalizations" ADD CONSTRAINT "order_item_personalizations_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_additional_services" ADD CONSTRAINT "order_additional_services_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_additional_services" ADD CONSTRAINT "order_additional_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "additional_services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_deliveries" ADD CONSTRAINT "order_deliveries_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
