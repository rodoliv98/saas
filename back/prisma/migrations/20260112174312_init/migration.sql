-- CreateEnum
CREATE TYPE "public"."PedidosStatus" AS ENUM ('pendente', 'preparando', 'pronto', 'entregando', 'concluido', 'cancelado');

-- CreateEnum
CREATE TYPE "public"."assinaturas_status" AS ENUM ('active', 'expired', 'cancelled');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tenant" (
    "id" TEXT NOT NULL,
    "nomeFantasia" TEXT,
    "razaoSocial" TEXT NOT NULL,
    "CNPJ" TEXT NOT NULL,
    "inscricaoEstadual" TEXT,
    "nomeRepresentante" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "CEP" TEXT NOT NULL,
    "tenantSlug" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "diasFuncionamento" TEXT NOT NULL,
    "horarioFuncionamento" TEXT NOT NULL,
    "tempoPreparo" TEXT NOT NULL,
    "taxaEntrega" DECIMAL(10,2) NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "isOpen" BOOLEAN NOT NULL DEFAULT false,
    "pin" VARCHAR(6),
    "trial" TIMESTAMP(6),

    CONSTRAINT "tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."entregadores" (
    "id" VARCHAR(30) NOT NULL,
    "tenant_id" VARCHAR(50) NOT NULL,
    "chat_id" BIGINT NOT NULL,
    "codigo_ativ_usado" VARCHAR(50) NOT NULL,
    "nome_telegram" VARCHAR(100) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "cadastrado_em" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "entregadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."codigos_ativacao" (
    "id" VARCHAR(30) NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "tenant_id" VARCHAR(50) NOT NULL,
    "utilizado" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usado_em" TIMESTAMP(6),
    "expire_date" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "codigos_ativacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."produtos" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "nomeProduto" TEXT NOT NULL,
    "descProduto" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "precoProduto" DECIMAL(10,2) NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sabores" (
    "id" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "nomeProduto" TEXT NOT NULL,
    "descProduto" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "precoProduto" DECIMAL(10,2) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "sabores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."itens_dos_pedidos" (
    "id" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "pedidosId" TEXT NOT NULL,
    "nomeProduto" TEXT NOT NULL,
    "descProduto" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "precoProduto" DECIMAL(10,2) NOT NULL,
    "subTotal" DECIMAL(10,2) NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "itens_dos_pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."adicionais" (
    "id" TEXT NOT NULL,
    "itens_dos_pedidos" TEXT NOT NULL,
    "nomeProduto" TEXT NOT NULL,
    "descProduto" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "precoProduto" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "adicionais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pedidos" (
    "id" TEXT NOT NULL,
    "tenantSlug" TEXT NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "whatsapp" TEXT NOT NULL,
    "formaPagamento" TEXT NOT NULL,
    "tipoEntrega" TEXT NOT NULL,
    "taxaEntrega" DECIMAL(10,2) NOT NULL,
    "totalOrderPrice" DECIMAL(10,2) NOT NULL,
    "observacao" TEXT,
    "status" "public"."PedidosStatus" NOT NULL DEFAULT 'pendente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "pin" VARCHAR(6),
    "short_id" VARCHAR(20),
    "finished" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pagamentos" (
    "id" SERIAL NOT NULL,
    "tenantId" VARCHAR(255) NOT NULL,
    "externalId" VARCHAR(255) NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "method" VARCHAR(50) NOT NULL DEFAULT 'pix',
    "brCode" TEXT NOT NULL,
    "proof" VARCHAR(255),
    "description" VARCHAR(255) NOT NULL,
    "platformFee" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pagamentos_logs" (
    "id" SERIAL NOT NULL,
    "chargeId" INTEGER NOT NULL,
    "tenantId" VARCHAR(255) NOT NULL,
    "eventType" VARCHAR(50) NOT NULL,
    "details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagamentos_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."assinaturas" (
    "id" SERIAL NOT NULL,
    "tenantId" VARCHAR(255) NOT NULL,
    "chargeId" INTEGER NOT NULL,
    "planType" VARCHAR(50) NOT NULL,
    "startDate" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(6) NOT NULL,
    "status" "public"."assinaturas_status" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assinaturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."planos" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "price" JSONB NOT NULL,
    "features" JSONB NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "planos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenant_CNPJ_key" ON "public"."tenant"("CNPJ");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_CPF_key" ON "public"."tenant"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_email_key" ON "public"."tenant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_tenantSlug_key" ON "public"."tenant"("tenantSlug");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_pin_key" ON "public"."tenant"("pin");

-- CreateIndex
CREATE UNIQUE INDEX "entregadores_chat_id_key" ON "public"."entregadores"("chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "entregadores_codigo_ativ_usado_key" ON "public"."entregadores"("codigo_ativ_usado");

-- CreateIndex
CREATE INDEX "idx_entregadores_chat_id" ON "public"."entregadores"("chat_id");

-- CreateIndex
CREATE INDEX "idx_entregadores_tenant" ON "public"."entregadores"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "codigos_ativacao_codigo_key" ON "public"."codigos_ativacao"("codigo");

-- CreateIndex
CREATE INDEX "idx_codigos_" ON "public"."codigos_ativacao"("expire_date");

-- CreateIndex
CREATE INDEX "idx_codigos_tenant" ON "public"."codigos_ativacao"("tenant_id");

-- CreateIndex
CREATE INDEX "idx_codigos_utilizado" ON "public"."codigos_ativacao"("tenant_id", "utilizado");

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_short_id_key" ON "public"."pedidos"("short_id");

-- CreateIndex
CREATE UNIQUE INDEX "pagamentos_externalId_key" ON "public"."pagamentos"("externalId");

-- CreateIndex
CREATE INDEX "idx_pagamentos_tenant_created_at" ON "public"."pagamentos"("createdAt");

-- CreateIndex
CREATE INDEX "idx_pagamentos_tenant_status" ON "public"."pagamentos"("tenantId", "status");

-- CreateIndex
CREATE INDEX "idx_pagamentos_logs_charge_id" ON "public"."pagamentos_logs"("chargeId");

-- CreateIndex
CREATE INDEX "idx_pagamentos_logs_tenant_id" ON "public"."pagamentos_logs"("tenantId");

-- CreateIndex
CREATE INDEX "idx_assinaturas_charge_id" ON "public"."assinaturas"("chargeId");

-- CreateIndex
CREATE INDEX "idx_assinaturas_plan_type" ON "public"."assinaturas"("planType");

-- CreateIndex
CREATE INDEX "idx_assinaturas_status" ON "public"."assinaturas"("status");

-- CreateIndex
CREATE INDEX "idx_assinaturas_tenant_id" ON "public"."assinaturas"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "planos_name_key" ON "public"."planos"("name");

-- AddForeignKey
ALTER TABLE "public"."entregadores" ADD CONSTRAINT "fk_entregadores_codigo" FOREIGN KEY ("codigo_ativ_usado") REFERENCES "public"."codigos_ativacao"("codigo") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."entregadores" ADD CONSTRAINT "fk_entregadores_tenant" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."codigos_ativacao" ADD CONSTRAINT "fk_codigos_tenant" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."produtos" ADD CONSTRAINT "produtos_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sabores" ADD CONSTRAINT "sabores_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "public"."produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sabores" ADD CONSTRAINT "sabores_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itens_dos_pedidos" ADD CONSTRAINT "itens_dos_pedidos_pedidosId_fkey" FOREIGN KEY ("pedidosId") REFERENCES "public"."pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itens_dos_pedidos" ADD CONSTRAINT "itens_dos_pedidos_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "public"."produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."adicionais" ADD CONSTRAINT "adicionais_itens_dos_pedidos_fkey" FOREIGN KEY ("itens_dos_pedidos") REFERENCES "public"."itens_dos_pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pedidos" ADD CONSTRAINT "pedidos_tenantSlug_fkey" FOREIGN KEY ("tenantSlug") REFERENCES "public"."tenant"("tenantSlug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pedidos" ADD CONSTRAINT "pedidos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pagamentos" ADD CONSTRAINT "fk_pagamentos_tenant" FOREIGN KEY ("tenantId") REFERENCES "public"."tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."pagamentos_logs" ADD CONSTRAINT "fk_pagamentos_logs_cobrancas" FOREIGN KEY ("chargeId") REFERENCES "public"."pagamentos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."pagamentos_logs" ADD CONSTRAINT "fk_pagamentos_logs_tenant" FOREIGN KEY ("tenantId") REFERENCES "public"."tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."assinaturas" ADD CONSTRAINT "fk_assinaturas_charge_id" FOREIGN KEY ("chargeId") REFERENCES "public"."pagamentos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."assinaturas" ADD CONSTRAINT "fk_assinaturas_tenant_id" FOREIGN KEY ("tenantId") REFERENCES "public"."tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
