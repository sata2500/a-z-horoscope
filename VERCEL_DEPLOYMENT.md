# Vercel Deployment Kılavuzu

## 🚀 Deployment Adımları

### 1. Vercel'e Giriş
1. https://vercel.com adresine gidin
2. GitHub hesabınızla giriş yapın

### 2. Projeyi Import Et
1. "Add New" → "Project" tıklayın
2. GitHub'dan `a-z-horoscope` reposunu seçin
3. "Import" butonuna tıklayın

### 3. Environment Variables Ekle

Vercel dashboard'da "Environment Variables" bölümüne aşağıdaki değişkenleri ekleyin.

**ÖNEMLİ:** Gerçek değerler için `.env` dosyanıza veya güvenli notlarınıza bakın.

#### Database
```
DATABASE_URL=<your-neon-database-url>
```

#### Google Gemini API
```
GOOGLE_API_KEY=<your-gemini-api-key>
```

#### Google OAuth
```
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

#### Auth.js
```
AUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://a-z-horoscope.vercel.app
AUTH_TRUST_HOST=true
```

### 4. Build Settings
Vercel otomatik olarak Next.js projesini algılayacaktır:
- **Framework Preset:** Next.js
- **Build Command:** `next build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### 5. Deploy
"Deploy" butonuna tıklayın. İlk deployment 2-3 dakika sürebilir.

## 🔧 Google OAuth Callback URL Güncelleme

Deployment tamamlandıktan sonra:

1. https://console.cloud.google.com adresine gidin
2. Projenizi seçin
3. "APIs & Services" → "Credentials" gidin
4. OAuth 2.0 Client ID'nizi seçin
5. "Authorized redirect URIs" bölümüne ekleyin:
   ```
   https://a-z-horoscope.vercel.app/api/auth/callback/google
   ```
6. "Save" butonuna tıklayın

## ✅ Deployment Kontrolü

Deployment başarılı olduktan sonra:

1. ✅ Ana sayfa yükleniyor mu?
   - https://a-z-horoscope.vercel.app

2. ✅ Login çalışıyor mu?
   - https://a-z-horoscope.vercel.app/login
   - Google ile giriş yapın

3. ✅ Dashboard erişilebilir mi?
   - https://a-z-horoscope.vercel.app/dashboard

4. ✅ Burç yorumu alınabiliyor mu?
   - https://a-z-horoscope.vercel.app/horoscope

## 🐛 Sorun Giderme

### Build Hatası
- Vercel dashboard'da "Deployments" → "Latest" → "View Function Logs"
- Hata mesajlarını kontrol edin

### Database Bağlantı Hatası
- Environment variables'ların doğru girildiğinden emin olun
- Neon database'in aktif olduğunu kontrol edin

### OAuth Hatası
- Callback URL'in doğru eklendiğinden emin olun
- Google Cloud Console'da OAuth consent screen'in yapılandırıldığından emin olun

### Gemini API Hatası
- API key'in doğru olduğundan emin olun
- API quota'nızı kontrol edin

## 📊 Vercel Analytics (Opsiyonel)

Vercel dashboard'da:
1. "Analytics" sekmesine gidin
2. "Enable Analytics" tıklayın
3. Kullanıcı trafiğini ve performansı izleyin

## 🔄 Otomatik Deployment

Her GitHub push işlemi otomatik olarak Vercel'de yeni bir deployment tetikler:
- `main` branch → Production deployment
- Diğer branch'ler → Preview deployment

## 🔐 Güvenlik Notları

- ⚠️ **ASLA** gerçek API key'leri veya şifreleri GitHub'a yüklemeyin
- ⚠️ `.env` dosyası `.gitignore`'da olmalı
- ⚠️ Hassas bilgileri sadece Vercel dashboard'da environment variables olarak ekleyin
- ⚠️ API key'leri düzenli olarak rotate edin

## 📝 Notlar

- ✅ Build başarılı (test edildi)
- ✅ TypeScript hataları yok
- ✅ ESLint hataları yok
- ✅ Database migration uygulandı
- ✅ Production-ready

## 🎉 Başarılı Deployment Sonrası

Projeniz şu adreste canlı olacak:
**https://a-z-horoscope.vercel.app**

Keyifli kullanımlar! 🚀
