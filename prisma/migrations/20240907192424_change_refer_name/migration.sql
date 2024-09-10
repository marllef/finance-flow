/*
  Warnings:

  - You are about to drop the column `referUniqueId` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "referUniqueId",
ADD COLUMN     "refer" TEXT;
