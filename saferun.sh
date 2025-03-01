#!/usr/bin/env sh
set -e
POSTGRES_HOST=${POSTGRES_HOST:-postgres}
POSTGRES_PORT=${POSTGRES_PORT:-5432}

echo "Waiting till PG starts..."

until pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" | grep "accepting connections" > /dev/null 2>&1; do
  echo "PostgreSQL not ready yet..."
  sleep 1
done

echo "PostgreSQL now ready, running app..."
exec npm run start
