# 🚀 Az-Horoscope Kurulum Rehberi

**Geliştirici:** Salih TANRISEVEN  
**Tarih:** 11 Kasım 2025

Bu rehber, Az-Horoscope projesindeki yeni özellikleri kullanabilmeniz için gerekli kurulum adımlarını içerir.

---

## 📧 1. Resend API Anahtarı Alma

Resend, modern ve kullanıcı dostu bir e-posta gönderim servisidir. Ücretsiz planı ile ayda 3,000 e-posta gönderebilirsiniz.

### Adım 1: Resend Hesabı Oluşturma

1. **Resend web sitesine gidin:**
   - https://resend.com

2. **"Sign Up" butonuna tıklayın**
   - Sağ üst köşedeki "Sign Up" butonunu bulun

3. **Hesap oluşturun:**
   - **E-posta:** Kendi e-posta adresinizi girin
   - **Şifre:** Güçlü bir şifre oluşturun
   - Veya **GitHub ile giriş** yapabilirsiniz (önerilen)

4. **E-posta doğrulaması:**
   - Gelen kutunuza bir doğrulama e-postası gelecek
   - E-postadaki linke tıklayarak hesabınızı doğrulayın

### Adım 2: API Anahtarı Oluşturma

1. **Dashboard'a gidin:**
   - https://resend.com/dashboard

2. **"API Keys" sekmesine tıklayın:**
   - Sol menüden "API Keys" seçeneğini bulun

3. **"Create API Key" butonuna tıklayın**

4. **API Key bilgilerini doldurun:**
   - **Name:** `Az-Horoscope Production` (veya istediğiniz bir isim)
   - **Permission:** "Full Access" seçin (veya "Sending Access")
   - **Domain:** Boş bırakabilirsiniz (opsiyonel)

5. **"Create" butonuna tıklayın**

6. **API Anahtarını kopyalayın:**
   - ⚠️ **ÖNEMLİ:** API anahtarı sadece bir kez gösterilir!
   - Anahtarı kopyalayın ve güvenli bir yere kaydedin
   - Örnek format: `re_xxxxxxxxxxxxxxxxxxxxxxxxxx`

### Adım 3: Domain Doğrulama (Opsiyonel ama Önerilen)

Profesyonel görünüm için kendi domain'inizi kullanabilirsiniz.

1. **"Domains" sekmesine gidin**

2. **"Add Domain" butonuna tıklayın**

3. **Domain adınızı girin:**
   - Örnek: `a-z-horoscope.vercel.app`
   - Veya kendi domain'iniz: `yourdomain.com`

4. **DNS kayıtlarını ekleyin:**
   - Resend size 3 DNS kaydı verecek (SPF, DKIM, DMARC)
   - Bu kayıtları domain sağlayıcınıza (Vercel, Cloudflare, vb.) ekleyin

5. **Doğrulamayı bekleyin:**
   - DNS kayıtlarının yayılması 5-30 dakika sürebilir
   - "Verify" butonuna tıklayarak kontrol edin

**Not:** Domain doğrulaması yapmazsanız, e-postalar `noreply@resend.dev` adresinden gönderilir.

---

## 👑 2. İlk Admin Kullanıcı Oluşturma

Admin paneline erişebilmek için veritabanında en az bir admin kullanıcı olmalıdır.

### Yöntem 1: Neon Dashboard Üzerinden (Önerilen)

1. **Neon Dashboard'a gidin:**
   - https://console.neon.tech/

2. **Projenizi seçin:**
   - `a-z-horoscope` projesini bulun ve tıklayın

3. **"SQL Editor" sekmesine gidin:**
   - Sol menüden "SQL Editor" seçeneğini bulun

4. **Aşağıdaki SQL sorgusunu çalıştırın:**

```sql
-- Önce kullanıcınızın ID'sini bulun
SELECT id, email, name, role FROM users WHERE email = 'salihtanriseven25@gmail.com';

-- Kullanıcıyı admin yapın
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'salihtanriseven25@gmail.com';

-- Kontrol edin
SELECT id, email, name, role FROM users WHERE role = 'ADMIN';
```

5. **"Run" butonuna tıklayın**

6. **Sonucu kontrol edin:**
   - `role` sütunu `ADMIN` olarak görünmeli

### Yöntem 2: Script ile (Alternatif)

Projeye bir script ekledim. Bunu kullanarak da admin kullanıcı oluşturabilirsiniz.

1. **Terminal'i açın** (projenizin kök dizininde)

2. **Script'i çalıştırın:**

```bash
npm run admin:create
```

3. **E-posta adresinizi girin:**
   - Script sizden e-posta adresi isteyecek
   - `salihtanriseven25@gmail.com` yazın

4. **Onaylayın:**
   - Script kullanıcıyı admin yapacak ve sonucu gösterecek

### Yöntem 3: Prisma Studio ile (En Kolay)

1. **Terminal'i açın**

2. **Prisma Studio'yu başlatın:**

```bash
npx prisma studio
```

3. **Tarayıcıda açılacak:**
   - Otomatik olarak `http://localhost:5555` açılacak

4. **"User" modeline tıklayın**

5. **Kendinizi bulun:**
   - E-posta adresinizle arama yapın

6. **"role" alanını düzenleyin:**
   - `USER` yerine `ADMIN` yazın

7. **"Save 1 change" butonuna tıklayın**

---

## 🔐 3. Environment Variables Kurulumu

### Yerel Geliştirme (.env dosyası)

Projenizin kök dizininde `.env` dosyası zaten mevcut. Sadece Resend API anahtarını eklemeniz yeterli:

1. **`.env` dosyasını açın**

2. **Aşağıdaki satırı ekleyin:**

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. **Dosyayı kaydedin**

4. **Development server'ı yeniden başlatın:**

```bash
npm run dev
```

### Vercel Production (Canlı Site)

1. **Vercel Dashboard'a gidin:**
   - https://vercel.com/dashboard

2. **Projenizi seçin:**
   - `a-z-horoscope` projesini bulun

3. **"Settings" sekmesine gidin**

4. **"Environment Variables" seçeneğine tıklayın**

5. **Yeni değişken ekleyin:**
   - **Name:** `RESEND_API_KEY`
   - **Value:** `re_xxxxxxxxxxxxxxxxxxxxxxxxxx` (kendi anahtarınız)
   - **Environment:** `Production`, `Preview`, `Development` (hepsini seçin)

6. **"Save" butonuna tıklayın**

7. **Projeyi yeniden deploy edin:**
   - "Deployments" sekmesine gidin
   - En son deployment'ın yanındaki "..." butonuna tıklayın
   - "Redeploy" seçeneğini seçin

---

## ✅ 4. Kurulum Testi

### E-posta Bildirimleri Testi

1. **Uygulamaya giriş yapın:**
   - https://a-z-horoscope.vercel.app/login

2. **Profil sayfasına gidin:**
   - https://a-z-horoscope.vercel.app/profile

3. **"E-posta Bildirimleri" bölümüne gidin**

4. **Toggle switch'i açın**

5. **Bildirim sıklığını seçin:**
   - Günlük, Haftalık veya Aylık

6. **"Bildirim Tercihlerini Kaydet" butonuna tıklayın**

7. **Başarı mesajını görmelisiniz:**
   - ✓ Bildirim tercihleri başarıyla güncellendi

### Admin Paneli Testi

1. **Admin paneline gidin:**
   - https://a-z-horoscope.vercel.app/admin

2. **Dashboard'u görmelisiniz:**
   - Toplam kullanıcı sayısı
   - Toplam yorum sayısı
   - Grafikler

3. **Kullanıcı listesine gidin:**
   - https://a-z-horoscope.vercel.app/admin/users

4. **Kullanıcıları görmelisiniz:**
   - Arama yapabilirsiniz
   - Pagination çalışmalı

5. **İstatistiklere gidin:**
   - https://a-z-horoscope.vercel.app/admin/stats

6. **Detaylı grafikleri görmelisiniz**

---

## 🐛 Sorun Giderme

### E-posta Gönderilmiyor

**Sorun:** E-posta bildirimleri çalışmıyor.

**Çözüm:**
1. `RESEND_API_KEY` environment variable'ının doğru olduğundan emin olun
2. Vercel'de environment variable ekledikten sonra yeniden deploy edin
3. Resend Dashboard'da "Logs" sekmesinden e-posta loglarını kontrol edin
4. Development modunda e-postalar simüle edilir (console.log), production'da gerçek e-posta gönderilir

### Admin Paneline Erişemiyorum

**Sorun:** `/admin` sayfası ana sayfaya yönlendiriyor.

**Çözüm:**
1. Veritabanında `role` alanının `ADMIN` olduğundan emin olun
2. Çıkış yapıp tekrar giriş yapın (session yenilenmesi için)
3. Tarayıcı cache'ini temizleyin
4. Farklı bir tarayıcıda deneyin

### Database Hatası

**Sorun:** "Role field not found" hatası alıyorum.

**Çözüm:**
1. Migration'ların uygulandığından emin olun:
   ```bash
   npx prisma migrate deploy
   ```
2. Prisma Client'ı yeniden oluşturun:
   ```bash
   npx prisma generate
   ```
3. Development server'ı yeniden başlatın

---

## 📞 Destek

Herhangi bir sorun yaşarsanız:

1. **GitHub Issues:** https://github.com/sata2500/a-z-horoscope/issues
2. **E-posta:** salihtanriseven25@gmail.com

---

## 📚 Ek Kaynaklar

- **Resend Dokümantasyonu:** https://resend.com/docs
- **Neon Dokümantasyonu:** https://neon.tech/docs
- **Vercel Dokümantasyonu:** https://vercel.com/docs
- **Prisma Dokümantasyonu:** https://www.prisma.io/docs

---

**Hazırlayan:** Salih TANRISEVEN  
**Tarih:** 11 Kasım 2025  
**Versiyon:** 1.0
