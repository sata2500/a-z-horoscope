# ⚡ Hızlı Başlangıç Rehberi

**Az-Horoscope** - E-posta Bildirimleri ve Admin Paneli Kurulumu

---

## 🎯 İki Basit Adımda Kurulum

### 1️⃣ Resend API Anahtarı Alın (5 dakika)

1. **Resend'e kaydolun:** https://resend.com
2. **API Key oluşturun:** Dashboard > API Keys > Create API Key
3. **Anahtarı kopyalayın:** `re_xxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2️⃣ Vercel'e Ekleyin (2 dakika)

1. **Vercel'e gidin:** https://vercel.com/dashboard
2. **Projeyi seçin:** `a-z-horoscope`
3. **Settings > Environment Variables**
4. **Yeni değişken ekleyin:**
   - **Key:** `RESEND_API_KEY`
   - **Value:** `re_xxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Environment:** Production, Preview, Development (hepsini seçin)
5. **Save** ve **Redeploy**

---

## 👑 Admin Kullanıcı Oluşturma

### Yöntem 1: Script ile (En Kolay) ⭐

```bash
npm run admin:create
```

E-posta adresinizi girin ve enter'a basın. Hepsi bu kadar!

### Yöntem 2: Neon Dashboard ile

1. https://console.neon.tech/ adresine gidin
2. SQL Editor'ü açın
3. Aşağıdaki komutu çalıştırın:

```sql
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'salihtanriseven25@gmail.com';
```

---

## ✅ Test Edin

### E-posta Bildirimleri
1. https://a-z-horoscope.vercel.app/profile
2. "E-posta Bildirimleri" bölümünü açın
3. Toggle switch'i açın ve kaydedin

### Admin Paneli
1. https://a-z-horoscope.vercel.app/admin
2. Dashboard'u görmelisiniz
3. Kullanıcılar ve istatistikler sayfalarını kontrol edin

---

## 🆘 Sorun mu Yaşıyorsunuz?

**Detaylı rehberler:**
- 📧 E-posta kurulumu: `SETUP_GUIDE.md`
- 🔧 Vercel ayarları: `VERCEL_SETUP.md`

**Komutlar:**
```bash
npm run admin:create  # Admin oluştur
npm run admin:list    # Admin'leri listele
```

---

**Hazır!** 🎉 Artık tüm özellikler kullanıma hazır.
