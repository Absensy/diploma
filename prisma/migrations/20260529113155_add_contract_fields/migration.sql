-- AlterTable
ALTER TABLE "contact_info" ADD COLUMN     "bank_account" TEXT,
ADD COLUMN     "bank_name" TEXT,
ADD COLUMN     "bik" TEXT,
ADD COLUMN     "company_name" TEXT,
ADD COLUMN     "director_basis" TEXT,
ADD COLUMN     "director_name" TEXT,
ADD COLUMN     "legal_address" TEXT,
ADD COLUMN     "legal_form" TEXT,
ADD COLUMN     "unp" TEXT;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "contact_address" TEXT,
ADD COLUMN     "passport_issued_at" DATE,
ADD COLUMN     "passport_issued_by" TEXT,
ADD COLUMN     "passport_number" TEXT,
ADD COLUMN     "passport_series" TEXT,
ADD COLUMN     "personal_number" TEXT;
