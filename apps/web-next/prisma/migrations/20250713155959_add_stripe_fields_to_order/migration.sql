/*
  Warnings:

  - You are about to drop the column `name` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `comparePrice` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `costPrice` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `dimensions` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `lowStockThreshold` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `stockQuantity` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `customizations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_images` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `sku` on table `product_variants` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `product_variants` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `category` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "customizations" DROP CONSTRAINT "customizations_productId_fkey";

-- DropForeignKey
ALTER TABLE "product_images" DROP CONSTRAINT "product_images_productId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_categoryId_fkey";

-- DropIndex
DROP INDEX "products_sku_key";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "paymentStatus" TEXT,
ADD COLUMN     "stripeSessionId" TEXT;

-- AlterTable
ALTER TABLE "product_variants" DROP COLUMN "name",
DROP COLUMN "value",
ADD COLUMN     "material" TEXT,
ADD COLUMN     "size" TEXT,
ALTER COLUMN "sku" SET NOT NULL,
ALTER COLUMN "price" SET NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "categoryId",
DROP COLUMN "comparePrice",
DROP COLUMN "costPrice",
DROP COLUMN "dimensions",
DROP COLUMN "lowStockThreshold",
DROP COLUMN "sku",
DROP COLUMN "stockQuantity",
DROP COLUMN "weight",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "compareAtPrice" DECIMAL(10,2),
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "isOnSale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "salePercentage" INTEGER,
ADD COLUMN     "shortDescription" TEXT,
ADD COLUMN     "tags" TEXT[];

-- DropTable
DROP TABLE "customizations";

-- DropTable
DROP TABLE "product_images";

-- CreateTable
CREATE TABLE "product_customizations" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "options" TEXT[],
    "priceAdjustment" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_customizations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "product_customizations" ADD CONSTRAINT "product_customizations_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
