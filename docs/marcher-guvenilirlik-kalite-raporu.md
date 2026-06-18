# Marcher — Sistem Güvenilirlik & Kalite Raporu

**Tarih:** 18 Haziran 2026  
**Kapsam:** Backend (NestJS), Frontend (React/Vite), Altyapı (Docker, env, CI/CD)  
**Genel olgunluk:** Erken üretim / küçük ekip — canlıda çalışan, iyi temelleri olan; test, CI ve gözlemlenebilirlik açısından eksikleri belirgin bir yapı.

---

## Genel Skor Özeti

| Alan | Skor | Durum |
|------|------|-------|
| Mimari & kod organizasyonu | ★★★★☆ | İyi |
| Güvenlik | ★★★☆☆ | Orta — kritik noktalar var |
| API & veri doğrulama | ★★★☆☆ | Create güçlü, update zayıf |
| Hata yönetimi & gözlemlenebilirlik | ★★☆☆☆ | Zayıf |
| Test kapsamı | ★☆☆☆☆ | Kritik eksik |
| CI/CD & otomasyon | ★☆☆☆☆ | Yok |
| Dokümantasyon | ★★★☆☆ | Kök README iyi, alt projeler eski |
| Deployment & container | ★★★★☆ | İyi |
| Frontend UX & erişilebilirlik | ★★★☆☆ | Orta |
| Bağımlılık güvenliği | ★★★☆☆ | Orta (transitif uyarılar) |

**Genel değerlendirme:** Sistem tek sunucu + Docker + CloudPanel senaryosu için pratik ve üretime uygun. Ancak ekip büyüdükçe veya trafik arttıkça test, CI, loglama ve birkaç güvenlik açığı ciddi risk oluşturur.

---

## 1. Mimari

### Backend

- **NestJS 11** modüler monolith: controller → service → Prisma
- 13 feature modülü: auth, menu, blog, campaigns, reviews, franchise, upload, vb.
- Global: Prisma, Config, Throttler, ValidationPipe
- Prisma 7 + PostgreSQL + driver adapter

### Frontend

- **React 19 + Vite 8 + React Router 7**
- Context tabanlı state (Auth, Settings) — Redux/React Query yok
- Public + Admin layout ayrımı temiz
- Admin tarafında ortak bileşen sistemi gelişiyor (AdminCard, FormSection, AdminLoading, vb.)

### Altyapı

- Informal monorepo: kök package.json ile backend/ ve frontend/ orkestrasyonu
- Tek kök .env — backend ve Vite ile paylaşımlı (iyi pratik)
- Docker Compose: Postgres + backend + frontend + nginx

**Güçlü yön:** Domain modülleri net, bakımı kolay, üretim deploy yolu tanımlı.

**Zayıf yön:** Formal workspace yok, API dokümantasyonu (Swagger) yok, versiyonlama yok.

---

## 2. Güvenlik

### İyi uygulamalar

| Özellik | Detay |
|---------|-------|
| JWT + HttpOnly cookie | Token tarayıcı JS'inden okunamaz |
| bcrypt (cost 10) | Şifre hash'leme doğru |
| Helmet + CORS + rate limiting | Global 100 req/dk; login 5/dk |
| Admin RBAC | JwtAuthGuard + RolesGuard |
| ValidationPipe | whitelist, forbidNonWhitelisted, transform |
| Franchise honeypot | Spam koruması |
| Son admin koruması | Son admin silinemez |

### Kritik / yüksek riskler

| Risk | Önem | Açıklama |
|------|------|----------|
| Blog XSS | Yüksek | BlogDetail.tsx içinde dangerouslySetInnerHTML — HTML sanitize edilmiyor |
| JWT secret fallback | Yüksek | JWT_SECRET yoksa 'dev-secret' kullanılıyor |
| Update DTO bypass | Orta | Partial&lt;CreateDto&gt; ile PUT isteklerinde nested validation atlanıyor |
| Upload güvenliği | Orta | MIME/extension client'tan geliyor; magic-byte kontrolü yok |
| Reviews veri sızıntısı | Orta | GET /reviews gizli yorumları da dönebilir |
| 7 günlük JWT, refresh yok | Düşük-Orta | Çalınan token süre dolana kadar geçerli |
| .env.example örnek secret | Düşük | Prod'da override edilmezse risk |

### Frontend güvenlik

- Auth token localStorage'da değil, httpOnly cookie'de — doğru
- userInfo localStorage'da; /auth/me öncesi kısa süreli stale admin UI riski
- 401 interceptor yok — oturum süresi dolunca sessiz hata
- i18n escapeValue: false — şu an güvenli (statik JSON), dinamik string eklenirse risk

---

## 3. Güvenilirlik & Hata Yönetimi

### Backend

| Durum | Detay |
|-------|-------|
| Olumlu | Servislerde tutarlı exception kullanımı (NotFoundException, ConflictException, vb.) |
| Eksik | Global exception filter yok |
| Eksik | Yapılandırılmış loglama yok (sadece console.log) |
| Eksik | Request/correlation ID yok |
| Eksik | Health check DB ping yapmıyor — sadece { status: 'ok' } |
| Eksik | Transaction yok — Excel import, seed gibi çok adımlı işlemler atomik değil |

### Frontend

| Durum | Detay |
|-------|-------|
| Olumlu | Admin formlarda parseApiErrors, loading state'leri |
| Eksik | Public sayfalarda hata yönetimi zayıf (Home.tsx 5 istek, .catch() yok) |
| Eksik | MenuDetail / BlogDetail 404 vs loading ayrımı yok |
| Eksik | Error Boundary yok |
| Eksik | Catch-all 404 route yok |
| Uyarı | Auth init tüm uygulamayı blokluyor (public sayfalar dahil) |

---

## 4. Test Kapsamı

| Katman | Durum |
|--------|-------|
| Backend unit test | 0 dosya |
| Backend e2e | 1 eski test — kırık (API /api prefix kullanıyor) |
| Frontend test | Framework yok, 0 test |
| CI test gate | Yok |

**Etkili test kapsamı: ~%0**

Test edilmeyen kritik alanlar: auth akışı, admin guard'lar, CRUD, upload, Excel import/export, rate limiting, franchise spam filtresi.

---

## 5. Veritabanı & API Kalitesi

### Prisma şeması

- Olumlu: Net domain modelleri, enum'lar, unique slug/email
- Olumlu: Çok dilli içerik Json alanlarında
- Uyarı: Float para birimi için — Decimal tercih edilmeli
- Uyarı: Ek index eksik (category, status, isVisible)
- Uyarı: Review.googleReviewId unique değil — duplicate sync riski

### API tasarımı

- Olumlu: RESTful, tutarlı /api prefix
- Olumlu: Merkezi DTO'lar + class-validator
- Eksik: Pagination/filtering yok (liste endpoint'leri)
- Eksik: Update DTO'ları yok
- Eksik: Karışık ID stratejisi (slug vs cuid)
- Eksik: Karışık hata dili (TR/EN)

---

## 6. Frontend Kalitesi

### Güçlü yönler

- Cookie tabanlı auth doğru uygulanmış
- i18n (TR/EN/FR) public sitede iyi
- SEO: react-helmet-async
- Admin UX olgunlaşıyor (ortak bileşenler, validation)
- Hero carousel ve dil seçicide accessibility çabası

### Zayıf yönler

- Strict TypeScript kapalı (tsconfig.app.json)
- Code splitting yok — tüm route'lar eager import
- React Query/cache yok — tekrarlayan API çağrıları
- Admin UI çoğunlukla hardcoded Türkçe
- Birçok görselde boş alt text
- document.documentElement.lang dil değişiminde güncellenmiyor

---

## 7. Altyapı & DevOps

### Güçlü yönler

- Multi-stage Dockerfile'lar (backend migrate-on-start, frontend nginx)
- Postgres healthcheck
- Localhost-bound portlar (5050/5055) — reverse proxy için uygun
- Kök README: dev/prod, CloudPanel adımları
- Tek .env konvansiyonu

### Eksikler

| Eksik | Etki |
|-------|------|
| CI/CD (GitHub Actions vb.) | Her deploy manuel, regresyon riski |
| Husky / lint-staged | Pre-commit kalite kapısı yok |
| .dockerignore | Büyük image, yavaş build |
| Backend/frontend healthcheck (compose) | Orchestrator restart mantığı zayıf |
| Dev Postgres port mapping | localhost:5432 ile compose uyumsuzluğu |
| Monitoring (Sentry, Prometheus vb.) | Prod hataları görünmez |
| Dependabot/Renovate | Bağımlılık güncellemeleri manuel |

### Bağımlılık audit

Backend'de transitif moderate seviye uyarılar var. Doğrudan prod runtime'ı etkilemeyebilir; düzenli npm audit önerilir.

---

## 8. Risk Matrisi

**Yüksek etki + yüksek olasılık:** Blog XSS, sıfır test, JWT secret fallback

**Orta etki:** Upload güvenliği, reviews filtresi, update validation bypass

**Düşük etki:** i18n alt text, Float para tipi

---

## 9. Öncelikli İyileştirme Planı

### Acil (1–2 hafta)

1. Blog HTML sanitizasyonu — DOMPurify (frontend) veya backend'de sanitize
2. JWT_SECRET zorunlu kıl — prod'da boot'ta fail-fast
3. Reviews endpoint — varsayılan olarak sadece isVisible: true dönsün
4. Update DTO'ları — ayrı Update*Dto + ValidateNested ile partial validation

### Kısa vade (2–4 hafta)

5. Temel test suite — auth, health, CRUD smoke testleri
6. GitHub Actions — lint + build + test pipeline
7. Axios 401 interceptor — oturum süresi dolunca logout/redirect
8. Health check + DB ping — compose healthcheck ile bağla
9. Upload hardening — magic-byte, sabit upload path

### Orta vade (1–2 ay)

10. Structured logging — NestJS Logger veya Pino + correlation ID
11. Strict TypeScript — frontend'de kademeli aç
12. React.lazy admin route'ları için
13. React Query — cache, dedup, error retry
14. Transaction — Excel import ve seed işlemleri
15. Prettier + Husky — kök seviyede lint-staged
16. .dockerignore, dev Postgres port, .env.example placeholder'ları

---

## 10. Sonuç

Marcher, küçük ölçekli üretim için sağlam temeller üzerine kurulu: modüler backend, güvenlik middleware'leri, cookie auth, Docker deploy, tek env yönetimi. Kod organizasyonu ve admin panel gelişimi kalite açısından olumlu.

**En büyük güvenilirlik açıkları:**

- Neredeyse sıfır test
- CI/CD yok
- Prod gözlemlenebilirliği yok
- Blog XSS yüzeyi
- Update validation bypass

Bu dört alan giderilmeden sistem çalışıyor ama regresyon ve güvenlik riski taşıyor. Acil maddeler (özellikle XSS, JWT secret, reviews filtresi) hızlıca ele alınabilir; test + CI ise orta vadede en yüksek ROI'yi sağlar.

---

*Rapor otomatik kod tabanı analizi ile hazırlanmıştır — Marcher Coffee projesi.*
