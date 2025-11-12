# Az-Horoscope: Yeni Özellik Fikirleri ve Teknik Spesifikasyonlar

**Tarih:** 12 Kasım 2025  
**Durum:** Planlama Aşaması

---

## 🎨 Özellik 1: Kullanıcı Bildirimleri Sistemi

### Genel Bakış
Kullanıcılara önemli olaylar hakkında gerçek zamanlı ve zamanlanmış bildirimler gönderen bir sistem.

### Teknik Detaylar

**Veritabanı Şeması (Prisma):**
```prisma
model Notification {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type        NotificationType
  title       String
  message     String
  read        Boolean  @default(false)
  actionUrl   String?
  createdAt   DateTime @default(now())
  
  @@index([userId, read])
}

enum NotificationType {
  JOURNAL_ANALYSIS
  TRANSIT_ALERT
  WEEKLY_REMINDER
  MONTHLY_REMINDER
  SYSTEM
}
```

**API Endpoint'leri:**
- `GET /api/notifications` - Kullanıcının bildirimlerini getir
- `PATCH /api/notifications/:id/read` - Bildirimi okundu olarak işaretle
- `DELETE /api/notifications/:id` - Bildirimi sil
- `POST /api/notifications/mark-all-read` - Tümünü okundu işaretle

**Frontend Bileşenleri:**
- `components/notifications/notification-bell.tsx` - Header'da bildirim ikonu
- `components/notifications/notification-list.tsx` - Bildirim listesi
- `components/notifications/notification-item.tsx` - Tek bildirim

**Özellikler:**
- Real-time bildirimler (Server-Sent Events veya WebSocket)
- Bildirim sesleri (isteğe bağlı)
- Bildirim tercihleri (hangi tür bildirimleri almak istediği)
- Desktop bildirimleri (Web Push API)

**Tahmini Süre:** 3-4 gün

---

## 💑 Özellik 2: Burç Uyumluluğu Hesaplayıcı

### Genel Bakış
İki burç arasındaki uyumluluğu analiz eden ve AI destekli yorumlar sunan bir araç.

### Teknik Detaylar

**Veritabanı Şeması:**
```prisma
model CompatibilityReport {
  id          String   @id @default(cuid())
  userId      String?
  user        User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  sign1       String
  sign2       String
  overall     Int      // 0-100 arası skor
  love        Int
  friendship  Int
  work        Int
  analysis    String   @db.Text
  strengths   String[]
  weaknesses  String[]
  advice      String   @db.Text
  createdAt   DateTime @default(now())
  
  @@index([userId])
}
```

**API Endpoint'leri:**
- `POST /api/compatibility` - Uyumluluk analizi oluştur
- `GET /api/compatibility/history` - Geçmiş analizler

**Frontend Sayfası:**
- `app/compatibility/page.tsx` - Ana sayfa
- İki burç seçimi (dropdown)
- Analiz butonu
- Sonuç kartları (overall, love, friendship, work)
- AI yorumu
- Paylaşma butonu

**AI Prompt Şablonu:**
```typescript
const prompt = `
İki burç arasındaki uyumluluğu analiz et:
- Burç 1: ${sign1}
- Burç 2: ${sign2}

Aşağıdaki kategorilerde 0-100 arası skor ver ve detaylı analiz yap:
1. Genel Uyumluluk
2. Aşk ve Romantizm
3. Arkadaşlık
4. İş Hayatı

Güçlü yönleri ve zayıf yönleri listele.
İlişkiyi geliştirmek için tavsiyeler ver.
`
```

**Tahmini Süre:** 2-3 gün

---

## 📊 Özellik 3: Günlük İstatistikleri ve Grafikler

### Genel Bakış
Kullanıcının ruh hali trendlerini ve gezegen geçişleri ile korelasyonunu görselleştiren analitik dashboard.

### Teknik Detaylar

**Kullanılacak Kütüphaneler:**
```bash
npm install recharts date-fns
```

**API Endpoint'leri:**
- `GET /api/journal/stats` - İstatistikler
  - Query params: `startDate`, `endDate`, `period` (weekly, monthly, yearly)

**Frontend Sayfası:**
- `app/journal/stats/page.tsx`

**Grafikler:**
1. **Ruh Hali Trend Grafiği** (Line Chart)
   - X ekseni: Tarih
   - Y ekseni: Ruh hali (1-10)
   - Ortalama çizgisi

2. **Etiket Bulutu** (Word Cloud)
   - En sık kullanılan etiketler
   - Boyut: Kullanım sıklığı

3. **Gezegen Korelasyon Matrisi** (Heatmap)
   - Hangi gezegen pozisyonlarında ruh hali nasıl?
   - Renk skalası: Düşük (kırmızı) → Yüksek (yeşil)

4. **Aylık Özet** (Bar Chart)
   - Her ay için ortalama ruh hali
   - En iyi ve en kötü günler

**Örnek API Response:**
```json
{
  "summary": {
    "totalEntries": 45,
    "averageMood": 7.2,
    "bestDay": "2025-11-05",
    "worstDay": "2025-10-20"
  },
  "moodTrend": [
    { "date": "2025-11-01", "mood": 8 },
    { "date": "2025-11-02", "mood": 7 }
  ],
  "topTags": [
    { "tag": "mutlu", "count": 12 },
    { "tag": "yorgun", "count": 8 }
  ],
  "planetCorrelation": {
    "mercury": { "averageMood": 7.5, "count": 10 },
    "venus": { "averageMood": 8.2, "count": 8 }
  }
}
```

**Tahmini Süre:** 4-5 gün

---

## ⭐ Özellik 4: Favori Burç Yorumları

### Genel Bakış
Kullanıcıların beğendikleri burç yorumlarını kaydetme ve yönetme sistemi.

### Teknik Detaylar

**Veritabanı Şeması:**
```prisma
model FavoriteHoroscope {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  sign        String
  period      String   // daily, weekly, monthly
  content     String   @db.Text
  date        DateTime
  note        String?  @db.Text
  createdAt   DateTime @default(now())
  
  @@unique([userId, sign, period, date])
  @@index([userId])
}
```

**API Endpoint'leri:**
- `POST /api/favorites/horoscope` - Favorilere ekle
- `GET /api/favorites/horoscope` - Favorileri listele
- `DELETE /api/favorites/horoscope/:id` - Favoriden kaldır
- `PATCH /api/favorites/horoscope/:id` - Not güncelle

**Frontend Bileşenleri:**
- Burç yorumu kartlarına "Favorilere Ekle" butonu
- `app/favorites/page.tsx` - Favori yorumlar sayfası
- Filtreleme (burç, dönem, tarih)
- Arama
- Not ekleme modal'ı

**Tahmini Süre:** 2 gün

---

## 👥 Özellik 5: Sosyal Özellikler

### Genel Bakış
Kullanıcıların birbirleriyle etkileşime girmesini sağlayan sosyal platform özellikleri.

### Teknik Detaylar

**Veritabanı Şeması:**
```prisma
model UserProfile {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  bio         String?  @db.Text
  isPublic    Boolean  @default(false)
  showBirthChart Boolean @default(false)
  followers   Follow[] @relation("followers")
  following   Follow[] @relation("following")
}

model Follow {
  id          String   @id @default(cuid())
  followerId  String
  follower    UserProfile @relation("following", fields: [followerId], references: [id], onDelete: Cascade)
  followingId String
  following   UserProfile @relation("followers", fields: [followingId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  
  @@unique([followerId, followingId])
}

model JournalComment {
  id          String   @id @default(cuid())
  journalId   String
  journal     JournalEntry @relation(fields: [journalId], references: [id], onDelete: Cascade)
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  content     String   @db.Text
  createdAt   DateTime @default(now())
  
  @@index([journalId])
}

model JournalLike {
  id          String   @id @default(cuid())
  journalId   String
  journal     JournalEntry @relation(fields: [journalId], references: [id], onDelete: Cascade)
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  
  @@unique([journalId, userId])
}
```

**API Endpoint'leri:**
- `GET /api/users/:id/profile` - Kullanıcı profili
- `PATCH /api/users/profile` - Profil güncelle
- `POST /api/users/:id/follow` - Takip et
- `DELETE /api/users/:id/unfollow` - Takibi bırak
- `GET /api/users/:id/followers` - Takipçiler
- `GET /api/users/:id/following` - Takip edilenler
- `GET /api/feed` - Sosyal feed (takip edilenlerin günlükleri)
- `POST /api/journal/:id/like` - Beğen
- `POST /api/journal/:id/comment` - Yorum yap
- `GET /api/journal/:id/comments` - Yorumları getir

**Frontend Sayfaları:**
- `app/users/[id]/page.tsx` - Kullanıcı profili
- `app/feed/page.tsx` - Sosyal feed
- `app/profile/edit/page.tsx` - Profil düzenleme

**Gizlilik Ayarları:**
- Public: Herkes görebilir
- Followers Only: Sadece takipçiler
- Private: Sadece kendisi

**Tahmini Süre:** 2-3 hafta

---

## 💎 Özellik 6: Premium Üyelik Sistemi

### Genel Bakış
Gelir modeli oluşturmak için Stripe entegrasyonlu premium üyelik sistemi.

### Teknik Detaylar

**Veritabanı Şeması:**
```prisma
model Subscription {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  stripeCustomerId String  @unique
  stripePriceId   String
  stripeSubscriptionId String @unique
  status          SubscriptionStatus
  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  cancelAtPeriodEnd  Boolean @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
  PAST_DUE
  UNPAID
  TRIALING
}
```

**Stripe Kurulumu:**
```bash
npm install stripe @stripe/stripe-js
```

**API Endpoint'leri:**
- `POST /api/stripe/create-checkout-session` - Ödeme sayfası oluştur
- `POST /api/stripe/webhook` - Stripe webhook'ları
- `POST /api/stripe/create-portal-session` - Abonelik yönetim portalı
- `GET /api/subscription/status` - Abonelik durumu

**Premium Özellikler:**
1. **Detaylı Doğum Haritası**
   - Evler analizi
   - Açılar (Ascendant, Midheaven)
   - Kuzey/Güney Düğüm
   - Chiron

2. **Sinastri Analizi**
   - İki kişinin doğum haritası karşılaştırması
   - İlişki dinamikleri
   - Uyumluluk skorları

3. **Transit Raporları**
   - Gelecek 6 ay için gezegen geçişleri
   - Önemli tarihler
   - Fırsat ve zorluklar

4. **Reklamsız Deneyim**

5. **Öncelikli AI Analizi**
   - Daha hızlı yanıt süresi
   - Daha detaylı yorumlar

6. **Özel Temalar**
   - Dark/Light'tan fazlası
   - Renk özelleştirme

**Fiyatlandırma Önerisi:**
- **Aylık:** ₺49.99
- **Yıllık:** ₺399.99 (2 ay bedava)
- **7 Günlük Ücretsiz Deneme**

**Tahmini Süre:** 3-4 hafta

---

## 🌍 Özellik 7: Uluslararasılaştırma (i18n)

### Genel Bakış
Platformu çoklu dil desteği ile global hale getirme.

### Teknik Detaylar

**Kütüphane Kurulumu:**
```bash
npm install next-intl
```

**Desteklenecek Diller:**
- 🇹🇷 Türkçe (mevcut)
- 🇬🇧 İngilizce
- 🇪🇸 İspanyolca
- 🇫🇷 Fransızca

**Klasör Yapısı:**
```
messages/
├── tr.json
├── en.json
├── es.json
└── fr.json
```

**Çeviri Dosyası Örneği (en.json):**
```json
{
  "common": {
    "welcome": "Welcome",
    "login": "Login",
    "logout": "Logout"
  },
  "horoscope": {
    "daily": "Daily Horoscope",
    "weekly": "Weekly Horoscope",
    "monthly": "Monthly Horoscope"
  },
  "zodiac": {
    "aries": "Aries",
    "taurus": "Taurus"
  }
}
```

**Yapılacaklar:**
1. Tüm metinleri çeviri dosyalarına taşı
2. Dil seçici bileşeni ekle (header'da)
3. AI yorumlarını seçilen dilde oluştur
4. Tarih formatlarını lokalize et
5. SEO için hreflang etiketleri ekle

**Tahmini Süre:** 2-3 hafta

---

## 📝 Özellik 8: Blog/İçerik Yönetim Sistemi

### Genel Bakış
Astroloji ile ilgili makaleler yayınlamak için CMS.

### Teknik Detaylar

**Veritabanı Şeması:**
```prisma
model BlogPost {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  excerpt     String
  content     String   @db.Text
  coverImage  String?
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  published   Boolean  @default(false)
  publishedAt DateTime?
  views       Int      @default(0)
  categories  BlogCategory[]
  tags        BlogTag[]
  comments    BlogComment[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([slug])
  @@index([published])
}

model BlogCategory {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  posts       BlogPost[]
}

model BlogTag {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  posts       BlogPost[]
}

model BlogComment {
  id          String   @id @default(cuid())
  postId      String
  post        BlogPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  content     String   @db.Text
  approved    Boolean  @default(false)
  createdAt   DateTime @default(now())
  
  @@index([postId])
}
```

**API Endpoint'leri:**
- `GET /api/blog` - Makaleleri listele
- `GET /api/blog/:slug` - Makale detayı
- `POST /api/blog` - Yeni makale (admin)
- `PATCH /api/blog/:id` - Makale güncelle (admin)
- `DELETE /api/blog/:id` - Makale sil (admin)
- `POST /api/blog/:id/comment` - Yorum yap

**Frontend Sayfaları:**
- `app/blog/page.tsx` - Blog ana sayfa
- `app/blog/[slug]/page.tsx` - Makale detay
- `app/admin/blog/page.tsx` - Admin: Makale listesi
- `app/admin/blog/new/page.tsx` - Admin: Yeni makale
- `app/admin/blog/[id]/edit/page.tsx` - Admin: Makale düzenle

**Markdown Editör:**
```bash
npm install @uiw/react-md-editor
```

**SEO Optimizasyonu:**
- Open Graph tags
- Twitter Card tags
- JSON-LD structured data
- Sitemap.xml otomatik oluşturma

**Tahmini Süre:** 2-3 hafta

---

## 📱 Özellik 9: Mobil Uygulama

### Genel Bakış
iOS ve Android için native mobil uygulama.

### Teknoloji Seçimi

**Seçenek 1: React Native**
- Artılar: React bilgisi yeterli, kod paylaşımı
- Eksiler: Performans, native özellikler sınırlı

**Seçenek 2: Flutter**
- Artılar: Yüksek performans, güzel UI
- Eksiler: Dart öğrenme eğrisi

**Öneri:** React Native (mevcut kod tabanıyla uyumlu)

### Özellikler
- Push notifications
- Offline mode (günlükleri offline kaydet)
- Widget'lar (günlük burç)
- Biometric authentication
- Dark/Light mode

### Tahmini Süre
2-3 ay (full-time)

---

## 🤖 Özellik 10: AI Chatbot

### Genel Bakış
Kullanıcıların astroloji hakkında soru sorabileceği AI destekli chatbot.

### Teknik Detaylar

**Veritabanı Şeması:**
```prisma
model ChatConversation {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title       String
  messages    ChatMessage[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([userId])
}

model ChatMessage {
  id              String   @id @default(cuid())
  conversationId  String
  conversation    ChatConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  role            MessageRole
  content         String   @db.Text
  createdAt       DateTime @default(now())
  
  @@index([conversationId])
}

enum MessageRole {
  USER
  ASSISTANT
  SYSTEM
}
```

**API Endpoint'leri:**
- `POST /api/chat` - Yeni mesaj gönder
- `GET /api/chat/conversations` - Sohbet geçmişi
- `GET /api/chat/:id` - Sohbet detayı
- `DELETE /api/chat/:id` - Sohbet sil

**AI Prompt Şablonu:**
```typescript
const systemPrompt = `
Sen Az-Horoscope platformunun AI asistanısın. 
Kullanıcının astroloji hakkındaki sorularını cevapla.

Kullanıcı Bilgileri:
- Burç: ${user.zodiacSign}
- Doğum Tarihi: ${user.birthDate}
- Doğum Saati: ${user.birthTime}

Kurallar:
1. Dostça ve yardımsever ol
2. Astroloji bilgilerini doğru aktar
3. Profesyonel tavsiye verme (tıbbi, hukuki vb.)
4. Kısa ve öz cevaplar ver
`
```

**Frontend:**
- `app/chat/page.tsx` - Chat arayüzü
- Real-time mesajlaşma (streaming)
- Sesli asistan (Web Speech API)
- Önceki sohbetler

**Tahmini Süre:** 1-2 ay

---

## 🎯 Öncelik Matrisi

| Özellik | Değer | Efor | Öncelik |
|:---|:---:|:---:|:---:|
| Bildirimler | Yüksek | Düşük | **P0** |
| Uyumluluk | Orta | Düşük | **P1** |
| İstatistikler | Yüksek | Orta | **P1** |
| Favoriler | Orta | Düşük | **P1** |
| Sosyal | Yüksek | Yüksek | **P2** |
| Premium | Çok Yüksek | Yüksek | **P2** |
| i18n | Yüksek | Orta | **P2** |
| Blog/CMS | Orta | Orta | **P3** |
| Mobil | Yüksek | Çok Yüksek | **P3** |
| AI Chatbot | Yüksek | Yüksek | **P3** |

---

**Son Güncelleme:** 12 Kasım 2025  
**Hazırlayan:** Manus AI
