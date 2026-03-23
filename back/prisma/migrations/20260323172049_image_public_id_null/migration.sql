-- AlterTable
ALTER TABLE "public"."produtos" ADD COLUMN     "imagePublicId" TEXT;

-- AlterTable
ALTER TABLE "public"."sabores" ADD COLUMN     "imagePublicId" TEXT;

-- AlterTable
ALTER TABLE "public"."tenant" ADD COLUMN     "bannerPublicId" TEXT,
ADD COLUMN     "logoPublicId" TEXT;
