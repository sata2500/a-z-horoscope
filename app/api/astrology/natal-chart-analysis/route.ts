/**
 * Natal Chart Analysis API Endpoint
 * 
 * POST /api/astrology/natal-chart-analysis
 * 
 * Doğum haritası için AI analizi oluşturur.
 * 
 * @author Manus AI
 * @date 12 Kasım 2025
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { generateNatalChartAnalysis } from '@/lib/natal-chart-analysis';

/**
 * POST /api/astrology/natal-chart-analysis
 * 
 * Doğum haritası AI analizi oluştur
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
    const body = await request.json();
    const { chartData, birthPlace } = body;

    // Validation
    if (!chartData || !chartData.planets || !chartData.houses) {
      return NextResponse.json(
        { error: 'Invalid chart data' },
        { status: 400 }
      );
    }

    // AI analizi oluştur
    const analysis = await generateNatalChartAnalysis(chartData, birthPlace);

    // Response
    return NextResponse.json({
      success: true,
      analysis,
    });

  } catch (error) {
    console.error('[API] Natal chart analysis error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate natal chart analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
