# sweph Kurulum ve Kullanım Notları

**Kaynak:** https://github.com/timotejroiko/sweph  
**Tarih:** 11 Kasım 2025

---

## Kurulum

### Lisanslama

**GPL-2.0 (v2.10.0 ve öncesi):**
```bash
npm install sweph@gpl
# veya
npm install sweph@2.10.0
```

**AGPL-3.0 (v2.10.1 ve sonrası):**
```bash
npm install sweph
# veya
npm install sweph@latest
```

**LGPL-3.0 (Profesyonel lisans sahipleri):**
- Herhangi bir versiyonu kullanabilir

### Mevcut Versiyon
- **2.10.3-b-1** (Swiss Ephemeris 2.10.03b revision 1)
- Son güncelleme: 26 Mayıs 2025

---

## Özellikler

- ✅ %100 API coverage
- ✅ Built-in TypeScript declarations
- ✅ ESM exports desteği
- ✅ Intellisense documentation
- ✅ N-API ile build (stabil)

---

## Ephemeris Dosyaları

### Kaynaklar

**GitHub (Ana gezegenler):**
https://github.com/aloistr/swisseph/tree/master/ephe

**Dropbox (Tüm dosyalar):**
https://www.dropbox.com/scl/fo/y3naz62gy6f6qfrhquu7u/h?rlkey=ejltdhb262zglm7eo6yfj2940&dl=0

### Dosya Türleri

**Ana dosyalar (600 yıl):**
- `sepl_*.se1` - Gezegenler
- `seplm_*.se1` - Gezegenler (BC - Before Christ)
- `semo_*.se1` - Ay
- `semom_*.se1` - Ay (BC)
- `seas_*.se1` - Ana asteroidler
- `seasm_*.se1` - Ana asteroidler (BC)

**Örnek:**
- `sepl_18.se1` → 1800-2400 yılları arası

**İleri seviye:**
- `all_ast/` - Tüm asteroidler (600 yıl)
- `long_ast/` - İsimli asteroidler (6000 yıl)
- JPL binary files - NASA JPL ephemerides
- `sat/` - Gezegen uyduları

### Kullanım

```javascript
import sweph from 'sweph'

// Ephemeris dosyalarının bulunduğu klasörü ayarla
sweph.set_ephe_path('./public/ephemeris')
```

**Klasör yapısı:**
```
/public/ephemeris/
  ├── sepl_18.se1  (Gezegenler 1800-2400)
  ├── semo_18.se1  (Ay 1800-2400)
  ├── seas_18.se1  (Asteroidler)
  └── astxxx/      (Asteroid alt klasörleri)
      └── sat/     (Gezegen uyduları)
```

---

## Sınırlamalar

### Worker Threads
- Worker threads desteklenir ANCAK:
- C library single-threaded
- `set_ephe_path()` ve `set_sid_mode()` tüm process'i etkiler
- Thread-safe multithreading için `child_process` kullanılmalı

### Platform Gereksinimleri
- ❌ Browser'da çalışmaz
- ✅ Sadece Node.js
- ✅ C/C++ build tools gerekli:
  - Linux: `python`, `make`, `gcc`
  - Mac: `xcode`
  - Windows: `Visual C++ Build Tools`

---

## Vercel Deployment

Vercel, native C++ addon'ları destekler. `package.json`'a ekle:

```json
{
  "scripts": {
    "postinstall": "npm rebuild sweph"
  }
}
```

---

## Projemiz İçin Plan

### 1. Kurulum
```bash
npm install sweph@latest
```

### 2. Ephemeris Dosyaları
- `sepl_18.se1` (1800-2400) - 10MB
- `semo_18.se1` (1800-2400) - 5MB
- `seas_18.se1` (1800-2400) - 2MB
- **Toplam:** ~17MB (50MB yerine)

### 3. Klasör Yapısı
```
/public/ephemeris/
  ├── sepl_18.se1
  ├── semo_18.se1
  └── seas_18.se1
```

### 4. Kod Yapısı
```
/lib/swisseph.ts
  - set_ephe_path()
  - calculateNatalChart()
  - calculateTransits()
  - calculateHouses()
  - calculateAspects()
```

---

**Notlar:**
- ✅ TypeScript desteği built-in
- ✅ ESM/CommonJS her ikisi de destekleniyor
- ✅ Vercel deployment uyumlu
- ⚠️ Build tools gerekli (Vercel otomatik sağlar)
- ⚠️ Browser'da çalışmaz (server-side only)

---

**Hazırlayan:** Salih TANRISEVEN  
**Tarih:** 11 Kasım 2025
