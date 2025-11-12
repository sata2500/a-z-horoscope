import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

/**
 * GET /api/admin/stats
 * Admin istatistiklerini getirir
 */
export async function GET() {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    // Bugünün başlangıcı
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Bu haftanın başlangıcı (Pazartesi)
    const thisWeek = new Date();
    const day = thisWeek.getDay();
    const diff = thisWeek.getDate() - day + (day === 0 ? -6 : 1);
    thisWeek.setDate(diff);
    thisWeek.setHours(0, 0, 0, 0);

    // Bu ayın başlangıcı
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    // İstatistikleri topla
    const [
      totalUsers,
      totalReadings,
      todayReadings,
      thisWeekReadings,
      thisMonthReadings,
      totalFavorites,
      zodiacDistribution,
      readingTypeDistribution,
      recentUsers,
      dailyReadingsLast7Days,
    ] = await Promise.all([
      // Toplam kullanıcı sayısı
      prisma.user.count(),
      
      // Toplam yorum sayısı
      prisma.horoscopeReading.count(),
      
      // Bugünkü yorumlar
      prisma.horoscopeReading.count({
        where: {
          createdAt: { gte: today },
        },
      }),
      
      // Bu haftaki yorumlar
      prisma.horoscopeReading.count({
        where: {
          createdAt: { gte: thisWeek },
        },
      }),
      
      // Bu ayki yorumlar
      prisma.horoscopeReading.count({
        where: {
          createdAt: { gte: thisMonth },
        },
      }),
      
      // Toplam favori sayısı
      prisma.favoriteReading.count(),
      
      // Burç dağılımı
      prisma.user.groupBy({
        by: ['zodiacSign'],
        _count: true,
        where: {
          zodiacSign: { not: null },
        },
      }),
      
      // Yorum tipi dağılımı
      prisma.horoscopeReading.groupBy({
        by: ['readingType'],
        _count: true,
      }),
      
      // Son 10 kullanıcı
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          zodiacSign: true,
          createdAt: true,
        },
      }),
      
      // Son 7 günün günlük yorum sayıları
      Promise.all(
        Array.from({ length: 7 }, async (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          date.setHours(0, 0, 0, 0);
          
          const nextDate = new Date(date);
          nextDate.setDate(nextDate.getDate() + 1);
          
          const count = await prisma.horoscopeReading.count({
            where: {
              createdAt: {
                gte: date,
                lt: nextDate,
              },
            },
          });
          
          return {
            date: date.toLocaleDateString('tr-TR', { 
              day: '2-digit', 
              month: '2-digit' 
            }),
            count,
          };
        })
      ),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        overview: {
          totalUsers,
          totalReadings,
          todayReadings,
          thisWeekReadings,
          thisMonthReadings,
          totalFavorites,
        },
        zodiacDistribution: zodiacDistribution.map(item => ({
          zodiacSign: item.zodiacSign,
          count: item._count,
        })),
        readingTypeDistribution: readingTypeDistribution.map(item => ({
          type: item.readingType,
          count: item._count,
        })),
        recentUsers,
        dailyReadingsLast7Days,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'İstatistikler alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}
