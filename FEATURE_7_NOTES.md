# 👑 Özellik 7: Admin Paneli - Geliştirme Notları

**Tarih:** 11 Kasım 2025  
**Geliştirici:** Salih TANRISEVEN  
**Durum:** Planlama

---

## 🎯 Özellik Özeti

Admin kullanıcılar için özel panel (kullanıcı yönetimi, istatistikler, içerik yönetimi).

---

## 📋 Yapılacaklar Listesi

### 1. Database Schema Güncelleme
- [ ] `User` modeline `role` enum field ekle (USER, ADMIN)
- [ ] Migration oluştur ve uygula
- [ ] İlk admin kullanıcıyı manuel olarak ayarla

### 2. Admin Middleware
- [ ] `middleware.ts` güncelle (admin route koruması)
- [ ] Admin kontrolü için helper fonksiyon oluştur

### 3. Admin Layout
- [ ] `app/admin/layout.tsx` oluştur
- [ ] Admin sidebar/navigation
- [ ] Admin header

### 4. Admin Dashboard
- [ ] `app/admin/page.tsx` - Ana dashboard
- [ ] Toplam kullanıcı sayısı
- [ ] Toplam yorum sayısı
- [ ] Bugünkü aktif kullanıcılar
- [ ] Grafik ve chart'lar (Recharts)

### 5. Kullanıcı Yönetimi
- [ ] `app/admin/users/page.tsx` - Kullanıcı listesi
- [ ] Kullanıcı arama ve filtreleme
- [ ] Kullanıcı detay sayfası
- [ ] Kullanıcı rolü değiştirme
- [ ] Kullanıcı silme (soft delete)

### 6. İstatistikler
- [ ] `app/admin/stats/page.tsx` - İstatistikler sayfası
- [ ] Günlük/haftalık/aylık yorum grafikleri
- [ ] Burç dağılımı grafiği
- [ ] En popüler burçlar
- [ ] Kullanıcı büyüme grafiği

---

## 🛠️ Teknik Detaylar

### Prisma Schema Güncellemesi

```prisma
enum UserRole {
  USER
  ADMIN
}

model User {
  id                      String   @id @default(cuid())
  email                   String   @unique
  name                    String?
  image                   String?
  birthDate               DateTime? @map("birth_date")
  zodiacSign              String?   @map("zodiac_sign")
  emailNotifications      Boolean   @default(false) @map("email_notifications")
  notificationPreferences Json?     @default("{\"daily\": true, \"weekly\": false, \"monthly\": false}") @map("notification_preferences")
  role                    UserRole  @default(USER)
  createdAt               DateTime  @default(now()) @map("created_at")
  updatedAt               DateTime  @updatedAt @map("updated_at")
  
  accounts                Account[]
  sessions                Session[]
  readings                HoroscopeReading[]
  favoriteReadings        FavoriteReading[]
  
  @@map("users")
}
```

### Admin Middleware

```typescript
// middleware.ts
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
  
  if (isAdminRoute) {
    const session = req.auth
    
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    
    // Admin kontrolü
    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*"]
}
```

### Admin Helper Fonksiyonu

```typescript
// lib/admin.ts
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export async function requireAdmin() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }
  
  if (session.user.role !== "ADMIN") {
    redirect("/")
  }
  
  return session
}
```

### Admin Dashboard API

```typescript
// app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // İstatistikleri topla
    const [
      totalUsers,
      totalReadings,
      todayReadings,
      zodiacDistribution,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.horoscopeReading.count(),
      prisma.horoscopeReading.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.user.groupBy({
        by: ['zodiacSign'],
        _count: true,
        where: {
          zodiacSign: { not: null },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalReadings,
        todayReadings,
        zodiacDistribution,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
```

---

## 🎨 UI/UX Tasarım

### Admin Layout

```
┌─────────────────────────────────────────┐
│ [Logo] Admin Panel         [User Menu]  │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │  Content Area                │
│          │                              │
│ • Dashboard                             │
│ • Kullanıcılar                          │
│ • İstatistikler                         │
│ • Ayarlar                               │
│          │                              │
└──────────┴──────────────────────────────┘
```

### Dashboard Cards

```
┌─────────────────────────────────────────┐
│ 📊 Admin Dashboard                      │
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│ │ 👥 1,234│ │ 📝 5,678│ │ 🌟 89   │   │
│ │ Users   │ │ Readings│ │ Today   │   │
│ └─────────┘ └─────────┘ └─────────┘   │
│                                         │
│ ┌─────────────────────────────────┐   │
│ │ 📈 Kullanıcı Büyümesi           │   │
│ │ [Line Chart]                    │   │
│ └─────────────────────────────────┘   │
│                                         │
│ ┌─────────────────────────────────┐   │
│ │ 🎯 Burç Dağılımı                │   │
│ │ [Pie Chart]                     │   │
│ └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 📊 Kullanılacak Kütüphaneler

### Recharts (Grafik Kütüphanesi)

```bash
npm install recharts
```

### React Table (Veri Tablosu)

```bash
npm install @tanstack/react-table
```

---

## 📝 Önemli Notlar

1. **İlk Admin:** İlk admin kullanıcıyı veritabanında manuel olarak ayarlamak gerekecek
2. **Güvenlik:** Admin route'ları middleware ile korunmalı
3. **Performans:** İstatistikler için caching kullanılabilir
4. **Pagination:** Kullanıcı listesinde pagination olmalı
5. **Soft Delete:** Kullanıcı silme işlemi soft delete olmalı

---

## 📊 Başarı Kriterleri

- [ ] Prisma schema güncellendi
- [ ] Migration başarılı
- [ ] Admin middleware çalışıyor
- [ ] Admin dashboard oluşturuldu
- [ ] Kullanıcı listesi çalışıyor
- [ ] İstatistikler görüntüleniyor
- [ ] Grafikler render ediliyor
- [ ] Build başarılı
- [ ] TypeScript hatasız
- [ ] ESLint hatasız

---

**Sonraki Adım:** Prisma schema'yı güncelle ve migration oluştur
