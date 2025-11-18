import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { handleError } from '@/lib/errorHandler';
import { getCurrentAdmin } from '@/lib/authUtils';

/**
 * GET /api/admin/users
 * Tüm kullanıcıları listeler (pagination ile)
 */
export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (admin instanceof NextResponse) {
      return admin;
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    const skip = (page - 1) * limit;

    // Arama filtresi
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    // Kullanıcıları getir
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          zodiacSign: true,
          role: true,
          emailNotifications: true,
          createdAt: true,
          _count: {
            select: {
              horoscopeReadings: true,
              favoriteReadings: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
