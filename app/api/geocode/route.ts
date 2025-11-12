/**
 * Geocoding API Endpoint
 * 
 * GET /api/geocode?q=city
 * 
 * OpenStreetMap Nominatim kullanarak global şehir arama ve koordinat bulma
 * 
 * @author Manus AI
 * @date 12 Kasım 2025
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Nominatim API response interface
 */
interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  importance: number;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
}

/**
 * Simplified location result
 */
interface LocationResult {
  id: number;
  name: string;
  displayName: string;
  latitude: number;
  longitude: number;
  type: string;
  country?: string;
  countryCode?: string;
}

/**
 * GET /api/geocode
 * 
 * Şehir adına göre koordinat bulma
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Lütfen en az 2 karakter girin' },
        { status: 400 }
      );
    }

    // OpenStreetMap Nominatim API
    const nominatimUrl = new URL('https://nominatim.openstreetmap.org/search');
    nominatimUrl.searchParams.set('q', query);
    nominatimUrl.searchParams.set('format', 'json');
    nominatimUrl.searchParams.set('addressdetails', '1');
    nominatimUrl.searchParams.set('limit', '10');
    nominatimUrl.searchParams.set('accept-language', 'tr,en');

    const response = await fetch(nominatimUrl.toString(), {
      headers: {
        'User-Agent': 'AZ-Horoscope/1.0 (https://a-z-horoscope.vercel.app)',
      },
    });

    if (!response.ok) {
      throw new Error('Nominatim API hatası');
    }

    const data: NominatimResult[] = await response.json();

    // Sonuçları filtrele ve formatla
    const results: LocationResult[] = data
      .filter(item => {
        // Sadece şehir, kasaba, köy gibi yerleşim yerlerini al
        const validTypes = ['city', 'town', 'village', 'municipality', 'administrative'];
        return validTypes.some(type => item.type.includes(type) || item.display_name.toLowerCase().includes(type));
      })
      .slice(0, 5) // İlk 5 sonuç
      .map(item => ({
        id: item.place_id,
        name: item.address?.city || item.address?.town || item.address?.village || query,
        displayName: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        type: item.type,
        country: item.address?.country,
        countryCode: item.address?.country_code?.toUpperCase(),
      }));

    // Eğer hiç sonuç yoksa, tüm sonuçları döndür
    if (results.length === 0 && data.length > 0) {
      const allResults: LocationResult[] = data.slice(0, 5).map(item => ({
        id: item.place_id,
        name: query,
        displayName: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        type: item.type,
        country: item.address?.country,
        countryCode: item.address?.country_code?.toUpperCase(),
      }));

      return NextResponse.json({
        success: true,
        query,
        count: allResults.length,
        results: allResults,
      });
    }

    return NextResponse.json({
      success: true,
      query,
      count: results.length,
      results,
    });

  } catch (error) {
    console.error('[API] Geocoding error:', error);
    
    return NextResponse.json(
      { 
        error: 'Konum arama başarısız oldu. Lütfen tekrar deneyin.',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    );
  }
}
