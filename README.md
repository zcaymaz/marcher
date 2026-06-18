# Marcher Coffee

| Ortam | Frontend | Backend |
|-------|----------|---------|
| **Canlı** | https://marchercoffee.com | https://servis.marchercoffee.com |
| **Dev** | http://localhost:5055 | http://localhost:5050 |

## Ortam dosyası

Tüm ayarlar **proje kökündeki tek `.env`** dosyasında:

```bash
cp .env.example .env
```

`backend/.env` kullanılmaz — silin veya oluşturmayın.

---

## Geliştirme

```bash
cp .env.example .env

docker compose up -d postgres          # sadece DB
npm install --prefix backend
npm install --prefix frontend
npm run db:migrate
npm run db:seed
npm run dev:backend                    # terminal 1
npm run dev:frontend                   # terminal 2
```

## Canlı (Docker + CloudPanel)

`.env` içinde production değerlerini ayarla (`.env.example` altındaki CANLI bölümüne bak), sonra:

```bash
npm run docker:up
docker compose exec backend node dist/prisma/seed.js
```

CloudPanel reverse proxy:
- **marchercoffee.com** → `http://127.0.0.1:5055` (frontend nginx; `/api` ve `/uploads` backend'e proxy edilir)
- **servis.marchercoffee.com** → `http://127.0.0.1:5050` (opsiyonel, doğrudan API)

---

## Yapı

```
marcher/
├── .env              ← tek ortam dosyası
├── .env.example
├── backend/
├── frontend/
├── docker-compose.yml
└── package.json
```
