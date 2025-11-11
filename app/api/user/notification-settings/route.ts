import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Bildirim tercihleri şeması
const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  preferences: z.object({
    daily: z.boolean(),
    weekly: z.boolean(),
    monthly: z.boolean(),
  }),
});

/**
 * POST /api/user/notification-settings
 * Kullanıcının bildirim tercihlerini günceller
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = notificationSchema.parse(body);

    // Kullanıcıyı güncelle
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        emailNotifications: validated.emailNotifications,
        notificationPreferences: validated.preferences,
      },
      select: {
        id: true,
        emailNotifications: true,
        notificationPreferences: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Bildirim tercihleri güncellendi',
      emailNotifications: user.emailNotifications,
      preferences: user.notificationPreferences,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Geçersiz veri formatı', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Bildirim ayarları güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Bildirim tercihleri güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/user/notification-settings
 * Kullanıcının mevcut bildirim tercihlerini getirir
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        emailNotifications: true,
        notificationPreferences: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Default değerler
    const defaultPreferences = {
      daily: true,
      weekly: false,
      monthly: false,
    };

    return NextResponse.json({
      success: true,
      emailNotifications: user.emailNotifications ?? false,
      preferences: user.notificationPreferences ?? defaultPreferences,
    });
  } catch (error) {
    console.error('Bildirim ayarları getirme hatası:', error);
    return NextResponse.json(
      { error: 'Bildirim tercihleri getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
