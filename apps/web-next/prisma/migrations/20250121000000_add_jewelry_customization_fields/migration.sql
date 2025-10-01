-- AlterTable
ALTER TABLE "product_customizations" ADD COLUMN     "minValue" INTEGER,
ADD COLUMN     "maxValue" INTEGER,
ADD COLUMN     "maxLength" INTEGER,
ADD COLUMN     "pattern" TEXT,
ADD COLUMN     "helpText" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "isEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;
