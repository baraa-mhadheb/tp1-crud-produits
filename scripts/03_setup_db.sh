#!/usr/bin/env bash
# Démarre PostgreSQL et crée l'utilisateur + la base de données
set -e
sudo service postgresql start
sleep 2
sudo -u postgres psql <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'tp1_user') THEN
    CREATE ROLE tp1_user LOGIN PASSWORD 'tp1_password';
  END IF;
END
\$\$;
SQL
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='tp1_db'" | grep -q 1 \
  || sudo -u postgres createdb -O tp1_user tp1_db
echo "✅ Base tp1_db prête (user: tp1_user)."
PGPASSWORD=tp1_password psql -h localhost -U tp1_user -d tp1_db -c "SELECT current_database(), current_user;"
