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

Vercel dashboard'da "Environment Variables" bölümüne aşağıdaki değerleri ekleyin:

#### Database
```
DATABASE_URL=postgresql://neondb_owner:npg_pEfCKRZj3m0G@ep-lucky-morning-ahgt7ksy-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

#### Google Gemini API
```
GOOGLE_API_KEY=AIzaSyA645VUeieOsJ6QXa4iS5UF9tFX5KRDQDc
```

#### Google OAuth
```
GOOGLE_CLIENT_ID=70300079475-v9gl5i9s7tum3lpqqeaiccjgco6n1gpb.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

#### Auth.js
```
AUTH_SECRET=obVFKVADXKoNvjSGSnK2bALQUTaqumWYqXxLqzlbikY=
NEXTAUTH_URL=https://a-z-horoscope.vercel.app
AUTH_TRUST_HOST=true
```

#### Stack Auth (Opsiyonel)
```
NEXT_PUBLIC_STACK_PROJECT_ID=50d6046b-c873-46d9-b6b0-a62aed3e7944
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pck_f0htz6gnv0dcps1feacb36xqkdz65k1h2qkteeczb2he0
STACK_SECRET_SERVER_KEY=ssk_3hnbpbbt5jkm1q3aqqt6vd2wfjks00hmk74pvwbt9z7y8
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

## 📝 Notlar

- ✅ Build başarılı (test edildi)
- ✅ TypeScript hataları yok
- ✅ ESLint hataları yok
- ✅ Database migration uygulandı
- ✅ Tüm environment variables hazır
- ✅ Production-ready

## 🎉 Başarılı Deployment Sonrası

Projeniz şu adreste canlı olacak:
**https://a-z-horoscope.vercel.app**

Keyifli kullanımlar! 🚀
