import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, 'marcher-guvenilirlik-kalite-raporu.pdf');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 50, right: 50 },
  info: {
    Title: 'Marcher — Sistem Güvenilirlik & Kalite Raporu',
    Author: 'Marcher Coffee',
    Subject: 'Güvenilirlik ve Kalite Raporu',
  },
});

doc.pipe(fs.createWriteStream(outputPath));

const colors = {
  primary: '#3D2314',
  accent: '#8B5E3C',
  text: '#1A1A1A',
  muted: '#555555',
  light: '#F5F0EB',
  border: '#D9CEC4',
  red: '#B42318',
  orange: '#C05621',
  green: '#2F6B3A',
};

const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

function ensureSpace(height = 60) {
  if (doc.y + height > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
  }
}

function drawHeaderBar() {
  doc.save();
  doc.rect(0, 0, doc.page.width, 8).fill(colors.primary);
  doc.restore();
}

function title(text) {
  ensureSpace(50);
  doc.font('Helvetica-Bold').fontSize(22).fillColor(colors.primary).text(text, { width: pageWidth });
  doc.moveDown(0.4);
}

function h2(text) {
  ensureSpace(40);
  doc.moveDown(0.6);
  doc.font('Helvetica-Bold').fontSize(14).fillColor(colors.primary).text(text, { width: pageWidth });
  doc.moveDown(0.3);
}

function h3(text) {
  ensureSpace(30);
  doc.moveDown(0.4);
  doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.accent).text(text, { width: pageWidth });
  doc.moveDown(0.2);
}

function paragraph(text) {
  ensureSpace(24);
  doc.font('Helvetica').fontSize(10).fillColor(colors.text).text(text, {
    width: pageWidth,
    align: 'justify',
    lineGap: 2,
  });
  doc.moveDown(0.3);
}

function bullet(text, indent = 12) {
  ensureSpace(18);
  const y = doc.y;
  doc.font('Helvetica').fontSize(10).fillColor(colors.text).text('•', doc.page.margins.left, y, { continued: false });
  doc.text(text, doc.page.margins.left + indent, y, { width: pageWidth - indent, lineGap: 1.5 });
  doc.moveDown(0.15);
}

function metaLine(label, value) {
  ensureSpace(16);
  doc.font('Helvetica-Bold').fontSize(10).fillColor(colors.muted).text(`${label}: `, { continued: true });
  doc.font('Helvetica').fillColor(colors.text).text(value);
}

function divider() {
  ensureSpace(20);
  const y = doc.y + 4;
  doc.moveTo(doc.page.margins.left, y).lineTo(doc.page.margins.left + pageWidth, y).strokeColor(colors.border).stroke();
  doc.moveDown(0.8);
}

function scoreTable(rows) {
  const col1 = pageWidth * 0.52;
  const col2 = pageWidth * 0.18;
  const col3 = pageWidth * 0.30;
  const rowHeight = 22;
  const startX = doc.page.margins.left;
  let y = doc.y;

  ensureSpace(rowHeight * (rows.length + 1) + 10);

  doc.save();
  doc.rect(startX, y, pageWidth, rowHeight).fill(colors.primary);
  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9);
  doc.text('Alan', startX + 8, y + 7, { width: col1 - 8 });
  doc.text('Skor', startX + col1 + 8, y + 7, { width: col2 - 8 });
  doc.text('Durum', startX + col1 + col2 + 8, y + 7, { width: col3 - 8 });
  doc.restore();
  y += rowHeight;

  rows.forEach((row, i) => {
    const bg = i % 2 === 0 ? '#FFFFFF' : colors.light;
    doc.save();
    doc.rect(startX, y, pageWidth, rowHeight).fill(bg);
    doc.restore();
    doc.font('Helvetica').fontSize(9).fillColor(colors.text);
    doc.text(row[0], startX + 8, y + 7, { width: col1 - 8 });
    doc.text(row[1], startX + col1 + 8, y + 7, { width: col2 - 8 });
    doc.text(row[2], startX + col1 + col2 + 8, y + 7, { width: col3 - 8 });
    y += rowHeight;
  });

  doc.y = y + 8;
}

function riskTable(rows) {
  const col1 = pageWidth * 0.28;
  const col2 = pageWidth * 0.14;
  const col3 = pageWidth * 0.58;
  const rowHeight = 28;
  const startX = doc.page.margins.left;
  let y = doc.y;

  ensureSpace(rowHeight * (rows.length + 1) + 10);

  doc.save();
  doc.rect(startX, y, pageWidth, rowHeight).fill(colors.accent);
  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9);
  doc.text('Risk', startX + 8, y + 9, { width: col1 - 8 });
  doc.text('Önem', startX + col1 + 8, y + 9, { width: col2 - 8 });
  doc.text('Açıklama', startX + col1 + col2 + 8, y + 9, { width: col3 - 8 });
  doc.restore();
  y += rowHeight;

  rows.forEach((row, i) => {
    const bg = i % 2 === 0 ? '#FFFFFF' : colors.light;
    doc.save();
    doc.rect(startX, y, pageWidth, rowHeight).fill(bg);
    doc.restore();
    doc.font('Helvetica').fontSize(8.5).fillColor(colors.text);
    doc.text(row[0], startX + 8, y + 8, { width: col1 - 8 });
    doc.fillColor(row[1] === 'Yüksek' ? colors.red : row[1] === 'Orta' ? colors.orange : colors.muted);
    doc.text(row[1], startX + col1 + 8, y + 8, { width: col2 - 8 });
    doc.fillColor(colors.text);
    doc.text(row[2], startX + col1 + col2 + 8, y + 8, { width: col3 - 8 });
    y += rowHeight;
  });

  doc.y = y + 8;
}

function numberedList(items) {
  items.forEach((item, index) => {
    ensureSpace(20);
    const y = doc.y;
    doc.font('Helvetica-Bold').fontSize(10).fillColor(colors.accent).text(`${index + 1}.`, doc.page.margins.left, y);
    doc.font('Helvetica').fillColor(colors.text).text(item, doc.page.margins.left + 18, y, {
      width: pageWidth - 18,
      lineGap: 1.5,
    });
    doc.moveDown(0.2);
  });
}

drawHeaderBar();

title('Marcher — Sistem Güvenilirlik & Kalite Raporu');
metaLine('Tarih', '18 Haziran 2026');
metaLine('Kapsam', 'Backend (NestJS), Frontend (React/Vite), Altyapı (Docker, env, CI/CD)');
metaLine('Genel olgunluk', 'Erken üretim / küçük ekip');
doc.moveDown(0.5);
paragraph(
  'Canlıda çalışan, iyi temelleri olan; test, CI ve gözlemlenebilirlik açısından eksikleri belirgin bir yapı. Sistem tek sunucu + Docker + CloudPanel senaryosu için pratik ve üretime uygun.'
);

divider();
h2('Genel Skor Özeti');
scoreTable([
  ['Mimari & kod organizasyonu', '★★★★☆', 'İyi'],
  ['Güvenlik', '★★★☆☆', 'Orta — kritik noktalar var'],
  ['API & veri doğrulama', '★★★☆☆', 'Create güçlü, update zayıf'],
  ['Hata yönetimi & gözlemlenebilirlik', '★★☆☆☆', 'Zayıf'],
  ['Test kapsamı', '★☆☆☆☆', 'Kritik eksik'],
  ['CI/CD & otomasyon', '★☆☆☆☆', 'Yok'],
  ['Dokümantasyon', '★★★☆☆', 'Kök README iyi'],
  ['Deployment & container', '★★★★☆', 'İyi'],
  ['Frontend UX & erişilebilirlik', '★★★☆☆', 'Orta'],
  ['Bağımlılık güvenliği', '★★★☆☆', 'Orta'],
]);

divider();
h2('1. Mimari');

h3('Backend');
bullet('NestJS 11 modüler monolith: controller → service → Prisma');
bullet('13 feature modülü: auth, menu, blog, campaigns, reviews, franchise, upload, vb.');
bullet('Global: Prisma, Config, Throttler, ValidationPipe');
bullet('Prisma 7 + PostgreSQL + driver adapter');

h3('Frontend');
bullet('React 19 + Vite 8 + React Router 7');
bullet('Context tabanlı state (Auth, Settings)');
bullet('Public + Admin layout ayrımı temiz');
bullet('Admin tarafında ortak bileşen sistemi gelişiyor');

h3('Altyapı');
bullet('Informal monorepo: kök package.json ile backend/ ve frontend/ orkestrasyonu');
bullet('Tek kök .env — backend ve Vite ile paylaşımlı');
bullet('Docker Compose: Postgres + backend + frontend + nginx');

paragraph('Güçlü yön: Domain modülleri net, bakımı kolay, üretim deploy yolu tanımlı.');
paragraph('Zayıf yön: Formal workspace yok, API dokümantasyonu (Swagger) yok, versiyonlama yok.');

divider();
h2('2. Güvenlik');

h3('İyi uygulamalar');
bullet('JWT + HttpOnly cookie — token tarayıcı JS\'inden okunamaz');
bullet('bcrypt (cost 10) şifre hash\'leme');
bullet('Helmet + CORS + rate limiting (global 100 req/dk; login 5/dk)');
bullet('Admin RBAC: JwtAuthGuard + RolesGuard');
bullet('ValidationPipe: whitelist, forbidNonWhitelisted, transform');
bullet('Franchise honeypot spam koruması');
bullet('Son admin koruması');

h3('Kritik / yüksek riskler');
riskTable([
  ['Blog XSS', 'Yüksek', 'BlogDetail.tsx — HTML sanitize edilmiyor'],
  ['JWT secret fallback', 'Yüksek', 'JWT_SECRET yoksa dev-secret kullanılıyor'],
  ['Update DTO bypass', 'Orta', 'PUT isteklerinde nested validation atlanıyor'],
  ['Upload güvenliği', 'Orta', 'MIME/extension client\'tan geliyor'],
  ['Reviews veri sızıntısı', 'Orta', 'Gizli yorumlar da dönebilir'],
  ['7 günlük JWT', 'Düşük', 'Refresh/revocation yok'],
]);

divider();
h2('3. Güvenilirlik & Hata Yönetimi');

h3('Backend');
bullet('Olumlu: Tutarlı exception kullanımı (NotFoundException, ConflictException)');
bullet('Eksik: Global exception filter yok');
bullet('Eksik: Yapılandırılmış loglama yok');
bullet('Eksik: Request/correlation ID yok');
bullet('Eksik: Health check DB ping yapmıyor');
bullet('Eksik: Transaction yok — Excel import, seed atomik değil');

h3('Frontend');
bullet('Olumlu: Admin formlarda parseApiErrors, loading state\'leri');
bullet('Eksik: Public sayfalarda hata yönetimi zayıf');
bullet('Eksik: MenuDetail / BlogDetail 404 vs loading ayrımı yok');
bullet('Eksik: Error Boundary ve catch-all 404 route yok');
bullet('Uyarı: Auth init tüm uygulamayı blokluyor');

divider();
h2('4. Test Kapsamı');
scoreTable([
  ['Backend unit test', '0 dosya', 'Kritik eksik'],
  ['Backend e2e', '1 kırık test', 'API prefix uyumsuz'],
  ['Frontend test', 'Framework yok', '0 test'],
  ['CI test gate', 'Yok', 'Manuel deploy'],
]);
paragraph('Etkili test kapsamı: ~%0. Auth, guard\'lar, CRUD, upload, Excel import/export test edilmiyor.');

divider();
h2('5. Veritabanı & API Kalitesi');

h3('Prisma şeması');
bullet('Olumlu: Net domain modelleri, enum\'lar, unique slug/email');
bullet('Olumlu: Çok dilli içerik Json alanlarında');
bullet('Uyarı: Float para birimi — Decimal tercih edilmeli');
bullet('Uyarı: Ek index eksik (category, status, isVisible)');

h3('API tasarımı');
bullet('Olumlu: RESTful, tutarlı /api prefix, merkezi DTO\'lar');
bullet('Eksik: Pagination/filtering, Update DTO\'ları, API versiyonlama');

divider();
h2('6. Frontend Kalitesi');

h3('Güçlü yönler');
bullet('Cookie tabanlı auth doğru uygulanmış');
bullet('i18n (TR/EN/FR) public sitede iyi');
bullet('SEO: react-helmet-async');
bullet('Admin UX olgunlaşıyor');

h3('Zayıf yönler');
bullet('Strict TypeScript kapalı');
bullet('Code splitting yok');
bullet('React Query/cache yok — tekrarlayan API çağrıları');
bullet('Admin UI çoğunlukla hardcoded Türkçe');

divider();
h2('7. Altyapı & DevOps');

h3('Güçlü yönler');
bullet('Multi-stage Dockerfile\'lar (migrate-on-start, nginx)');
bullet('Postgres healthcheck, localhost-bound portlar');
bullet('Kök README ve tek .env konvansiyonu');

h3('Eksikler');
bullet('CI/CD yok — her deploy manuel');
bullet('Husky / lint-staged yok');
bullet('.dockerignore yok');
bullet('Monitoring yok (Sentry, Prometheus vb.)');

divider();
h2('8. Öncelikli İyileştirme Planı');

h3('Acil (1–2 hafta)');
numberedList([
  'Blog HTML sanitizasyonu — DOMPurify',
  'JWT_SECRET zorunlu kıl — prod\'da fail-fast',
  'Reviews endpoint — varsayılan olarak sadece görünür yorumlar',
  'Update DTO\'ları — ayrı Update*Dto sınıfları',
]);

h3('Kısa vade (2–4 hafta)');
numberedList([
  'Temel test suite — auth, health, CRUD smoke testleri',
  'GitHub Actions — lint + build + test pipeline',
  'Axios 401 interceptor',
  'Health check + DB ping',
  'Upload hardening',
]);

h3('Orta vade (1–2 ay)');
numberedList([
  'Structured logging + correlation ID',
  'Strict TypeScript (frontend)',
  'React.lazy + React Query',
  'Transaction desteği (Excel import, seed)',
  'Prettier + Husky + .dockerignore',
]);

divider();
h2('9. Sonuç');

paragraph(
  'Marcher, küçük ölçekli üretim için sağlam temeller üzerine kurulu: modüler backend, güvenlik middleware\'leri, cookie auth, Docker deploy, tek env yönetimi.'
);

paragraph(
  'En büyük güvenilirlik açıkları: neredeyse sıfır test, CI/CD yok, prod gözlemlenebilirliği yok, blog XSS yüzeyi ve update validation bypass. Acil maddeler hızlıca ele alınabilir; test + CI orta vadede en yüksek ROI\'yi sağlar.'
);

doc.moveDown(1);
doc.font('Helvetica-Oblique').fontSize(8).fillColor(colors.muted).text(
  'Rapor otomatik kod tabanı analizi ile hazırlanmıştır — Marcher Coffee projesi.',
  { width: pageWidth, align: 'center' }
);

const range = doc.bufferedPageRange();
for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  drawHeaderBar();
  doc.font('Helvetica').fontSize(8).fillColor(colors.muted);
  doc.text(
    `Marcher Güvenilirlik & Kalite Raporu — Sayfa ${i - range.start + 1} / ${range.count}`,
    doc.page.margins.left,
    doc.page.height - 35,
    { width: pageWidth, align: 'center' }
  );
}

doc.end();

doc.on('finish', () => {
  console.log(`PDF oluşturuldu: ${outputPath}`);
});
