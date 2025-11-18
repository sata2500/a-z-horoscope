import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { handleError } from "@/lib/errorHandler";
import { getCurrentUser } from "@/lib/authUtils";

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
    const user = await getCurrentUser();
    if (user instanceof NextResponse) {
      return user;
    }
    
    if (!user.email) {
      return NextResponse.json(
        { error: "Email not found" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validated = notificationSchema.parse(body);

    // Kullanıcıyı güncelle
    const updatedUser = await prisma.user.update({
      where: { email: user.email },
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
      message: "Bildirim tercihleri güncellendi",
      emailNotifications: updatedUser.emailNotifications,
      preferences: updatedUser.notificationPreferences,
    });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * GET /api/user/notification-settings
 * Kullanıcının mevcut bildirim tercihlerini getirir
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (user instanceof NextResponse) {
      return user;
    }
    
    if (!user.email) {
      return NextResponse.json(
        { error: "Email not found" },
        { status: 400 }
      );
    }
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: {
        emailNotifications: true,
        notificationPreferences: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
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
      emailNotifications: dbUser.emailNotifications ?? false,
      preferences: dbUser.notificationPreferences ?? defaultPreferences,
    });
  } catch (error) {
    return handleError(error);
  }
}
