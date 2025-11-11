# Az-Horoscope Detaylı Geliştirme Planı

## 🎯 Proje Hedefi
Modern, yapay zeka destekli astroloji platformu - Gemini AI ile kişiselleştirilmiş burç yorumları

## 📚 Teknoloji Araştırması Sonuçları

### 1. Auth.js v5 (NextAuth)
- **Durum:** Next.js 16 ile uyumlu
- **Kurulum:** `npm install next-auth@beta`
- **Yapılandırma:** Kök dizinde `auth.ts` dosyası oluşturulacak
- **Özellikler:**
  - App Router-first tasarım
  - Universal `auth()` fonksiyonu
  - Google OAuth desteği
  - Edge-compatible
- **Önemli Değişiklikler:**
  - `getServerSession` yerine `auth()` kullanılacak
  - Middleware yapılandırması basitleştirildi
  - Environment variables otomatik olarak `AUTH_` prefix ile algılanıyor

### 2. Tailwind CSS v4
- **Durum:** Next.js 16 ile tam uyumlu
- **Kurulum:** Zaten mevcut (package.json'da v4)
- **Yapılandırma:**
  - CSS-first configuration (tailwind.config.js yerine)
  - `@theme` directive kullanımı
  - `@theme inline` ile daha kolay renk yönetimi
- **Önemli Değişiklikler:**
  - HSL renkleri OKLCH'ye dönüştürülecek
  - `size-*` utility class'ları kullanılacak
  - Modern tarayıcılar için optimize edilmiş

### 3. shadcn/ui
- **Durum:** Tailwind v4 ve React 19 desteği mevcut
- **Kurulum:** `pnpm dlx shadcn@latest init`
- **Yapılandırma:**
  - Canary release ile Tailwind v4 desteği
  - `forwardRef` kaldırıldı (React 19)
  - `data-slot` attribute'ları eklendi
  - `tw-animate-css` kullanımı (tailwindcss-animate yerine)
- **Bileşenler:**
  - Button, Card, Input, Select, Dialog
  - Accordion, Tabs, Avatar
  - Theme Toggle (next-themes ile)

### 4. next-themes
- **Durum:** Stabil ve Next.js 16 uyumlu
- **Kurulum:** `npm install next-themes`
- **Özellikler:**
  - Light/Dark/System tema desteği
  - Hydration mismatch'ten korunma
  - localStorage ile tema kalıcılığı

### 5. Prisma ORM
- **Durum:** PostgreSQL (Neon) ile uyumlu
- **Kurulum:** `npm install @prisma/client && npm install -D prisma`
- **Yapılandırma:**
  - `schema.prisma` dosyası oluşturulacak
  - User, Session, Account modelleri (Auth.js için)
  - HoroscopeReading modeli (burç yorumları için)

### 6. Google Gemini API
- **Durum:** Node.js SDK mevcut
- **Kurulum:** `npm install @google/generative-ai`
- **Kullanım:**
  - API Route'lar ile server-side kullanım
  - `GOOGLE_API_KEY` environment variable
  - Streaming response desteği
- **Özellikler:**
  - Text generation (burç yorumları)
  - Conversation history
  - Safety settings

## 🏗️ Proje Yapısı

```
a-z-horoscope/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (main)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── horoscope/
│   │   │   ├── [sign]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── horoscope/
│   │   │   ├── daily/
│   │   │   │   └── route.ts
│   │   │   └── compatibility/
│   │   │       └── route.ts
│   │   └── gemini/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/ (shadcn components)
│   ├── horoscope/
│   │   ├── zodiac-selector.tsx
│   │   ├── daily-reading.tsx
│   │   └── compatibility-checker.tsx
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── theme-toggle.tsx
│   └── providers/
│       ├── theme-provider.tsx
│       └── session-provider.tsx
├── lib/
│   ├── auth.ts
│   ├── db.ts (Prisma client)
│   ├── gemini.ts (Gemini API wrapper)
│   ├── utils.ts
│   └── zodiac.ts (Burç verileri)
├── prisma/
│   └── schema.prisma
├── public/
│   └── zodiac-icons/ (12 burç ikonu)
├── types/
│   └── index.ts
├── .env
├── .env.example
├── auth.ts
├── middleware.ts
└── package.json
```

## 📝 Geliştirme Adımları

### Faz 1: Temel Altyapı Kurulumu ✅
1. ✅ Git yapılandırması
2. ⏳ Bağımlılıkları yükle
3. ⏳ .env dosyasını oluştur
4. ⏳ Prisma şemasını oluştur
5. ⏳ Auth.js yapılandırması
6. ⏳ shadcn/ui kurulumu
7. ⏳ next-themes kurulumu

### Faz 2: Veritabanı ve Auth
1. Prisma schema tasarımı
   - User model
   - Session model
   - Account model (OAuth)
   - HoroscopeReading model
2. Prisma migrate
3. Auth.js Google OAuth yapılandırması
4. Middleware oluşturma (protected routes)

### Faz 3: UI Bileşenleri
1. shadcn/ui bileşenlerini ekle
   - button, card, input, select
   - dialog, accordion, tabs
   - avatar, dropdown-menu
2. Layout bileşenleri
   - Header (navigation + theme toggle)
   - Footer
3. Theme Provider kurulumu
4. Responsive tasarım

### Faz 4: Gemini AI Entegrasyonu
1. Gemini API wrapper oluştur
2. API route'ları
   - `/api/horoscope/daily` - Günlük burç yorumu
   - `/api/horoscope/compatibility` - Uyumluluk analizi
3. Prompt engineering
   - Burç yorumları için template'ler
   - Kişiselleştirme parametreleri
4. Rate limiting ve error handling

### Faz 5: Burç Özellikleri
1. 12 burç için veri yapısı
   - İsim, tarih aralığı, element, gezegen
   - Genel özellikler
2. Burç seçim arayüzü
3. Günlük burç yorumu sayfası
4. Uyumluluk kontrolü sayfası

### Faz 6: Kullanıcı Özellikleri
1. Login/Logout (Google OAuth)
2. Kullanıcı profili
   - Doğum tarihi ve burç kaydetme
   - Favori burçlar
3. Geçmiş yorumlar
4. Kişiselleştirilmiş dashboard

### Faz 7: Görsel İyileştirmeler
1. Burç ikonları/görselleri
2. Animasyonlar (Framer Motion?)
3. Loading states
4. Error states
5. Dark mode optimizasyonu

### Faz 8: Test ve Optimizasyon
1. `npm run build` ile test
2. TypeScript hataları düzelt
3. ESLint uyarıları düzelt
4. Performance optimizasyonu
5. SEO optimizasyonu (metadata)

### Faz 9: Deployment Hazırlığı
1. Environment variables kontrolü
2. Vercel deployment test
3. Database migration (production)
4. Google OAuth callback URL güncelleme

### Faz 10: GitHub Push
1. Git commit (anlamlı mesajlar)
2. Git push
3. Vercel otomatik deployment

## 🎨 Tasarım Konsepti

### Renk Paleti
- **Primary:** Mor/Lacivert tonları (mistik tema)
- **Accent:** Altın/Sarı (yıldızlar, gezegen)
- **Background:** 
  - Light: Beyaz/Açık gri
  - Dark: Koyu lacivert/Siyah
- **Text:**
  - Light: Koyu gri
  - Dark: Açık gri/Beyaz

### Tipografi
- **Başlıklar:** Geist Sans (mevcut)
- **Metin:** Geist Sans
- **Vurgu:** Geist Mono (tarihler, sayılar)

### UI Tarzı
- Modern, minimalist
- Yumuşak köşeler (rounded-lg, rounded-xl)
- Subtle shadows ve gradients
- Smooth transitions
- Glassmorphism efektleri (opsiyonel)

## 🔑 Önemli Notlar

### Güvenlik
- API key'leri asla client-side'da kullanma
- Tüm Gemini API çağrıları server-side
- CSRF protection (Auth.js built-in)
- Rate limiting (API routes)

### Performans
- Server Components kullan (default)
- Client Components sadece interaktif öğeler için
- Image optimization (next/image)
- Dynamic imports (lazy loading)
- Caching stratejisi (API responses)

### SEO
- Metadata her sayfada
- Open Graph tags
- Structured data (JSON-LD)
- Sitemap.xml
- robots.txt

### Erişilebilirlik
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast (WCAG AA)

## 📦 Paket Listesi

### Production Dependencies
```json
{
  "next": "16.0.1",
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "next-auth": "^5.0.0-beta",
  "next-themes": "^0.2.1",
  "@prisma/client": "^6.0.0",
  "@google/generative-ai": "^0.21.0",
  "zod": "^3.22.4",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.2.0",
  "lucide-react": "^0.294.0"
}
```

### Dev Dependencies
```json
{
  "typescript": "^5",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "@tailwindcss/postcss": "^4",
  "tailwindcss": "^4",
  "eslint": "^9",
  "eslint-config-next": "16.0.1",
  "prisma": "^6.0.0"
}
```

## 🚀 Sonraki Adımlar
1. Bağımlılıkları yükle
2. Prisma şemasını oluştur
3. Auth.js yapılandır
4. shadcn/ui kur
5. İlk bileşenleri oluştur
