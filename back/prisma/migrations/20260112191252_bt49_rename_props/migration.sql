/*
  Warnings:

  - You are about to drop the column `actual_installment` on the `expenses` table. All the data in the column will be lost.
  - Added the required column `current_installment` to the `expenses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "expenses" DROP COLUMN "actual_installment",
ADD COLUMN     "current_installment" INTEGER NOT NULL;
