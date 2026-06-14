# Marcher Coffee

| Ortam | Frontend | Backend |
|-------|----------|---------|
| **Canlı** | https://marchercoffee.com | https://servis.marchercoffee.com |
| **Dev** | http://localhost:5055 | http://localhost:5050 |

## Canlı deploy (Docker + CloudPanel)

### 1. Ortam dosyası

```bash
cp .env.example .env
# JWT_SECRET, POSTGRES_PASSWORD, ADMIN_PASSWORD değiştir
```

### 2. Docker başlat

```bash
docker compose up -d --build
```

Servisler localhost'ta dinler (CloudPanel proxy için):
- Frontend → `127.0.0.1:5055`
- Backend → `127.0.0.1:5050`

### 3. CloudPanel site ayarları

**marchercoffee.com** → Reverse Proxy → `http://127.0.0.1:5055`

**servis.marchercoffee.com** → Reverse Proxy → `http://127.0.0.1:5050`

Her iki site için SSL aktif et.

### 4. İlk kurulum (seed)

```bash
docker compose exec backend node -r dotenv/config dist/prisma/seed.js
```

---

## Geliştirme

```bash
cp .env.development.example backend/.env

docker compose up -d postgres   # sadece DB
cd backend && npm install && npx prisma migrate deploy && npm run db:seed && npm run start:dev
cd frontend && npm install && npm run dev
```

## Yapı

```
marcher/
├── backend/     → servis.marchercoffee.com
├── frontend/    → marchercoffee.com
└── docker-compose.yml
```
