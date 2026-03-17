/*
  Warnings:

  - A unique constraint covering the columns `[nomeEstabelecimento]` on the table `tenant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."tenant" ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "nomeEstabelecimento" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "tenant_nomeEstabelecimento_key" ON "public"."tenant"("nomeEstabelecimento");
