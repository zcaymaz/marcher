# Marcher Coffee

| Ortam | Frontend | Backend |
|-------|----------|---------|
| **Canlı** | https://marchercoffee.com | https://servis.marchercoffee.com |
| **Dev** | http://localhost:5055 | http://localhost:5050 |

## Canlı kurulum (tek komut)

Sunucuda proje kökünde:

```bash
git clone <repo-url> /var/www/marcher
cd /var/www/marcher
docker compose up -d --build
```

Bu komut otomatik olarak:
- PostgreSQL’i başlatır
- Migration çalıştırır
- Seed (admin, menü, ayarlar) yükler
- Backend’i `127.0.0.1:5050` üzerinde ayağa kaldırır
- Frontend’i `127.0.0.1:5055` üzerinde ayağa kaldırır

`.env` dosyası **zorunlu değil** — `.env.example` içindeki production varsayılanları kullanılır.

### CloudPanel reverse proxy

| Domain | Hedef |
|--------|--------|
| marchercoffee.com | `http://127.0.0.1:5055` |
| servis.marchercoffee.com | `http://127.0.0.1:5050` |

### İlk giriş (varsayılan admin)

- E-posta: `admin@marchercoffee.com`
- Şifre: `Marcher2026!`

### Güvenlik (canlıda mutlaka yapın)

```bash
cp .env.example .env
nano .env   # JWT_SECRET, POSTGRES_PASSWORD, ADMIN_PASSWORD değiştirin
docker compose up -d --build
```

`JWT_SECRET` üretmek için: `openssl rand -base64 64`

---

## Geliştirme

```bash
cp .env.example .env
# .env içinde GELİŞTİRME yorumlarındaki localhost değerlerini kullanın

docker compose up -d postgres
npm install --prefix backend
npm install --prefix frontend
npm run db:migrate
npm run db:seed
npm run dev:backend    # terminal 1
npm run dev:frontend   # terminal 2
```

---

## Yapı

```
marcher/
├── .env.example      ← Docker canlı varsayılanları (repoda)
├── .env              ← isteğe bağlı özelleştirme (gitignore)
├── backend/
├── frontend/
├── docker-compose.yml
└── package.json
```
