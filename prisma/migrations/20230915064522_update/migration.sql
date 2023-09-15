/*
  Warnings:

  - Made the column `data_retirada` on table `check_ins` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "check_ins" ALTER COLUMN "data_retirada" SET NOT NULL;
