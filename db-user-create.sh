#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  -- cria o usuário que o Prisma vai usar
  CREATE USER app_user WITH PASSWORD '${POSTGRES_PASSWORD}';

  -- dá acesso só ao banco da aplicação
  GRANT CONNECT ON DATABASE $POSTGRES_DB TO app_user;

  -- permite criar e modificar tabelas (necessário para migrations do Prisma)
  GRANT CREATE ON SCHEMA public TO app_user;

  -- permite ler e escrever nas tabelas
  GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;

  -- garante permissões em tabelas criadas no futuro (pelo Prisma migrate)
  ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;
EOSQL