/**
 * Public Natal Chart API Endpoint
 * 
 * POST /api/public/natal-chart
 * 
 * Giriş yapmamış kullanıcılar için doğum haritası hesaplama ve AI analizi
 * 
 * @author Manus AI
 * @date 12 Kasım 2025
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateNatalChart, HOUSE_SYSTEMS } from '@/lib/swisseph';
import { generateNatalChartAnalysis } from '@/lib/natal-chart-analysis';

/**
 * Request body interface
 */
interface PublicNatalChartRequest {
  birthDate: string;      // ISO 8601 format: "1990-01-15"
  birthTime: string;      // HH:MM format: "10:30"
  latitude: number;       // Enlem: 40.7128
  longitude: number;      // Boylam: -74.0060
  birthPlace?: string;    // Şehir adı (opsiyonel)
  houseSystem?: string;   // Opsiyonel, default: Placidus
  includeAnalysis?: boolean; // AI analizi dahil edilsin mi?
}

/**
 * POST /api/public/natal-chart
 * 
 * Public doğum haritası hesapla ve analiz et
 */
export async function POST(request: NextRequest) {
  try {
    // Request body parse
    const body: PublicNatalChartRequest = await request.json();

    // Validation
    if (!body.birthDate || !body.birthTime || !body.latitude || !body.longitude) {
      return NextResponse.json(
        { error: 'Eksik bilgi. Lütfen doğum tarihi, saati ve yeri girin.' },
        { status: 400 }
      );
    }

    // Tarih ve saat birleştirme
    const [hours, minutes] = body.birthTime.split(':').map(Number);
    const birthDateTime = new Date(body.birthDate);
    birthDateTime.setUTCHours(hours, minutes, 0, 0);

    // Koordinat validasyonu
    if (body.latitude < -90 || body.latitude > 90) {
      return NextResponse.json(
        { error: 'Geçersiz enlem (latitude). -90 ile 90 arasında olmalıdır.' },
        { status: 400 }
      );
    }

    if (body.longitude < -180 || body.longitude > 180) {
      return NextResponse.json(
        { error: 'Geçersiz boylam (longitude). -180 ile 180 arasında olmalıdır.' },
        { status: 400 }
      );
    }

    // Ev sistemi validasyonu
    const houseSystem = body.houseSystem || HOUSE_SYSTEMS.PLACIDUS;
    const validHouseSystems = Object.values(HOUSE_SYSTEMS) as string[];
    
    if (!validHouseSystems.includes(houseSystem)) {
      return NextResponse.json(
        { error: `Geçersiz ev sistemi. Geçerli seçenekler: ${validHouseSystems.join(', ')}` },
        { status: 400 }
      );
    }

    // Doğum haritası hesapla
    const natalChart = calculateNatalChart(
      birthDateTime,
      body.latitude,
      body.longitude,
      houseSystem as 'P' | 'K' | 'E' | 'W' | 'C' | 'R'
    );

    // AI analizi oluştur (eğer isteniyorsa)
    let analysis = null;
    if (body.includeAnalysis !== false) {
      try {
        analysis = await generateNatalChartAnalysis(
          {
            ...natalChart,
            birthDate: birthDateTime.toISOString(),
            houseSystem,
          },
          body.birthPlace
        );
      } catch (error) {
        console.error('[API] Natal chart analysis error:', error);
        // Analiz başarısız olsa bile chart'ı döndür
        analysis = null;
      }
    }

    // Response
    return NextResponse.json({
      success: true,
      data: {
        birthInfo: {
          date: birthDateTime.toISOString(),
          dateFormatted: birthDateTime.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          place: body.birthPlace || 'Özel Konum',
          latitude: body.latitude,
          longitude: body.longitude,
        },
        chart: {
          ...natalChart,
          houseSystem,
        },
        analysis: analysis,
        source: 'Swiss Ephemeris + Gemini AI',
      },
    });

  } catch (error) {
    console.error('[API] Public natal chart calculation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Doğum haritası hesaplanamadı. Lütfen bilgilerinizi kontrol edip tekrar deneyin.',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/public/natal-chart
 * 
 * API bilgilerini döndür
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Public Natal Chart API',
    description: 'Giriş yapmadan doğum haritası hesaplama ve AI analizi',
    endpoint: '/api/public/natal-chart',
    method: 'POST',
    requiredFields: {
      birthDate: 'string (YYYY-MM-DD)',
      birthTime: 'string (HH:MM)',
      latitude: 'number',
      longitude: 'number',
    },
    optionalFields: {
      birthPlace: 'string (şehir adı)',
      houseSystem: 'string (P, K, E, W, C, R)',
      includeAnalysis: 'boolean (default: true)',
    },
    houseSystems: {
      P: 'Placidus (default)',
      K: 'Koch',
      E: 'Equal',
      W: 'Whole Sign',
      C: 'Campanus',
      R: 'Regiomontanus',
    },
    example: {
      birthDate: '1990-01-15',
      birthTime: '10:30',
      latitude: 41.0082,
      longitude: 28.9784,
      birthPlace: 'İstanbul, Türkiye',
      houseSystem: 'P',
      includeAnalysis: true,
    },
  });
}
