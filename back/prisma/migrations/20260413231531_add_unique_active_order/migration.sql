-- This is an empty migration.
CREATE UNIQUE INDEX one_active_order_per_user
ON Pedidos ("userId")
WHERE status = 'pendente';