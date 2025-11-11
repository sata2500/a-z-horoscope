# 🚀 Az-Horoscope Geliştirme Roadmap

**Proje:** Az-Horoscope  
**Geliştirici:** Salih TANRISEVEN  
**Başlangıç:** 11 Kasım 2025  
**Strateji:** Adım adım, her özellik tamamen bitirildikten sonra bir sonrakine geç

---

## 📊 Mevcut Durum Analizi

### ✅ Tamamlanan Özellikler
- [x] Next.js 16 + React 19 altyapısı
- [x] Google OAuth ile giriş
- [x] PostgreSQL (Neon) veritabanı
- [x] Prisma ORM
- [x] Dark/Light tema (next-themes)
- [x] shadcn/ui bileşenleri
- [x] Gemini AI entegrasyonu
- [x] Günlük burç yorumu
- [x] Burç uyumluluk analizi
- [x] Ana sayfa
- [x] Login sayfası
- [x] Dashboard
- [x] Horoscope sayfası
- [x] Profil sayfası (temel)

### ❌ Eksik Özellikler
- [ ] Kullanıcının burç bilgisini kaydetme
- [ ] Geçmiş yorumları görüntüleme
- [ ] Haftalık/Aylık yorumlar
- [ ] Favori yorumlar
- [ ] Burç detay sayfaları
- [ ] E-posta bildirimleri
- [ ] Admin paneli
- [ ] Sosyal paylaşım
- [ ] Kullanıcı istatistikleri

---

## 🎯 Geliştirme Rotası

Her özellik için:
1. ✅ Database schema güncelleme
2. ✅ API endpoint'leri
3. ✅ Frontend bileşenleri
4. ✅ Test (npm run build)
5. ✅ GitHub commit
6. ✅ Bir sonraki özelliğe geç

---

## 📋 Özellik Listesi (Öncelik Sırasına Göre)

### 🟢 Faz 1: Temel Kullanıcı Deneyimi (1-3. Özellikler)

#### Özellik 1: Profil Sayfasında Burç Seçimi ve Kaydetme
**Öncelik:** YÜKSEK  
**Süre:** ~30 dakika  
**Açıklama:** Kullanıcı doğum tarihini girerek burcunu otomatik hesaplasın ve kaydedebilsin.

**Yapılacaklar:**
- [ ] Prisma schema'ya `birthDate` ve `zodiacSign` ekle
- [ ] API endpoint: `POST /api/user/update-zodiac`
- [ ] Profil sayfasına doğum tarihi input formu ekle
- [ ] Otomatik burç hesaplama fonksiyonu
- [ ] Burç bilgisini güncelleme
- [ ] Test ve commit

**Dosyalar:**
- `prisma/schema.prisma` (güncelle)
- `app/api/user/update-zodiac/route.ts` (yeni)
- `app/profile/page.tsx` (güncelle)
- `lib/zodiac.ts` (güncelle)

---

#### Özellik 2: Geçmiş Burç Yorumlarını Görüntüleme
**Öncelik:** YÜKSEK  
**Süre:** ~45 dakika  
**Açıklama:** Kullanıcının daha önce aldığı tüm burç yorumlarını tarih sırasına göre listeleyebilsin.

**Yapılacaklar:**
- [ ] Dashboard'a "Geçmiş Yorumlar" sekmesi ekle
- [ ] API endpoint: `GET /api/horoscope/history`
- [ ] Yorum listesi bileşeni
- [ ] Pagination (sayfalama)
- [ ] Filtreleme (tarih, burç)
- [ ] Test ve commit

**Dosyalar:**
- `app/api/horoscope/history/route.ts` (yeni)
- `app/dashboard/page.tsx` (güncelle)
- `components/horoscope/reading-history.tsx` (yeni)

---

#### Özellik 3: Haftalık ve Aylık Burç Yorumları
**Öncelik:** ORTA  
**Süre:** ~1 saat  
**Açıklama:** Günlük yorumlara ek olarak haftalık ve aylık yorumlar da alabilsin.

**Yapılacaklar:**
- [ ] Prisma schema'ya `readingType` enum ekle (daily, weekly, monthly)
- [ ] API endpoint: `POST /api/horoscope/weekly`
- [ ] API endpoint: `POST /api/horoscope/monthly`
- [ ] Gemini prompt'ları güncelle (daha uzun yorumlar için)
- [ ] Horoscope sayfasına tab ekle (Günlük/Haftalık/Aylık)
- [ ] Test ve commit

**Dosyalar:**
- `prisma/schema.prisma` (güncelle)
- `app/api/horoscope/weekly/route.ts` (yeni)
- `app/api/horoscope/monthly/route.ts` (yeni)
- `app/horoscope/page.tsx` (güncelle)
- `lib/gemini.ts` (güncelle)

---

### 🟡 Faz 2: Sosyal ve Kişiselleştirme (4-5. Özellikler)

#### Özellik 4: Favori Yorumları Kaydetme ve Paylaşma
**Öncelik:** ORTA  
**Süre:** ~1 saat  
**Açıklama:** Beğenilen yorumları favorilere ekleyebilsin ve sosyal medyada paylaşabilsin.

**Yapılacaklar:**
- [ ] Prisma schema'ya `isFavorite` boolean ekle
- [ ] API endpoint: `POST /api/horoscope/favorite`
- [ ] Favori butonu bileşeni
- [ ] Favoriler sayfası
- [ ] Sosyal medya paylaşım butonları (Twitter, Facebook, WhatsApp)
- [ ] Test ve commit

**Dosyalar:**
- `prisma/schema.prisma` (güncelle)
- `app/api/horoscope/favorite/route.ts` (yeni)
- `app/favorites/page.tsx` (yeni)
- `components/horoscope/share-buttons.tsx` (yeni)

---

#### Özellik 5: Burç Detay Sayfaları
**Öncelik:** ORTA  
**Süre:** ~1.5 saat  
**Açıklama:** Her burç için detaylı bilgi sayfası (özellikler, uyumlu burçlar, ünlüler, vb.)

**Yapılacaklar:**
- [ ] `/horoscope/[sign]` dynamic route oluştur
- [ ] Burç detay sayfası tasarımı
- [ ] Uyumlu burçlar bölümü
- [ ] Ünlü kişiler (o burçtan)
- [ ] Element, gezegen, taş, renk bilgileri
- [ ] Test ve commit

**Dosyalar:**
- `app/horoscope/[sign]/page.tsx` (yeni)
- `lib/zodiac.ts` (güncelle - daha fazla veri ekle)
- `components/horoscope/zodiac-detail.tsx` (yeni)

---

### 🔵 Faz 3: İleri Seviye Özellikler (6-7. Özellikler)

#### Özellik 6: Bildirim Tercihleri ve E-posta Gönderimi
**Öncelik:** DÜŞÜK  
**Süre:** ~2 saat  
**Açıklama:** Kullanıcı günlük/haftalık burç yorumlarını e-posta ile alabilsin.

**Yapılacaklar:**
- [ ] Prisma schema'ya `emailNotifications` boolean ekle
- [ ] Profil sayfasına bildirim tercihleri ekle
- [ ] Resend veya SendGrid entegrasyonu
- [ ] E-posta template'leri (HTML)
- [ ] Cron job (günlük/haftalık e-posta gönderimi)
- [ ] Test ve commit

**Dosyalar:**
- `prisma/schema.prisma` (güncelle)
- `app/api/user/notification-settings/route.ts` (yeni)
- `lib/email.ts` (yeni)
- `emails/daily-horoscope.tsx` (yeni)

---

#### Özellik 7: Admin Paneli ve İçerik Yönetimi
**Öncelik:** DÜŞÜK  
**Süre:** ~3 saat  
**Açıklama:** Admin kullanıcılar için özel panel (kullanıcı yönetimi, istatistikler, vb.)

**Yapılacaklar:**
- [ ] Prisma schema'ya `role` enum ekle (user, admin)
- [ ] Admin middleware (sadece admin erişebilsin)
- [ ] `/admin` route'ları
- [ ] Kullanıcı listesi ve yönetimi
- [ ] İstatistikler (toplam kullanıcı, yorum sayısı, vb.)
- [ ] Grafik ve chart'lar (Recharts)
- [ ] Test ve commit

**Dosyalar:**
- `prisma/schema.prisma` (güncelle)
- `app/admin/page.tsx` (yeni)
- `app/admin/users/page.tsx` (yeni)
- `app/admin/stats/page.tsx` (yeni)
- `components/admin/user-table.tsx` (yeni)

---

## 📊 Geliştirme Takvimi

| Özellik | Öncelik | Süre | Durum |
|---------|---------|------|-------|
| 1. Profil - Burç Seçimi | 🟢 YÜKSEK | 30 dk | ⏳ Bekliyor |
| 2. Geçmiş Yorumlar | 🟢 YÜKSEK | 45 dk | ⏳ Bekliyor |
| 3. Haftalık/Aylık Yorumlar | 🟡 ORTA | 1 saat | ⏳ Bekliyor |
| 4. Favori ve Paylaşım | 🟡 ORTA | 1 saat | ⏳ Bekliyor |
| 5. Burç Detay Sayfaları | 🟡 ORTA | 1.5 saat | ⏳ Bekliyor |
| 6. E-posta Bildirimleri | 🔵 DÜŞÜK | 2 saat | ⏳ Bekliyor |
| 7. Admin Paneli | 🔵 DÜŞÜK | 3 saat | ⏳ Bekliyor |

**Toplam Tahmini Süre:** ~9.75 saat

---

## 🎯 Her Özellik İçin Standart İş Akışı

### 1. Planlama (5 dk)
- Özellik gereksinimlerini netleştir
- Hangi dosyaların değişeceğini belirle
- Database değişikliklerini planla

### 2. Database (10 dk)
- Prisma schema güncelle
- Migration oluştur ve uygula
- Prisma Client yeniden oluştur

### 3. Backend (15-30 dk)
- API route'ları oluştur
- Zod validation ekle
- Error handling
- Test et (Postman/Thunder Client)

### 4. Frontend (20-45 dk)
- UI bileşenleri oluştur
- State management
- API entegrasyonu
- Responsive tasarım

### 5. Test (10 dk)
- `npm run lint` (ESLint)
- `npx tsc --noEmit` (TypeScript)
- `npm run build` (Build)
- Manuel test (tarayıcıda)

### 6. Commit (5 dk)
- Anlamlı commit mesajı
- GitHub'a push
- Vercel otomatik deploy

---

## 🔄 Güncellemeler

Bu dosya her özellik tamamlandıkça güncellenecek:

### ✅ Tamamlanan Özellikler
_Henüz yok_

### 🚧 Devam Eden
_Henüz yok_

### ⏳ Bekleyen
- Özellik 1-7 (yukarıda listelenmiş)

---

## 📝 Notlar

- Her özellik **tamamen bitirildikten** sonra bir sonrakine geçilecek
- Kullanıcı feedback'i alındıkça öncelikler değişebilir
- Yeni özellik fikirleri eklenebilir
- Performance ve UX her zaman öncelik

---

**Son Güncelleme:** 11 Kasım 2025  
**Durum:** Planlama Tamamlandı - Geliştirme Başlıyor


---

### 🔮 Faz 4: Profesyonel Astroloji Özellikleri (8-9. Özellikler)

#### Özellik 8: Swiss Ephemeris Entegrasyonu
**Öncelik:** YÜKSEK  
**Süre:** ~4 saat  
**Açıklama:** Profesyonel astroloji hesaplamaları için Swiss Ephemeris kütüphanesi entegrasyonu.

**Yapılacaklar:**
- [ ] `sweph` kütüphanesini yükle ve yapılandır
- [ ] Ephemeris dosyalarını indir ve public klasörüne ekle
- [ ] Doğum haritası (natal chart) hesaplama fonksiyonu
- [ ] Gezegen pozisyonları hesaplama
- [ ] Yükselen burç (Ascendant) hesaplama
- [ ] Evler (Houses) hesaplama
- [ ] API endpoint: `POST /api/astrology/natal-chart`
- [ ] API endpoint: `POST /api/astrology/transit`
- [ ] Gemini AI ile Swiss Ephemeris verilerini birleştir
- [ ] Profil sayfasına doğum haritası bölümü ekle
- [ ] Test ve commit

**Dosyalar:**
- `package.json` (sweph ekle)
- `lib/swisseph.ts` (yeni - Swiss Ephemeris wrapper)
- `app/api/astrology/natal-chart/route.ts` (yeni)
- `app/api/astrology/transit/route.ts` (yeni)
- `lib/gemini.ts` (güncelle - Swiss Ephemeris verilerini kullan)
- `app/profile/page.tsx` (güncelle - doğum haritası bölümü)
- `components/astrology/natal-chart.tsx` (yeni)
- `public/ephemeris/` (ephemeris dosyaları)

**Özellikler:**
- ✅ Gerçek astronomik verilerle burç hesaplamaları
- ✅ Doğum haritası (natal chart) görselleştirme
- ✅ Transit hesaplamaları (günlük gezegen hareketleri)
- ✅ Yükselen burç ve evler
- ✅ Ay düğümleri, Chiron, Lilith
- ✅ Gemini AI ile profesyonel yorumlama

---

#### Özellik 9: Günlük (Journal) Sistemi
**Öncelik:** ORTA  
**Süre:** ~3 saat  
**Açıklama:** Kullanıcıların günlük tutması ve astrolojik verilerle birleştirilmesi.

**Yapılacaklar:**
- [ ] Prisma schema: `JournalEntry` modeli ekle
- [ ] Migration oluştur ve uygula
- [ ] API endpoint: `POST /api/journal/create`
- [ ] API endpoint: `GET /api/journal/list`
- [ ] API endpoint: `GET /api/journal/:id`
- [ ] API endpoint: `PUT /api/journal/:id`
- [ ] API endpoint: `DELETE /api/journal/:id`
- [ ] Günlük yazma sayfası (`/journal/new`)
- [ ] Günlük listesi sayfası (`/journal`)
- [ ] Günlük detay sayfası (`/journal/[id]`)
- [ ] Ruh hali seçici (mood selector)
- [ ] Etiket (tags) sistemi
- [ ] Swiss Ephemeris ile o günün transit'lerini hesapla
- [ ] Gemini AI ile günlük + transit analizi
- [ ] Takvim görünümü (calendar view)
- [ ] Test ve commit

**Dosyalar:**
- `prisma/schema.prisma` (JournalEntry modeli ekle)
- `app/api/journal/create/route.ts` (yeni)
- `app/api/journal/list/route.ts` (yeni)
- `app/api/journal/[id]/route.ts` (yeni)
- `app/journal/page.tsx` (yeni - liste)
- `app/journal/new/page.tsx` (yeni - yeni günlük)
- `app/journal/[id]/page.tsx` (yeni - detay)
- `components/journal/entry-form.tsx` (yeni)
- `components/journal/entry-card.tsx` (yeni)
- `components/journal/mood-selector.tsx` (yeni)
- `components/journal/calendar-view.tsx` (yeni)

**Prisma Schema:**
```prisma
model JournalEntry {
  id          String   @id @default(cuid())
  userId      String   @map("user_id")
  date        DateTime
  content     String   @db.Text
  mood        String?  // "happy", "sad", "anxious", "calm", "energetic"
  tags        String[] // ["work", "relationship", "health", "family"]
  
  // Astrolojik veriler (o günün transit'leri)
  sunSign     String?   @map("sun_sign")
  moonSign    String?   @map("moon_sign")
  risingSign  String?   @map("rising_sign")
  transitData Json?     @map("transit_data") // Swiss Ephemeris verileri
  
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId, date])
  @@map("journal_entries")
}
```

**Özellikler:**
- ✅ Günlük yazma ve düzenleme
- ✅ Ruh hali takibi (mood tracking)
- ✅ Etiket sistemi (tags)
- ✅ O günün transit'leri otomatik kaydedilir
- ✅ Gemini AI ile günlük + astroloji analizi
- ✅ Takvim görünümü
- ✅ Arama ve filtreleme
- ✅ İstatistikler (en çok hangi ruh halinde, vb.)

**AI Analiz Örneği:**
```
Kullanıcının günlüğü: "Bugün çok gergin ve huzursuzdum. İşte tartışma yaşadım."
Bugünün transit'leri:
- Ay: Koç 15° (Aries)
- Mars: Aslan 22° (Leo) - Ay ile kare açı
- Merkür: Retrograde (Başak/Virgo)

Gemini AI Analizi:
"Bugün Ay Koç burcunda olduğu için duygusal olarak daha tetiklenmiş 
olabilirsiniz. Mars'ın Ay ile kare açı yapması, gerginlik ve çatışma 
potansiyelini artırıyor. Merkür retrograde döneminde olduğu için 
iletişimde yanlış anlaşılmalar yaşanabilir. Bugünkü gerginliğiniz 
tamamen doğal ve astrolojik etkilerle açıklanabilir..."
```

---

## 📊 Güncellenmiş Geliştirme Takvimi

| Özellik | Öncelik | Süre | Durum |
|---------|---------|------|-------|
| 1. Profil - Burç Seçimi | 🟢 YÜKSEK | 30 dk | ✅ Tamamlandı |
| 2. Geçmiş Yorumlar | 🟢 YÜKSEK | 45 dk | ⏳ Bekliyor |
| 3. Haftalık/Aylık Yorumlar | 🟡 ORTA | 1 saat | ⏳ Bekliyor |
| 4. Favori ve Paylaşım | 🟡 ORTA | 1 saat | ⏳ Bekliyor |
| 5. Burç Detay Sayfaları | 🟡 ORTA | 1.5 saat | ⏳ Bekliyor |
| 6. E-posta Bildirimleri | 🔵 DÜŞÜK | 2 saat | ⏳ Bekliyor |
| 7. Admin Paneli | 🔵 DÜŞÜK | 3 saat | ⏳ Bekliyor |
| **8. Swiss Ephemeris** | 🟢 **YÜKSEK** | **4 saat** | ⏳ **Bekliyor** |
| **9. Günlük (Journal)** | 🟡 **ORTA** | **3 saat** | ⏳ **Bekliyor** |

**Toplam Tahmini Süre:** ~16.75 saat (9 özellik)

---

## 🔄 Güncellemeler

### ✅ Tamamlanan Özellikler
- **Özellik 1:** Profil Sayfasında Burç Seçimi ve Kaydetme (11 Kasım 2025)

### 🚧 Devam Eden
_Henüz yok_

### ⏳ Bekleyen
- Özellik 2-9 (yukarıda listelenmiş)

---

**Son Güncelleme:** 11 Kasım 2025 (Swiss Ephemeris ve Journal eklendi)  
**Durum:** Özellik 1 Tamamlandı - Düzeltmeler Yapılıyor
