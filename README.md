# 🌌 Az-Horoscope: Yeni Nesil Yapay Zeka Destekli Astroloji Platformu

<!-- Badges -->
![Framework: Next.js](https://img.shields.io/badge/Framework-Next.js-black?style=for-the-badge&logo=next.js)
![Language: TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=for-the-badge&logo=typescript)
![Styling: Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![ORM: Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

**Az-Horoscope**, astrolojinin kadim bilgeliğini modern teknolojinin gücüyle birleştiren, yeni nesil bir astrolojik analiz platformudur. Bu proje, en güncel ve stabil teknolojiler kullanılarak, ölçeklenebilir, bakımı kolay ve yüksek performanslı bir temel üzerine sıfırdan inşa edilmiştir.

## 🎯 Proje Felsefesi

Bu projenin temelinde üç ana felsefe yatar:

1. **Stabilite ve Güvenilirlik:** Sektör standardı haline gelmiş kütüphaneler ve mimari desenler kullanılarak, "hydration mismatch" gibi yaygın hatalardan arındırılmış, sağlam bir yapı hedeflenmiştir.
2. **Net Sorumluluk Ayrımı:** Ağır ve hassas hesaplamalar sunucuda (Server), interaktif ve anlık kullanıcı deneyimi ise istemcide (Client) yönetilir. Bu, Next.js App Router'ın gücünü en verimli şekilde kullanmamızı sağlar.
3. **Uçtan Uca Tip Güvenliği:** Veritabanından API katmanına, oradan da kullanıcı arayüzüne kadar tüm veri akışı TypeScript ve Zod ile güvence altına alınmıştır. Bu, geliştirme aşamasında hataları en aza indirir.

## 🛠️ Teknoloji Yığını

Proje, birlikte uyum içinde çalışmak üzere özenle seçilmiş modern teknolojilerden oluşur:

| Kategori | Teknoloji | Amaç |
|:---|:---|:---|
| **Framework** | Next.js (App Router) | Hibrit Sunucu/İstemci Mimarisi, API Rotaları, Performans. |
| **Dil** | TypeScript | Uçtan uca tip güvenliği ve geliştirici deneyimi. |
| **UI Kütüphanesi** | shadcn/ui | Erişilebilir, özelleştirilebilir ve yeniden kullanılabilir UI bileşenleri. |
| **Styling** | Tailwind CSS | Hızlı ve modern arayüz geliştirme. |
| **Tema Yönetimi** | `next-themes` | Sorunsuz Light/Dark/System tema desteği. |
| **Veritabanı ORM** | Prisma | Veritabanı ile güvenli ve kolay iletişim. |
| **Kimlik Doğrulama** | Auth.js (NextAuth v5) | Güvenli ve esnek kimlik doğrulama (örn: Google, Apple). |
| **Veri Doğrulama** | Zod | API istekleri ve formlar için şema tabanlı veri doğrulama. |
| **Hesaplama Motoru** | `swisseph` (Planlanan) | Profesyonel ve hassas astrolojik hesaplamalar. |

## 🚀 Başlarken

Bu projeyi yerel makinenizde kurmak ve geliştirmeye başlamak için aşağıdaki adımları izleyin.

### Ön Gereksinimler

- **Node.js**: `v18.17.0` veya daha yeni bir sürüm.
- **Paket Yöneticisi**: `pnpm` (önerilir), `npm`, veya `yarn`.
- **Veritabanı**: PostgreSQL destekleyen herhangi bir servis (örn: Neon, Vercel Postgres, Supabase veya yerel kurulum).
- **Google Cloud Projesi**: Google ile giriş (OAuth) için gereklidir.

### 1. Depoyu Klonlama ve Kurulum

```bash
# Yeni projenizin GitHub deposunu klonlayın
git clone https://github.com/KULLANICI_ADINIZ/YENI_REPO_ADINIZ.git

# Proje dizinine gidin
cd YENI_REPO_ADINIZ

# Bağımlılıkları yükleyin
pnpm install
```

### 2. Ortam Değişkenlerini Yapılandırma

Projenin kök dizininde `.env.example` dosyasını kopyalayarak `.env` adında yeni bir dosya oluşturun ve içindeki değerleri kendi yapılandırmanıza göre doldurun.

```bash
cp .env.example .env
```

### 3. Veritabanını Hazırlama

Prisma şemasını veritabanınıza uygulamak ve Prisma Client'ı oluşturmak için aşağıdaki komutu çalıştırın:

```bash
pnpm prisma migrate dev
```

Bu komut, `schema.prisma` dosyanızdaki modellere göre veritabanı tablolarınızı oluşturacaktır.

### 4. Geliştirme Sunucusunu Başlatma

Her şey hazır! Geliştirme sunucusunu başlatmak için:

```bash
pnpm dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açarak uygulamayı görüntüleyebilirsiniz.

## 🔐 Ortam Değişkenleri

| Değişken | Açıklama | Örnek |
|:---|:---|:---|
| `DATABASE_URL` | Prisma'nın veritabanına bağlanmak için kullandığı bağlantı dizesi. | `postgresql://user:pass@host/db` |
| `AUTH_SECRET` | Auth.js (NextAuth) oturumlarını şifrelemek için kullanılan gizli anahtar. | `openssl rand -base64 32` ile oluşturun |
| `AUTH_GOOGLE_ID` | Google OAuth için Google Cloud'dan alınan Client ID. | `...apps.googleusercontent.com` |
| `AUTH_GOOGLE_SECRET` | Google OAuth için Google Cloud'dan alınan Client Secret. | `GOCSPX-...` |
| `GEMINI_API_KEY` | (Opsiyonel) Google Gemini API'yi kullanmak için API anahtarı. | `AIzaSy...` |

## 📦 Dağıtım

Bu proje, Vercel platformunda sorunsuz bir şekilde dağıtılmak üzere optimize edilmiştir.

1. GitHub deponuzu Vercel hesabınıza bağlayın.
2. Proje ayarlarından yukarıdaki Ortam Değişkenlerini ekleyin.
3. Vercel, ana dala yapılan her push işleminde projeyi otomatik olarak derleyip canlıya alacaktır.

## 📄 Lisans

Bu proje, MIT Lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.

## 👨‍💻 Geliştirici

**Salih TANRISEVEN**

---

⭐ Bu projeyi beğendiyseniz, yıldız vermeyi unutmayın!