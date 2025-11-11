# 🚀 Vercel Environment Variables Kurulum Rehberi

**Proje:** Az-Horoscope  
**Geliştirici:** Salih TANRISEVEN  
**Tarih:** 11 Kasım 2025

Bu rehber, Vercel'de environment variables (ortam değişkenleri) nasıl ayarlanacağını adım adım açıklar.

---

## 📋 Gerekli Environment Variables

Az-Horoscope projesinin çalışması için aşağıdaki environment variables gereklidir:

### ✅ Mevcut (Zaten Ayarlanmış)
- `DATABASE_URL` - PostgreSQL bağlantı URL'i (Neon)
- `GOOGLE_API_KEY` - Gemini AI API anahtarı
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
- `AUTH_SECRET` - NextAuth.js secret key
- `NEXTAUTH_URL` - Uygulama URL'i
- `AUTH_TRUST_HOST` - Host güvenlik ayarı

### 🆕 Yeni Eklenmesi Gereken
- `RESEND_API_KEY` - E-posta gönderimi için Resend API anahtarı

---

## 🔧 Vercel'de Environment Variable Ekleme

### Adım 1: Vercel Dashboard'a Giriş

1. **Vercel'e giriş yapın:**
   - https://vercel.com/login
   - GitHub hesabınızla giriş yapın

2. **Dashboard'a gidin:**
   - https://vercel.com/dashboard

### Adım 2: Projeyi Seçin

1. **"a-z-horoscope" projesini bulun ve tıklayın**

2. **Proje sayfası açılacak:**
   - Üst menüde "Settings" sekmesini göreceksiniz

### Adım 3: Environment Variables Sayfasına Gidin

1. **"Settings" sekmesine tıklayın**

2. **Sol menüden "Environment Variables" seçeneğini bulun ve tıklayın**

3. **Mevcut environment variables'ları göreceksiniz**

### Adım 4: RESEND_API_KEY Ekleyin

1. **"Add New" butonuna tıklayın** (veya sayfanın üstündeki form alanını kullanın)

2. **Bilgileri doldurun:**

   **Key (Anahtar):**
   ```
   RESEND_API_KEY
   ```

   **Value (Değer):**
   ```
   re_xxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   *(Resend'den aldığınız gerçek API anahtarınızı girin)*

3. **Environment seçin:**
   - ✅ **Production** (Canlı site için - mutlaka seçin)
   - ✅ **Preview** (Pull request'ler için - önerilen)
   - ✅ **Development** (Yerel geliştirme için - opsiyonel)

   **Öneri:** Her üç ortamı da seçin, böylece tüm ortamlarda e-posta gönderimi çalışır.

4. **"Save" butonuna tıklayın**

### Adım 5: Değişiklikleri Uygulama

Environment variable ekledikten sonra, değişikliklerin etkili olması için projeyi yeniden deploy etmeniz gerekir.

**Yöntem 1: Otomatik Deploy (Önerilen)**
1. GitHub'a yeni bir commit push'layın
2. Vercel otomatik olarak yeniden deploy edecek

**Yöntem 2: Manuel Redeploy**
1. "Deployments" sekmesine gidin
2. En son deployment'ı bulun
3. Sağ taraftaki "..." (üç nokta) menüsüne tıklayın
4. "Redeploy" seçeneğini seçin
5. "Redeploy" butonuna tıklayın

---

## ✅ Kurulum Kontrolü

### 1. Environment Variable Kontrolü

1. **Vercel Dashboard'da "Settings" > "Environment Variables" sayfasına gidin**

2. **Aşağıdaki değişkenlerin olduğunu kontrol edin:**
   - ✅ `DATABASE_URL`
   - ✅ `GOOGLE_API_KEY`
   - ✅ `GOOGLE_CLIENT_ID`
   - ✅ `GOOGLE_CLIENT_SECRET`
   - ✅ `AUTH_SECRET`
   - ✅ `NEXTAUTH_URL`
   - ✅ `AUTH_TRUST_HOST`
   - ✅ `RESEND_API_KEY` **(YENİ)**

### 2. Deployment Kontrolü

1. **"Deployments" sekmesine gidin**

2. **En son deployment'ın durumunu kontrol edin:**
   - ✅ **Ready** - Başarılı
   - ⏳ **Building** - Devam ediyor
   - ❌ **Error** - Hata var

3. **Hata varsa:**
   - Deployment'a tıklayın
   - "Build Logs" sekmesine gidin
   - Hata mesajlarını okuyun

### 3. Canlı Site Kontrolü

1. **Canlı sitenize gidin:**
   - https://a-z-horoscope.vercel.app

2. **Giriş yapın**

3. **Profil sayfasına gidin:**
   - https://a-z-horoscope.vercel.app/profile

4. **"E-posta Bildirimleri" bölümünü kontrol edin:**
   - Toggle switch çalışmalı
   - Bildirim tercihleri kaydedilebilmeli

---

## 🔍 Environment Variables Detayları

### DATABASE_URL
**Açıklama:** PostgreSQL veritabanı bağlantı URL'i  
**Format:** `postgresql://user:password@host/database?sslmode=require`  
**Nereden Alınır:** Neon Dashboard  
**Gerekli:** ✅ Evet

### GOOGLE_API_KEY
**Açıklama:** Google Gemini AI API anahtarı  
**Format:** `AIzaSy...`  
**Nereden Alınır:** Google AI Studio  
**Gerekli:** ✅ Evet

### GOOGLE_CLIENT_ID
**Açıklama:** Google OAuth Client ID  
**Format:** `123456789-xxx.apps.googleusercontent.com`  
**Nereden Alınır:** Google Cloud Console  
**Gerekli:** ✅ Evet

### GOOGLE_CLIENT_SECRET
**Açıklama:** Google OAuth Client Secret  
**Format:** `GOCSPX-xxx`  
**Nereden Alınır:** Google Cloud Console  
**Gerekli:** ✅ Evet

### AUTH_SECRET
**Açıklama:** NextAuth.js için güvenlik anahtarı  
**Format:** Random string (base64)  
**Nasıl Oluşturulur:** `openssl rand -base64 32`  
**Gerekli:** ✅ Evet

### NEXTAUTH_URL
**Açıklama:** Uygulamanın tam URL'i  
**Format:** `https://a-z-horoscope.vercel.app`  
**Gerekli:** ✅ Evet (Production için)

### AUTH_TRUST_HOST
**Açıklama:** Host güvenlik ayarı  
**Format:** `true`  
**Gerekli:** ✅ Evet (Vercel için)

### RESEND_API_KEY (YENİ)
**Açıklama:** E-posta gönderimi için Resend API anahtarı  
**Format:** `re_xxx`  
**Nereden Alınır:** Resend Dashboard  
**Gerekli:** ⚠️ E-posta bildirimleri için gerekli

---

## 🐛 Sorun Giderme

### Environment Variable Görünmüyor

**Sorun:** Eklediğim environment variable çalışmıyor.

**Çözümler:**
1. ✅ Doğru environment'ı seçtiğinizden emin olun (Production/Preview/Development)
2. ✅ Variable adını doğru yazdığınızdan emin olun (büyük/küçük harf duyarlı)
3. ✅ Projeyi yeniden deploy edin
4. ✅ Tarayıcı cache'ini temizleyin
5. ✅ 5-10 dakika bekleyin (Vercel'in değişiklikleri uygulaması için)

### Deployment Başarısız

**Sorun:** Yeni deployment hata veriyor.

**Çözümler:**
1. ✅ Build logs'u kontrol edin
2. ✅ Tüm gerekli environment variables'ların olduğundan emin olun
3. ✅ DATABASE_URL'in doğru olduğundan emin olun
4. ✅ Prisma migrations'ın uygulandığından emin olun

### E-posta Gönderilmiyor

**Sorun:** E-posta bildirimleri çalışmıyor.

**Çözümler:**
1. ✅ `RESEND_API_KEY` environment variable'ının eklendiğinden emin olun
2. ✅ Resend API anahtarının doğru olduğundan emin olun
3. ✅ Resend Dashboard'da "Logs" sekmesinden e-posta loglarını kontrol edin
4. ✅ Resend hesabınızın aktif olduğundan emin olun
5. ✅ Domain doğrulaması yapın (opsiyonel ama önerilen)

---

## 📊 Environment Variables Güvenliği

### ✅ Yapılması Gerekenler

1. **Asla GitHub'a commit etmeyin:**
   - `.env` dosyası `.gitignore`'da olmalı
   - Environment variables sadece Vercel'de olmalı

2. **Güçlü anahtarlar kullanın:**
   - `AUTH_SECRET` en az 32 karakter olmalı
   - Random ve tahmin edilemez olmalı

3. **Düzenli olarak güncelleyin:**
   - API anahtarlarını periyodik olarak yenileyin
   - Eski anahtarları iptal edin

4. **Minimum yetki prensibi:**
   - API anahtarlarına sadece gerekli yetkileri verin
   - Production ve development için farklı anahtarlar kullanın

### ❌ Yapılmaması Gerekenler

1. **Environment variables'ı paylaşmayın:**
   - Slack, Discord, e-posta ile göndermeyin
   - Screenshot almayın

2. **Client-side'da kullanmayın:**
   - API anahtarlarını frontend kodunda kullanmayın
   - `NEXT_PUBLIC_` prefix'i kullanmayın (güvenli değil)

3. **Hardcode etmeyin:**
   - Kodda doğrudan yazmayın
   - Config dosyalarına eklemeyin

---

## 📚 Ek Kaynaklar

- **Vercel Environment Variables Dokümantasyonu:**  
  https://vercel.com/docs/projects/environment-variables

- **Resend Dokümantasyonu:**  
  https://resend.com/docs

- **NextAuth.js Dokümantasyonu:**  
  https://next-auth.js.org/configuration/options

---

## 📞 Destek

Herhangi bir sorun yaşarsanız:

1. **Vercel Support:** https://vercel.com/support
2. **GitHub Issues:** https://github.com/sata2500/a-z-horoscope/issues
3. **E-posta:** salihtanriseven25@gmail.com

---

**Hazırlayan:** Salih TANRISEVEN  
**Tarih:** 11 Kasım 2025  
**Versiyon:** 1.0
