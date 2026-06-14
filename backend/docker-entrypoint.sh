#!/bin/sh
set -e

echo ">> Veritabanı migration..."
npx prisma migrate deploy

echo ">> Seed (ilk kurulum / güncelleme)..."
node dist/prisma/seed.js

echo ">> API başlatılıyor..."
exec node dist/main.js
