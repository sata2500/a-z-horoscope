/**
 * Natal Chart API Endpoint
 * 
 * POST /api/astrology/natal-chart
 * 
 * Kullanıcının doğum bilgilerine göre doğum haritasını hesaplar.
 * 
 * @author Salih TANRISEVEN
 * @date 11 Kasım 2025
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { calculateNatalChart, HOUSE_SYSTEMS } from '@/lib/swisseph';

/**
 * Request body interface
 */
interface NatalChartRequest {
  birthDate: string;      // ISO 8601 format: "1990-01-15T10:30:00Z"
  birthTime: string;      // HH:MM format: "10:30"
  latitude: number;       // Enlem: 40.7128
  longitude: number;      // Boylam: -74.0060
  houseSystem?: string;   // Opsiyonel, default: Placidus
}

/**
 * POST /api/astrology/natal-chart
 * 
 * Doğum haritası hesapla
 */
export async function POST(request: NextRequest) {
  try {
    // Auth kontrolü
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Request body parse
    const body: NatalChartRequest = await request.json();

    // Validation
    if (!body.birthDate || !body.latitude || !body.longitude) {
      return NextResponse.json(
        { error: 'Missing required fields: birthDate, latitude, longitude' },
        { status: 400 }
      );
    }

    // Tarih ve saat birleştirme
    let birthDateTime: Date;
    
    if (body.birthTime) {
      // Eğer birthTime verilmişse, birthDate'e ekle
      const [hours, minutes] = body.birthTime.split(':').map(Number);
      birthDateTime = new Date(body.birthDate);
      birthDateTime.setUTCHours(hours, minutes, 0, 0);
    } else {
      // Sadece tarih verilmişse, öğlen (12:00) kullan
      birthDateTime = new Date(body.birthDate);
      birthDateTime.setUTCHours(12, 0, 0, 0);
    }

    // Koordinat validasyonu
    if (body.latitude < -90 || body.latitude > 90) {
      return NextResponse.json(
        { error: 'Invalid latitude (must be between -90 and 90)' },
        { status: 400 }
      );
    }

    if (body.longitude < -180 || body.longitude > 180) {
      return NextResponse.json(
        { error: 'Invalid longitude (must be between -180 and 180)' },
        { status: 400 }
      );
    }

    // Ev sistemi validasyonu
    const houseSystem = body.houseSystem || HOUSE_SYSTEMS.PLACIDUS;
    const validHouseSystems = Object.values(HOUSE_SYSTEMS) as string[];
    
    if (!validHouseSystems.includes(houseSystem)) {
      return NextResponse.json(
        { error: `Invalid house system. Valid options: ${validHouseSystems.join(', ')}` },
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

    // Response
    return NextResponse.json({
      success: true,
      data: {
        ...natalChart,
        birthDate: birthDateTime.toISOString(),
        houseSystem,
      },
    });

  } catch (error) {
    console.error('[API] Natal chart calculation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to calculate natal chart',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/astrology/natal-chart
 * 
 * Kullanıcının kayıtlı doğum haritasını getir (eğer varsa)
 */
export async function GET() {
  try {
    // Auth kontrolü
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // TODO: Database'den kullanıcının kayıtlı doğum haritasını getir
    // Şimdilik placeholder response
    
    return NextResponse.json({
      success: true,
      message: 'Natal chart retrieval not implemented yet',
      data: null,
    });

  } catch (error) {
    console.error('[API] Natal chart retrieval error:', error);
    
    return NextResponse.json(
      { error: 'Failed to retrieve natal chart' },
      { status: 500 }
    );
  }
}
