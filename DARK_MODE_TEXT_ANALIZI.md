# Dark Mode Metin Okunabilirlik Sorunu Analizi

## Tespit Edilen Sorun

**Etkilenen Sayfalar:**
- `/privacy` - Gizlilik Politikası
- `/terms` - Kullanım Koşulları

**Sorun:** Dark mode'da metinler koyu arka plan üzerinde koyu renkte görünüyor ve okunması zor.

## Mevcut Durum

Her iki sayfada da `prose` ve `dark:prose-invert` sınıfları kullanılıyor:

```tsx
<div className="prose prose-gray dark:prose-invert max-w-none">
```

### Sorunlu Alanlar

1. **Normal paragraflar (`<p>`)**: `dark:prose-invert` ile otomatik renklendirme var ama yeterli değil
2. **Liste öğeleri (`<li>`)**: Dark mode'da düzgün renklendirme yok
3. **Başlıklar (`<h1>`, `<h2>`, `<h3>`)**: Kontrast yetersiz
4. **Vurgulu metinler (`<strong>`)**: Koyu renkte kalıyor
5. **Linkler**: `text-primary` kullanılmış ama yeterli kontrast yok olabilir

## Çözüm Stratejisi

### 1. Explicit Metin Renkleri Eklemek

Tüm metin elementlerine açık renk sınıfları ekleyeceğiz:
- `text-foreground` - Ana metin rengi (light/dark mode'a uyumlu)
- `dark:text-gray-200` - Dark mode için açık gri
- `dark:text-white` - Dark mode için beyaz (başlıklar için)

### 2. Liste Öğelerini Düzeltmek

`<ul>` ve `<li>` elementlerine explicit renkler ekleyeceğiz.

### 3. Vurgulu Metinleri Düzeltmek

`<strong>` elementlerine dark mode için daha açık renk ekleyeceğiz.

### 4. Arka Plan Kontrastını Artırmak

`bg-muted` kullanan bölümlere dark mode için daha iyi kontrast sağlayacağız.

## Uygulama Planı

1. Her iki sayfada da tüm metin elementlerine `text-foreground` ekle
2. Başlıklara `dark:text-white` ekle
3. Paragraflara `dark:text-gray-200` ekle
4. Liste öğelerine explicit renkler ekle
5. Strong elementleri için custom stil ekle
6. Link renklerini kontrol et ve gerekirse düzelt
