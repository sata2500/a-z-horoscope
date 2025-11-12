import { NextRequest, NextResponse } from "next/server"
import { generateDailyHoroscope } from "@/lib/gemini"
import { zodiacSigns, ZodiacSign } from "@/lib/zodiac"

/**
 * Public API - Giriş yapmamış kullanıcılar için günlük burç yorumu
 * 
 * Bu endpoint, Swiss Ephemeris verilerini kullanarak Gemini AI ile
 * her burç için profesyonel günlük yorumlar oluşturur.
 * 
 * Kullanım: GET /api/public/horoscope/daily?sign=aries
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const zodiacSign = searchParams.get("sign")

    // Burç parametresi kontrolü
    if (!zodiacSign || !zodiacSigns[zodiacSign as ZodiacSign]) {
      return NextResponse.json(
        { 
          error: "Geçersiz burç. Lütfen geçerli bir burç adı girin.",
          validSigns: Object.keys(zodiacSigns)
        },
        { status: 400 }
      )
    }

    const zodiacInfo = zodiacSigns[zodiacSign as ZodiacSign]

    // Gemini AI ile günlük yorum oluştur
    // Swiss Ephemeris verileri otomatik olarak generateDailyHoroscope içinde kullanılıyor
    const reading = await generateDailyHoroscope(zodiacSign, zodiacInfo)

    const today = new Date()
    
    return NextResponse.json({
      success: true,
      data: {
        zodiacSign: zodiacSign,
        zodiacNameTr: zodiacInfo.nameTr,
        zodiacSymbol: zodiacInfo.symbol,
        element: zodiacInfo.elementTr,
        planet: zodiacInfo.planetTr,
        date: today.toISOString(),
        dateFormatted: today.toLocaleDateString('tr-TR', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }),
        reading: reading,
        readingType: "daily",
        source: "Swiss Ephemeris + Gemini AI"
      }
    })
  } catch (error) {
    console.error("Public daily horoscope error:", error)
    return NextResponse.json(
      { 
        error: "Burç yorumu oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
        details: error instanceof Error ? error.message : "Bilinmeyen hata"
      },
      { status: 500 }
    )
  }
}

/**
 * Tüm burçlar için günlük yorumları toplu olarak getir
 * 
 * Kullanım: GET /api/public/horoscope/daily?all=true
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { getAllSigns } = body

    if (!getAllSigns) {
      return NextResponse.json(
        { error: "Bu endpoint tüm burçları almak için kullanılır. getAllSigns: true gönderin." },
        { status: 400 }
      )
    }

    const today = new Date()
    const allReadings: Record<string, any> = {}

    // Tüm burçlar için yorum oluştur
    for (const [sign, info] of Object.entries(zodiacSigns)) {
      try {
        const reading = await generateDailyHoroscope(sign, info)
        allReadings[sign] = {
          zodiacNameTr: info.nameTr,
          zodiacSymbol: info.symbol,
          element: info.elementTr,
          planet: info.planetTr,
          reading: reading
        }
      } catch (error) {
        console.error(`Error generating horoscope for ${sign}:`, error)
        allReadings[sign] = {
          zodiacNameTr: info.nameTr,
          error: "Yorum oluşturulamadı"
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        date: today.toISOString(),
        dateFormatted: today.toLocaleDateString('tr-TR', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }),
        readings: allReadings,
        readingType: "daily",
        source: "Swiss Ephemeris + Gemini AI"
      }
    })
  } catch (error) {
    console.error("Public daily horoscope bulk error:", error)
    return NextResponse.json(
      { 
        error: "Toplu burç yorumları oluşturulurken bir hata oluştu.",
        details: error instanceof Error ? error.message : "Bilinmeyen hata"
      },
      { status: 500 }
    )
  }
}
