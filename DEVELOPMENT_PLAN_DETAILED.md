# 📋 Az-Horoscope Detaylı Geliştirme Planı

**Tarih:** 11 Kasım 2025  
**Geliştirici:** Salih TANRISEVEN  
**Mevcut Durum:** %77.7 Tamamlandı (7/9 özellik)  
**Hedef:** %100 Tamamlanma (9/9 özellik)

---

## 🎯 Genel Bakış

Bu dokümantasyon, Az-Horoscope projesinin kalan 2 özelliğinin (%22.3) detaylı geliştirme planını içermektedir. Mevcut kod yapısı korunarak, titizlikle ve adım adım ilerleme stratejisi benimsenmiştir.

---

## 📊 Mevcut Durum Analizi

### ✅ Tamamlanan Özellikler (7/9)

| # | Özellik | Durum | Commit | Teknolojiler |
|---|---------|-------|--------|--------------|
| 1 | Profil - Burç Seçimi | ✅ | f2fd09b | Prisma, NextAuth, shadcn/ui |
| 2 | Geçmiş Yorumlar | ✅ | f2fd09b | Gemini AI, Prisma |
| 3 | Haftalık/Aylık Yorumlar | ✅ | f2fd09b | Gemini AI, Tab Navigation |
| 4 | Favori ve Paylaşım | ✅ | f2fd09b | Prisma, API Routes |
| 5 | Burç Detay Sayfaları | ✅ | f2fd09b | SSG, Dynamic Routes |
| 6 | E-posta Bildirimleri | ✅ | 09b7d8a | Resend, Email Templates |
| 7 | Admin Paneli | ✅ | 09b7d8a | Recharts, TanStack Table |

### 🏗️ Mevcut Teknoloji Stack

**Framework & Core:**
- Next.js 16.0.1 (App Router)
- React 19.2.0
- TypeScript 5

**Database & Auth:**
- PostgreSQL (Neon)
- Prisma 6.19.0
- NextAuth.js v5 (beta.30)

**UI & Styling:**
- shadcn/ui (Radix UI)
- Tailwind CSS 4
- next-themes 0.4.6
- lucide-react 0.553.0

**AI & Services:**
- Google Gemini 2.5 Flash
- Resend (Email)

**Data Visualization:**
- Recharts 3.4.1
- TanStack Table 8.21.3

### 📁 Mevcut Proje Yapısı

```
a-z-horoscope/
├── app/
│   ├── admin/              # Admin paneli (✅ Tamamlandı)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── stats/page.tsx
│   │   └── users/page.tsx
│   ├── api/
│   │   ├── admin/          # Admin API'ler (✅)
│   │   ├── favorites/      # Favori API'ler (✅)
│   │   ├── horoscope/      # Burç yorumu API'ler (✅)
│   │   └── user/           # Kullanıcı API'ler (✅)
│   ├── dashboard/          # Kullanıcı dashboard (✅)
│   ├── horoscope/          # Burç yorumları (✅)
│   ├── profile/            # Profil sayfası (✅)
│   ├── zodiac/             # Burç detayları (✅)
│   ├── login/              # Giriş sayfası (✅)
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── emails/             # Email template'leri (✅)
│   ├── horoscope/          # Burç bileşenleri (✅)
│   ├── layout/             # Layout bileşenleri (✅)
│   ├── providers/          # Context providers (✅)
│   └── ui/                 # shadcn/ui bileşenleri (✅)
├── lib/
│   ├── admin.ts            # Admin helper'ları (✅)
│   ├── db.ts               # Prisma client (✅)
│   ├── email.ts            # Email servisi (✅)
│   ├── gemini.ts           # Gemini AI (✅)
│   ├── utils.ts            # Utility fonksiyonlar (✅)
│   └── zodiac.ts           # Burç hesaplamaları (✅)
├── prisma/
│   ├── schema.prisma       # Database schema (✅)
│   └── migrations/         # 7 migration (✅)
├── scripts/
│   ├── create-admin.ts     # Admin oluşturma (✅)
│   └── list-admins.ts      # Admin listeleme (✅)
└── auth.ts                 # NextAuth config (✅)
```

### 🗄️ Mevcut Database Schema

```prisma
enum UserRole {
  USER
  ADMIN
}

model User {
  id                      String    @id @default(cuid())
  name                    String?
  email                   String?   @unique
  emailVerified           DateTime?
  image                   String?
  birthDate               DateTime?
  zodiacSign              String?
  emailNotifications      Boolean   @default(false)
  notificationPreferences Json?
  role                    UserRole  @default(USER)
  createdAt               DateTime  @default(now())
  updatedAt               DateTime  @updatedAt
  
  accounts              Account[]
  sessions              Session[]
  horoscopeReadings     HoroscopeReading[]
  favoriteReadings      FavoriteReading[]
}

model HoroscopeReading {
  id          String   @id @default(cuid())
  userId      String
  zodiacSign  String
  readingType String   // "daily", "weekly", "monthly", "compatibility"
  content     String   @db.Text
  date        DateTime @default(now())
  createdAt   DateTime @default(now())
  
  user        User              @relation(...)
  favoritedBy FavoriteReading[]
}

model FavoriteReading {
  id        String   @id @default(cuid())
  userId    String
  readingId String
  createdAt DateTime @default(now())
  
  user    User             @relation(...)
  reading HoroscopeReading @relation(...)
}
```

---

## 🚀 Kalan Özellikler (2/9)

### ⏳ Özellik 8: Swiss Ephemeris Entegrasyonu

**Öncelik:** YÜKSEK  
**Tahmini Süre:** 4-5 saat  
**Durum:** Planlama aşamasında

#### 📌 Hedefler

1. **Profesyonel Astroloji Hesaplamaları:** Gerçek astronomik verilerle hassas hesaplamalar
2. **Doğum Haritası (Natal Chart):** Kullanıcıların doğum haritalarını görselleştirme
3. **Transit Hesaplamaları:** Güncel gezegen pozisyonları ve etkileri
4. **Gemini AI Entegrasyonu:** Swiss Ephemeris verileri + AI yorumlama

#### 🔧 Teknik Detaylar

**Kullanılacak Kütüphane:**
- `sweph@latest` (AGPL-3.0 lisanslı, en güncel ve stabil)
- Alternatif: `sweph-wasm` (Browser uyumlu, ancak SSR ile uyumsuz olabilir)

**Ephemeris Dosyaları:**
- Kaynak: https://github.com/aloistr/swisseph/tree/master/ephe
- Gerekli dosyalar:
  - `sepl_18.se1` (Gezegenler 1800-2400)
  - `semo_18.se1` (Ay 1800-2400)
  - `seas_18.se1` (Ana asteroidler)
- Toplam boyut: ~50MB
- Konum: `/public/ephemeris/`

**Hesaplanacak Veriler:**
1. ✅ Güneş, Ay ve 8 gezegen pozisyonları
2. ✅ Yükselen burç (Ascendant)
3. ✅ 12 Ev (Houses) - Placidus sistemi
4. ✅ Ay düğümleri (North Node, South Node)
5. ✅ Chiron ve Lilith pozisyonları
6. ✅ Aspectler (Conjunction, Opposition, Trine, Square, Sextile)

#### 📋 Yapılacaklar Listesi

**1. Kurulum ve Yapılandırma**
- [ ] `sweph` paketini yükle: `npm install sweph@latest`
- [ ] Build tools kontrolü (Linux: build-essential, python3)
- [ ] Ephemeris dosyalarını indir ve `/public/ephemeris/` klasörüne yerleştir
- [ ] Ephemeris path yapılandırması

**2. Backend - Swiss Ephemeris Wrapper**
- [ ] `/lib/swisseph.ts` dosyası oluştur
- [ ] Ephemeris path ayarlama fonksiyonu
- [ ] Doğum haritası hesaplama fonksiyonu
- [ ] Gezegen pozisyonları hesaplama
- [ ] Yükselen burç hesaplama
- [ ] Evler (Houses) hesaplama
- [ ] Aspect hesaplama fonksiyonu
- [ ] TypeScript tip tanımlamaları

**3. API Endpoint'leri**
- [ ] `POST /api/astrology/natal-chart` - Doğum haritası
  - Input: birthDate, birthTime, latitude, longitude
  - Output: Gezegen pozisyonları, yükselen burç, evler
- [ ] `POST /api/astrology/transit` - Transit hesaplamaları
  - Input: date (opsiyonel, default: bugün)
  - Output: Güncel gezegen pozisyonları
- [ ] `POST /api/astrology/interpretation` - AI yorumlama
  - Input: natal chart data
  - Output: Gemini AI yorumu

**4. Database Schema Güncellemesi**
- [ ] Prisma schema'ya `NatalChart` modeli ekle (opsiyonel - cache için)
```prisma
model NatalChart {
  id          String   @id @default(cuid())
  userId      String   @unique
  birthDate   DateTime
  birthTime   String
  latitude    Float
  longitude   Float
  chartData   Json     // Swiss Ephemeris çıktısı
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user User @relation(...)
}
```
- [ ] Migration oluştur: `npx prisma migrate dev --name add_natal_chart`

**5. Frontend - Doğum Haritası Sayfası**
- [ ] `/app/natal-chart/page.tsx` oluştur
- [ ] Doğum bilgileri formu (tarih, saat, yer)
- [ ] Yer seçici (şehir/koordinat) - Google Places API veya manuel
- [ ] Doğum haritası görselleştirme bileşeni
- [ ] Gezegen pozisyonları tablosu
- [ ] Evler tablosu
- [ ] Aspect'ler listesi

**6. Frontend - Doğum Haritası Bileşenleri**
- [ ] `/components/astrology/natal-chart-form.tsx`
- [ ] `/components/astrology/natal-chart-wheel.tsx` (SVG tabanlı)
- [ ] `/components/astrology/planet-positions.tsx`
- [ ] `/components/astrology/houses-table.tsx`
- [ ] `/components/astrology/aspects-list.tsx`

**7. Gemini AI Entegrasyonu**
- [ ] `/lib/gemini.ts` dosyasını güncelle
- [ ] Doğum haritası yorumlama prompt'u
- [ ] Transit yorumlama prompt'u
- [ ] Aspect yorumlama prompt'u

**8. Profil Sayfası Entegrasyonu**
- [ ] `/app/profile/page.tsx` güncelle
- [ ] Doğum bilgileri bölümü ekle (tarih, saat, yer)
- [ ] "Doğum Haritamı Gör" butonu
- [ ] Doğum haritası özeti kartı

**9. Test ve Optimizasyon**
- [ ] Unit testler (gezegen hesaplamaları)
- [ ] API endpoint testleri
- [ ] Build testi: `npm run build`
- [ ] TypeScript kontrolü: `npx tsc --noEmit`
- [ ] ESLint kontrolü: `npm run lint`
- [ ] Performance optimizasyonu (caching)

**10. Dokümantasyon ve Commit**
- [ ] `FEATURE_8_REPORT.md` oluştur
- [ ] README.md güncelle
- [ ] Git commit: "feat: add Swiss Ephemeris integration (natal chart, transits, houses)"
- [ ] GitHub push
- [ ] Vercel deployment kontrolü

#### 🎨 UI/UX Tasarım Notları

**Doğum Haritası Wheel (SVG):**
- 360° daire, 12 ev bölümü
- Gezegen sembolleri ve dereceleri
- Aspect çizgileri (renkli)
- Responsive tasarım
- Dark/Light mode uyumlu

**Renkler:**
- Güneş: Turuncu (#FF6B35)
- Ay: Gümüş (#C0C0C0)
- Merkür: Sarı (#FFD700)
- Venüs: Pembe (#FF69B4)
- Mars: Kırmızı (#DC143C)
- Jüpiter: Mor (#8B008B)
- Satürn: Kahverengi (#8B4513)
- Uranüs: Turkuaz (#40E0D0)
- Neptün: Mavi (#4169E1)
- Plüton: Siyah (#000000)

#### 🚨 Potansiyel Sorunlar ve Çözümler

**Sorun 1: Build tools eksikliği**
- **Çözüm:** Vercel otomatik olarak build tools sağlar, local'de `build-essential` yükle

**Sorun 2: Ephemeris dosyaları boyutu (~50MB)**
- **Çözüm:** Sadece gerekli dosyaları yükle (1800-2400 yılları)
- **Alternatif:** CDN kullanımı veya lazy loading

**Sorun 3: Vercel serverless function limitleri**
- **Çözüm:** Caching stratejisi (aynı doğum tarihi için tekrar hesaplama yapma)
- **Database cache:** `NatalChart` modeli

**Sorun 4: Koordinat belirleme**
- **Çözüm:** Manuel koordinat girişi + şehir listesi
- **Gelecek:** Google Places API entegrasyonu

---

### ⏳ Özellik 9: Günlük (Journal) Sistemi

**Öncelik:** ORTA  
**Tahmini Süre:** 3-4 saat  
**Durum:** Planlama aşamasında  
**Bağımlılık:** Özellik 8 (Swiss Ephemeris) tamamlanmalı

#### 📌 Hedefler

1. **Günlük Tutma:** Kullanıcıların günlük yazması ve saklaması
2. **Ruh Hali Takibi:** Mood selector ile duygusal durum kaydı
3. **Astrolojik Analiz:** Swiss Ephemeris ile o günün transit'lerini hesaplama
4. **AI Yorumlama:** Gemini AI ile günlük + transit analizi
5. **Takvim Görünümü:** Geçmiş günlükleri takvimde görüntüleme

#### 🔧 Teknik Detaylar

**Kullanılacak Kütüphaneler:**
- `react-calendar` veya `@fullcalendar/react` (Takvim)
- `@tiptap/react` veya `react-quill` (Rich text editor - opsiyonel)
- Swiss Ephemeris (Özellik 8'den)
- Gemini AI (Mevcut)

#### 📋 Yapılacaklar Listesi

**1. Database Schema Güncellemesi**
- [ ] Prisma schema'ya `JournalEntry` modeli ekle
```prisma
model JournalEntry {
  id        String   @id @default(cuid())
  userId    String
  date      DateTime
  title     String?
  content   String   @db.Text
  mood      String?  // "happy", "sad", "anxious", "neutral", "excited"
  tags      String[] // ["work", "relationship", "health", "spiritual"]
  
  // Astrolojik veriler (o günün transit'leri - cache)
  transitData Json?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user User @relation(...)
  
  @@index([userId, date])
}
```
- [ ] User modeline `journalEntries` relation ekle
- [ ] Migration oluştur: `npx prisma migrate dev --name add_journal_entry`

**2. API Endpoint'leri**
- [ ] `POST /api/journal/create` - Yeni günlük oluştur
- [ ] `GET /api/journal/list` - Kullanıcının tüm günlüklerini getir (pagination)
- [ ] `GET /api/journal/[id]` - Tek günlük detayı
- [ ] `PUT /api/journal/[id]` - Günlük güncelle
- [ ] `DELETE /api/journal/[id]` - Günlük sil
- [ ] `POST /api/journal/analyze` - Günlük + transit analizi (Gemini AI)
- [ ] `GET /api/journal/calendar` - Takvim için günlük özeti

**3. Frontend - Günlük Yazma Sayfası**
- [ ] `/app/journal/new/page.tsx` oluştur
- [ ] Tarih seçici (default: bugün)
- [ ] Başlık girişi
- [ ] İçerik editörü (textarea veya rich text)
- [ ] Ruh hali seçici (emoji veya dropdown)
- [ ] Etiket (tags) seçici/oluşturucu
- [ ] Kaydet butonu
- [ ] "Transit'leri Göster" butonu

**4. Frontend - Günlük Listesi Sayfası**
- [ ] `/app/journal/page.tsx` oluştur
- [ ] Günlük listesi (pagination)
- [ ] Arama ve filtreleme (tarih, mood, tags)
- [ ] Takvim görünümü toggle
- [ ] "Yeni Günlük" butonu

**5. Frontend - Günlük Detay Sayfası**
- [ ] `/app/journal/[id]/page.tsx` oluştur
- [ ] Günlük içeriği görüntüleme
- [ ] O günün transit'leri bölümü
- [ ] Gemini AI analizi bölümü
- [ ] Düzenle/Sil butonları

**6. Frontend - Takvim Görünümü**
- [ ] `/components/journal/calendar-view.tsx` oluştur
- [ ] Günlüklü günleri işaretle
- [ ] Mood renklerine göre renklendirme
- [ ] Günlük önizleme (hover/click)

**7. Frontend - Bileşenler**
- [ ] `/components/journal/journal-form.tsx`
- [ ] `/components/journal/mood-selector.tsx`
- [ ] `/components/journal/tag-input.tsx`
- [ ] `/components/journal/journal-card.tsx`
- [ ] `/components/journal/transit-summary.tsx`
- [ ] `/components/journal/ai-analysis.tsx`

**8. Gemini AI Entegrasyonu**
- [ ] `/lib/gemini.ts` güncelle
- [ ] Günlük analizi prompt'u
```
Kullanıcının günlüğü: "{content}"
Ruh hali: {mood}
Bugünün transit'leri:
- Ay: {moonSign} {moonDegree}°
- Güneş: {sunSign} {sunDegree}°
- Önemli aspect'ler: {aspects}

Bu verilere göre:
1. Kullanıcının ruh halini astrolojik açıdan açıkla
2. Transit'lerin etkisini yorumla
3. Öneriler sun
```

**9. Transit Hesaplaması**
- [ ] `/lib/swisseph.ts` güncelle (Özellik 8'den)
- [ ] Günlük kaydedilirken o günün transit'lerini hesapla
- [ ] `transitData` JSON olarak sakla (cache)

**10. shadcn/ui Bileşenleri**
- [ ] Calendar bileşeni ekle: `npx shadcn@latest add calendar`
- [ ] Textarea bileşeni ekle: `npx shadcn@latest add textarea`
- [ ] Badge bileşeni ekle: `npx shadcn@latest add badge`
- [ ] Popover bileşeni ekle: `npx shadcn@latest add popover`

**11. Test ve Optimizasyon**
- [ ] CRUD işlemleri testi
- [ ] Transit hesaplama testi
- [ ] AI analizi testi
- [ ] Build testi: `npm run build`
- [ ] TypeScript kontrolü: `npx tsc --noEmit`
- [ ] ESLint kontrolü: `npm run lint`

**12. Dokümantasyon ve Commit**
- [ ] `FEATURE_9_REPORT.md` oluştur
- [ ] README.md güncelle
- [ ] Git commit: "feat: add Journal system with transit analysis and AI interpretation"
- [ ] GitHub push
- [ ] Vercel deployment kontrolü

#### 🎨 UI/UX Tasarım Notları

**Mood Selector:**
- 😊 Happy (Mutlu) - Yeşil
- 😢 Sad (Üzgün) - Mavi
- 😰 Anxious (Endişeli) - Turuncu
- 😐 Neutral (Nötr) - Gri
- 🤩 Excited (Heyecanlı) - Sarı

**Tag Renkleri:**
- Work (İş) - Mavi
- Relationship (İlişki) - Pembe
- Health (Sağlık) - Yeşil
- Spiritual (Manevi) - Mor
- Personal (Kişisel) - Turuncu

**Takvim Görünümü:**
- Günlüklü günler: Bold + mood rengi
- Bugün: Border highlight
- Hover: Günlük önizleme (başlık + mood)

---

## 📅 Geliştirme Takvimi

### Faz 1: Swiss Ephemeris Entegrasyonu (4-5 saat)

**Gün 1 (2-3 saat):**
- Kurulum ve yapılandırma
- Backend wrapper oluşturma
- API endpoint'leri
- Database schema güncellemesi

**Gün 2 (2 saat):**
- Frontend sayfaları ve bileşenler
- Gemini AI entegrasyonu
- Test ve optimizasyon
- Commit ve push

### Faz 2: Günlük (Journal) Sistemi (3-4 saat)

**Gün 3 (2 saat):**
- Database schema güncellemesi
- API endpoint'leri
- Transit hesaplama entegrasyonu

**Gün 4 (1-2 saat):**
- Frontend sayfaları ve bileşenler
- Takvim görünümü
- Gemini AI analizi
- Test ve optimizasyon
- Commit ve push

### Toplam Süre: 7-9 saat

---

## ✅ Başarı Kriterleri

### Özellik 8: Swiss Ephemeris

- [ ] `sweph` paketi başarıyla yüklendi
- [ ] Ephemeris dosyaları yapılandırıldı
- [ ] Doğum haritası hesaplamaları çalışıyor
- [ ] API endpoint'leri çalışıyor
- [ ] Frontend sayfaları render ediliyor
- [ ] Gemini AI yorumlamaları çalışıyor
- [ ] Build başarılı (hatasız)
- [ ] TypeScript hatasız
- [ ] ESLint hatasız
- [ ] GitHub'a push edildi
- [ ] Vercel'de deploy edildi

### Özellik 9: Günlük (Journal)

- [ ] Database migration başarılı
- [ ] CRUD API endpoint'leri çalışıyor
- [ ] Günlük yazma sayfası çalışıyor
- [ ] Günlük listesi sayfası çalışıyor
- [ ] Takvim görünümü çalışıyor
- [ ] Transit hesaplamaları çalışıyor
- [ ] Gemini AI analizi çalışıyor
- [ ] Build başarılı (hatasız)
- [ ] TypeScript hatasız
- [ ] ESLint hatasız
- [ ] GitHub'a push edildi
- [ ] Vercel'de deploy edildi

---

## 🎯 Proje Tamamlanma Hedefi

**Başlangıç:** %77.7 (7/9 özellik)  
**Hedef:** %100 (9/9 özellik)  
**Kalan:** %22.3 (2 özellik)

**Tahmini Tamamlanma:** 2-3 gün (7-9 saat çalışma)

---

## 📝 Önemli Notlar

### Geliştirme Prensipleri

1. ✅ **Mevcut kod yapısını koruma:** Hiçbir tamamlanmış özellik bozulmayacak
2. ✅ **Adım adım ilerleme:** Her özellik tamamen bitirildikten sonra bir sonrakine geç
3. ✅ **Test-driven:** Her commit'ten önce build, TypeScript ve ESLint testleri
4. ✅ **Dokümantasyon:** Her özellik için detaylı rapor oluştur
5. ✅ **Git best practices:** Anlamlı commit mesajları (Conventional Commits)

### Teknoloji Seçimleri

**Swiss Ephemeris:**
- ✅ `sweph@latest` (en güncel ve stabil)
- ❌ `swisseph` (eski, önerilmez)
- ⚠️ `sweph-wasm` (browser uyumlu ama SSR sorunlu olabilir)

**Gemini AI:**
- ✅ Google Gemini 2.5 Flash (mevcut)
- ✅ Profesyonel yorumlama için prompt engineering

### Lisanslama

**Swiss Ephemeris:**
- AGPL-3.0: `sweph@latest` (v2.10.1+)
- GPL-2.0: `sweph@gpl` (v2.10.0 ve öncesi)
- LGPL-3.0: Profesyonel lisans sahipleri için

**Proje:** MIT Lisansı (mevcut)

---

## 🔗 Referanslar

**Resmi Dokümantasyon:**
- Swiss Ephemeris: https://www.astro.com/swisseph/
- sweph GitHub: https://github.com/timotejroiko/sweph
- Prisma: https://www.prisma.io/docs
- Next.js: https://nextjs.org/docs

**Proje Dosyaları:**
- `README.md` - Proje açıklaması
- `ROADMAP_UPDATED.md` - Güncel roadmap
- `SWISS_EPHEMERIS_RESEARCH.md` - Swiss Ephemeris araştırması
- `CURRENT_STATUS.md` - Güncel durum raporu

---

**Hazırlayan:** Salih TANRISEVEN  
**E-posta:** salihtanriseven25@gmail.com  
**GitHub:** @sata2500  
**Tarih:** 11 Kasım 2025  
**Versiyon:** 1.0
