-- This is an empty migration.
BEGIN;

DROP INDEX IF EXISTS one_active_order_per_user;

CREATE UNIQUE INDEX one_active_order_per_user
ON public.pedidos USING btree ("userId")
WHERE status IN (
  'pendente'::"PedidosStatus",
  'preparando'::"PedidosStatus",
  'pronto'::"PedidosStatus",
  'entregando'::"PedidosStatus"
);

COMMIT;