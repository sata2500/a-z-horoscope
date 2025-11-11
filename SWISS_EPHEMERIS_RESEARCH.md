# Swiss Ephemeris Araştırma Raporu

**Tarih:** 11 Kasım 2025  
**Amaç:** Profesyonel astroloji hesaplamaları için Swiss Ephemeris entegrasyonu

---

## 📚 Swiss Ephemeris Nedir?

Swiss Ephemeris, **Astrodienst AG** tarafından geliştirilen, astronomik ve astrolojik hesaplamalar için kullanılan **yüksek hassasiyetli** bir kütüphanedir. NASA JPL ephemeris verilerini kullanır ve profesyonel astrologlar tarafından tercih edilir.

**Özellikler:**
- ✅ Yüksek hassasiyetli gezegen pozisyonları
- ✅ Asteroidler ve Chiron hesaplamaları
- ✅ Ay düğümleri (Lunar Nodes)
- ✅ Lilith (Black Moon) hesaplamaları
- ✅ Evler (Houses) hesaplamaları
- ✅ Natal chart (doğum haritası) hesaplamaları
- ✅ Transit ve progression hesaplamaları
- ✅ 600-6000 yıllık tarih aralığı desteği

---

## 🔍 Node.js Kütüphaneleri

### 1. **sweph** (ÖNERİLEN)
**GitHub:** https://github.com/timotejroiko/sweph  
**NPM:** `sweph`  
**Yıldız:** 163 ⭐  
**Son Güncelleme:** 26 Mayıs 2025 (6 ay önce)

**Avantajlar:**
- ✅ %100 API coverage
- ✅ TypeScript desteği (built-in .d.ts)
- ✅ ESM ve CommonJS desteği
- ✅ Intellisense documentation
- ✅ N-API ile build (stabil)
- ✅ Aktif geliştirme (96 commit)
- ✅ Swiss Ephemeris 2.10.03b ile eşleşmiş

**Dezavantajlar:**
- ❌ C/C++ addon (build tools gerekli)
- ❌ Browser'da çalışmaz
- ❌ AGPL-3.0 lisansı (2.10.1+)
- ❌ Ephemeris dosyaları ayrı indirilmeli

**Lisanslama:**
- GPL-2.0: `npm install sweph@gpl` (v2.10.0 ve öncesi)
- AGPL-3.0: `npm install sweph@latest` (v2.10.1+)
- LGPL-3.0: Profesyonel lisans sahipleri için

**Kurulum:**
```bash
npm install sweph@latest
```

**Ephemeris Dosyaları:**
- GitHub: https://github.com/aloistr/swisseph/tree/master/ephe
- Dropbox: https://www.dropbox.com/scl/fo/y3naz62gy6f6qfrhquu7u/h

**Dosya Türleri:**
- `sepl_*.se1` - Gezegenler (600 yıl)
- `semo_*.se1` - Ay (600 yıl)
- `seas_*.se1` - Ana asteroidler (600 yıl)
- `all_ast/` - Tüm asteroidler
- `long_ast/` - İsimli asteroidler (6000 yıl)
- `sat/` - Gezegen uyduları

---

### 2. **swisseph** (ESKİ)
**NPM:** `swisseph`  
**Son Güncelleme:** 25 Ocak 2022 (3.5 yıl önce)

**Durum:** ❌ Eski, önerilmez

---

### 3. **swisseph-wasm** (BROWSER İÇİN)
**NPM:** `swisseph-wasm`  
**Açıklama:** WebAssembly versiyonu

**Avantajlar:**
- ✅ Browser'da çalışır
- ✅ Build tools gerektirmez

**Dezavantajlar:**
- ❌ Next.js SSR ile uyumsuz olabilir
- ❌ Daha az özellik

---

## 🎯 Projemiz İçin Önerilen Yaklaşım

### Faz 1: Temel Swiss Ephemeris Entegrasyonu

**Kullanılacak Kütüphane:** `sweph@latest`

**Özellikler:**
1. ✅ Doğum haritası (natal chart) hesaplama
2. ✅ Gezegen pozisyonları (Güneş, Ay, Merkür, Venüs, Mars, Jüpiter, Satürn, Uranüs, Neptün, Plüton)
3. ✅ Yükselen burç (Ascendant) hesaplama
4. ✅ Evler (Houses) hesaplama (Placidus, Koch, Equal, vb.)
5. ✅ Ay düğümleri (North Node, South Node)
6. ✅ Chiron ve Lilith pozisyonları

**API Endpoint'leri:**
- `POST /api/astrology/natal-chart` - Doğum haritası
- `POST /api/astrology/transit` - Transit hesaplamaları
- `POST /api/astrology/houses` - Evler hesaplama

**Gemini AI ile Entegrasyon:**
Swiss Ephemeris'ten alınan **gerçek astronomik veriler** + Gemini AI'ın **yorumlama gücü** = **Profesyonel astroloji analizi**

**Örnek İş Akışı:**
1. Kullanıcı doğum bilgilerini girer (tarih, saat, yer)
2. Swiss Ephemeris ile gezegen pozisyonları hesaplanır
3. Gemini AI'a gönderilir: "Bu doğum haritasına göre kişilik analizi yap"
4. AI, gerçek verilerle yorumlama yapar

---

### Faz 2: Günlük (Journal) Entegrasyonu

**Özellik:** Kullanıcıların günlük (journal) tutması ve bu verilerin astrolojik yorumlarla birleştirilmesi

**Nasıl Çalışır:**
1. Kullanıcı günlük yazar (ruh hali, olaylar, duygular)
2. Swiss Ephemeris ile o günün transit'leri hesaplanır
3. Gemini AI, günlük + transit verilerini analiz eder
4. "Bugün Ay Yengeç'te, duygusal olmanız normal" gibi yorumlar

**Database Schema:**
```prisma
model JournalEntry {
  id        String   @id @default(cuid())
  userId    String
  date      DateTime
  content   String   @db.Text
  mood      String?  // "happy", "sad", "anxious", etc.
  tags      String[] // ["work", "relationship", "health"]
  
  // Astrolojik veriler (o günün transit'leri)
  sunSign     String?
  moonSign    String?
  risingSign  String?
  
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

**AI Prompt Örneği:**
```
Kullanıcının günlüğü: "Bugün çok gergin ve huzursuzdum. İşte tartışma yaşadım."
Bugünün transit'leri:
- Ay: Koç (Aries) 15°
- Mars: Aslan (Leo) 22° (Ay ile kare açı)
- Merkür: Retrograde (Başak/Virgo)

Bu verilere göre kullanıcının ruh halini açıkla ve öneriler sun.
```

---

## 📋 Geliştirme Planına Eklenecek Özellikler

### Özellik 8: Swiss Ephemeris Entegrasyonu
**Öncelik:** YÜKSEK  
**Süre:** ~4 saat

**Yapılacaklar:**
- [ ] `sweph` kütüphanesini yükle
- [ ] Ephemeris dosyalarını indir ve yapılandır
- [ ] Doğum haritası hesaplama fonksiyonu
- [ ] API endpoint: `/api/astrology/natal-chart`
- [ ] Gemini AI ile entegrasyon
- [ ] Profil sayfasına doğum haritası bölümü

---

### Özellik 9: Günlük (Journal) Sistemi
**Öncelik:** ORTA  
**Süre:** ~3 saat

**Yapılacaklar:**
- [ ] Prisma schema: `JournalEntry` modeli
- [ ] API endpoint: `/api/journal/create`
- [ ] API endpoint: `/api/journal/list`
- [ ] Günlük yazma sayfası (`/journal/new`)
- [ ] Günlük listesi sayfası (`/journal`)
- [ ] Transit hesaplamaları (Swiss Ephemeris)
- [ ] Gemini AI ile günlük + transit analizi

---

## 🔧 Teknik Detaylar

### Kurulum Gereksinimleri

**Linux/Mac:**
```bash
# Build tools
sudo apt-get install build-essential python3
# veya
xcode-select --install
```

**Windows:**
```bash
# Visual C++ Build Tools
npm install --global windows-build-tools
```

**Vercel Deployment:**
Vercel, native C++ addon'ları destekler. `package.json`'da:
```json
{
  "scripts": {
    "postinstall": "npm rebuild sweph"
  }
}
```

---

### Ephemeris Dosyaları Yapılandırması

**Önerilen Klasör Yapısı:**
```
/public/ephemeris/
  ├── sepl_18.se1  (1800-2400)
  ├── sepl_24.se1  (2400-3000)
  ├── semo_18.se1  (Ay 1800-2400)
  └── seas_18.se1  (Asteroidler)
```

**Kod:**
```javascript
import sweph from 'sweph'

sweph.set_ephe_path('./public/ephemeris')
```

---

## 💡 Alternatif Yaklaşımlar

### Yaklaşım 1: Hybrid (Önerilen)
- Swiss Ephemeris: Gezegen pozisyonları (hassas)
- Gemini AI: Yorumlama ve analiz

**Avantajlar:**
- ✅ En yüksek hassasiyet
- ✅ Profesyonel sonuçlar
- ✅ AI'ın yaratıcı yorumları

---

### Yaklaşım 2: Sadece AI
- Gemini AI: Hem hesaplama hem yorumlama

**Avantajlar:**
- ✅ Kolay implementasyon
- ✅ Build tools gerektirmez

**Dezavantajlar:**
- ❌ Düşük hassasiyet
- ❌ AI halüsinasyonları
- ❌ Profesyonel değil

---

## 🎯 Sonuç ve Öneri

**ÖNERİLEN YAKLAŞIM:** Hybrid (Swiss Ephemeris + Gemini AI)

**Neden?**
1. ✅ Profesyonel hassasiyet (Swiss Ephemeris)
2. ✅ Zengin yorumlar (Gemini AI)
3. ✅ Günlük entegrasyonu için ideal
4. ✅ Kullanıcı deneyimi üst seviye

**Geliştirme Sırası:**
1. Özellik 1-7 (Mevcut plan)
2. **Özellik 8: Swiss Ephemeris Entegrasyonu**
3. **Özellik 9: Günlük (Journal) Sistemi**
4. Özellik 10: İleri seviye astroloji özellikleri

---

**Hazırlayan:** Salih TANRISEVEN  
**Tarih:** 11 Kasım 2025
