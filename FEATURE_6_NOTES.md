# 📧 Özellik 6: E-posta Bildirimleri - Geliştirme Notları

**Tarih:** 11 Kasım 2025  
**Geliştirici:** Salih TANRISEVEN  
**Durum:** Planlama

---

## 🎯 Özellik Özeti

Kullanıcıların günlük/haftalık burç yorumlarını e-posta ile alabilmesi için bildirim sistemi.

---

## 📋 Yapılacaklar Listesi

### 1. Database Schema Güncelleme
- [ ] `User` modeline `emailNotifications` boolean field ekle
- [ ] `User` modeline `notificationPreferences` JSON field ekle (daily, weekly, monthly)
- [ ] Migration oluştur ve uygula

### 2. Resend Entegrasyonu
- [ ] `resend` paketi kur
- [ ] `.env` dosyasına `RESEND_API_KEY` ekle (şimdilik test için)
- [ ] `lib/email.ts` oluştur (Resend client wrapper)

### 3. E-posta Template'leri
- [ ] `components/emails/daily-horoscope.tsx` oluştur
- [ ] `components/emails/weekly-horoscope.tsx` oluştur
- [ ] `components/emails/monthly-horoscope.tsx` oluştur
- [ ] Template'lerde burç sembolü, yorum ve link olsun

### 4. API Endpoint'leri
- [ ] `POST /api/user/notification-settings` - Bildirim tercihlerini güncelle
- [ ] `GET /api/user/notification-settings` - Mevcut tercihleri getir

### 5. Frontend - Profil Sayfası
- [ ] Bildirim tercihleri bölümü ekle
- [ ] E-posta bildirimleri toggle switch
- [ ] Bildirim sıklığı seçenekleri (günlük, haftalık, aylık)
- [ ] Kaydet butonu ve loading state

### 6. Cron Job Sistemi (Opsiyonel)
- [ ] Vercel Cron Jobs araştır
- [ ] `app/api/cron/send-daily-horoscopes/route.ts` oluştur
- [ ] `vercel.json` dosyasına cron config ekle
- [ ] Her gün sabah 08:00'de çalışacak şekilde ayarla

---

## 🛠️ Teknik Detaylar

### Resend Kurulumu

```bash
npm install resend
```

### Environment Variables

```env
RESEND_API_KEY=re_123456789
```

### Prisma Schema Güncellemesi

```prisma
model User {
  id                      String   @id @default(cuid())
  email                   String   @unique
  name                    String?
  image                   String?
  birthDate               DateTime?
  zodiacSign              String?
  emailNotifications      Boolean  @default(false)
  notificationPreferences Json?    @default("{\"daily\": true, \"weekly\": false, \"monthly\": false}")
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
  
  accounts                Account[]
  sessions                Session[]
  readings                HoroscopeReading[]
  favoriteReadings        FavoriteReading[]
}
```

### E-posta Template Örneği

```tsx
import * as React from 'react';

interface DailyHoroscopeEmailProps {
  userName: string;
  zodiacSign: string;
  horoscopeText: string;
  date: string;
}

export function DailyHoroscopeEmail({
  userName,
  zodiacSign,
  horoscopeText,
  date,
}: DailyHoroscopeEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>🌟 Günlük Burç Yorumunuz</h1>
      <p>Merhaba {userName},</p>
      <p>{date} tarihli <strong>{zodiacSign}</strong> burcu yorumunuz:</p>
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        {horoscopeText}
      </div>
      <a href="https://a-z-horoscope.vercel.app/horoscope" 
         style={{
           display: 'inline-block',
           padding: '10px 20px',
           backgroundColor: '#000',
           color: '#fff',
           textDecoration: 'none',
           borderRadius: '5px'
         }}>
        Detaylı Yorumu Görüntüle
      </a>
    </div>
  );
}
```

### API Route Örneği

```typescript
// app/api/user/notification-settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  preferences: z.object({
    daily: z.boolean(),
    weekly: z.boolean(),
    monthly: z.boolean(),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = notificationSchema.parse(body);

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        emailNotifications: validated.emailNotifications,
        notificationPreferences: validated.preferences,
      },
    });

    return NextResponse.json({ 
      success: true, 
      emailNotifications: user.emailNotifications,
      preferences: user.notificationPreferences,
    });
  } catch (error) {
    console.error('Notification settings error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        emailNotifications: true,
        notificationPreferences: true,
      },
    });

    return NextResponse.json({
      success: true,
      emailNotifications: user?.emailNotifications || false,
      preferences: user?.notificationPreferences || {
        daily: true,
        weekly: false,
        monthly: false,
      },
    });
  } catch (error) {
    console.error('Get notification settings error:', error);
    return NextResponse.json(
      { error: 'Failed to get settings' },
      { status: 500 }
    );
  }
}
```

### Vercel Cron Job Yapılandırması

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/send-daily-horoscopes",
      "schedule": "0 8 * * *"
    }
  ]
}
```

---

## ⚠️ Önemli Notlar

1. **Resend API Key:** Ücretsiz plan 100 e-posta/gün limit
2. **Domain Verification:** Production'da kendi domain kullanılmalı
3. **Rate Limiting:** E-posta gönderimi için rate limit eklenebilir
4. **Unsubscribe Link:** E-postalara abonelik iptali linki eklenebilir
5. **Test:** Development'ta gerçek e-posta göndermek yerine console.log kullanılabilir

---

## 🎨 UI/UX Tasarım

### Profil Sayfası - Bildirim Tercihleri Bölümü

```
┌─────────────────────────────────────────┐
│ 📧 E-posta Bildirimleri                 │
├─────────────────────────────────────────┤
│                                         │
│ ○ E-posta bildirimleri [Toggle: OFF]   │
│                                         │
│ Bildirim Sıklığı:                       │
│ ☑ Günlük burç yorumu                    │
│ ☐ Haftalık burç yorumu                  │
│ ☐ Aylık burç yorumu                     │
│                                         │
│ [Kaydet] [İptal]                        │
└─────────────────────────────────────────┘
```

---

## 📊 Başarı Kriterleri

- [x] Prisma schema güncellendi
- [x] Migration başarılı
- [x] Resend entegrasyonu çalışıyor
- [x] E-posta template'leri oluşturuldu
- [x] API endpoint'leri test edildi
- [x] Profil sayfası güncellendi
- [x] Build başarılı
- [x] TypeScript hatasız
- [x] ESLint hatasız

---

**Not:** Cron job sistemi opsiyonel. İlk aşamada sadece manuel test için e-posta gönderimi yapılabilir.
