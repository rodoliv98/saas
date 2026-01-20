/*
  Warnings:

  - Made the column `trial` on table `tenant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."tenant" ALTER COLUMN "trial" SET NOT NULL;
