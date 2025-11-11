/**
 * Transit API Endpoint
 * 
 * POST /api/astrology/transit
 * 
 * Belirli bir tarihteki gezegen pozisyonlarını (transit'leri) hesaplar.
 * 
 * @author Salih TANRISEVEN
 * @date 11 Kasım 2025
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { calculateTransits } from '@/lib/swisseph';

/**
 * Request body interface
 */
interface TransitRequest {
  date?: string;  // ISO 8601 format, opsiyonel (default: bugün)
}

/**
 * POST /api/astrology/transit
 * 
 * Transit hesapla
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
    const body: TransitRequest = await request.json().catch(() => ({}));

    // Tarih belirleme (default: bugün)
    const date = body.date ? new Date(body.date) : new Date();

    // Tarih validasyonu
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Transit'leri hesapla
    const transits = calculateTransits(date);

    // Response
    return NextResponse.json({
      success: true,
      data: {
        date: date.toISOString(),
        transits,
      },
    });

  } catch (error) {
    console.error('[API] Transit calculation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to calculate transits',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/astrology/transit
 * 
 * Bugünkü transit'leri getir (shortcut)
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

    // Bugünkü transit'leri hesapla
    const transits = calculateTransits(new Date());

    // Response
    return NextResponse.json({
      success: true,
      data: {
        date: new Date().toISOString(),
        transits,
      },
    });

  } catch (error) {
    console.error('[API] Transit calculation error:', error);
    
    return NextResponse.json(
      { error: 'Failed to calculate transits' },
      { status: 500 }
    );
  }
}
