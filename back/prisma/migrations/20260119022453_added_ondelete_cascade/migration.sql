-- DropForeignKey
ALTER TABLE "public"."adicionais" DROP CONSTRAINT "adicionais_itens_dos_pedidos_fkey";

-- DropForeignKey
ALTER TABLE "public"."codigos_ativacao" DROP CONSTRAINT "fk_codigos_tenant";

-- DropForeignKey
ALTER TABLE "public"."entregadores" DROP CONSTRAINT "fk_entregadores_tenant";

-- DropForeignKey
ALTER TABLE "public"."itens_dos_pedidos" DROP CONSTRAINT "itens_dos_pedidos_produtoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."pedidos" DROP CONSTRAINT "pedidos_tenantSlug_fkey";

-- DropForeignKey
ALTER TABLE "public"."produtos" DROP CONSTRAINT "produtos_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."sabores" DROP CONSTRAINT "sabores_produtoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."sabores" DROP CONSTRAINT "sabores_tenantId_fkey";

-- AddForeignKey
ALTER TABLE "public"."entregadores" ADD CONSTRAINT "fk_entregadores_tenant" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."codigos_ativacao" ADD CONSTRAINT "fk_codigos_tenant" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."produtos" ADD CONSTRAINT "produtos_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sabores" ADD CONSTRAINT "sabores_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "public"."produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sabores" ADD CONSTRAINT "sabores_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itens_dos_pedidos" ADD CONSTRAINT "itens_dos_pedidos_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "public"."produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."adicionais" ADD CONSTRAINT "adicionais_itens_dos_pedidos_fkey" FOREIGN KEY ("itens_dos_pedidos") REFERENCES "public"."itens_dos_pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pedidos" ADD CONSTRAINT "pedidos_tenantSlug_fkey" FOREIGN KEY ("tenantSlug") REFERENCES "public"."tenant"("tenantSlug") ON DELETE CASCADE ON UPDATE CASCADE;
