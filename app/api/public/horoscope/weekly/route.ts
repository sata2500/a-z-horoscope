import { NextRequest, NextResponse } from "next/server"
import { generateWeeklyHoroscope } from "@/lib/gemini"
import { zodiacSigns, ZodiacSign } from "@/lib/zodiac"

/**
 * Public API - Giriş yapmamış kullanıcılar için haftalık burç yorumu
 * 
 * Bu endpoint, Swiss Ephemeris verilerini kullanarak Gemini AI ile
 * her burç için profesyonel haftalık yorumlar oluşturur.
 * 
 * Kullanım: GET /api/public/horoscope/weekly?sign=aries
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

    // Gemini AI ile haftalık yorum oluştur
    const reading = await generateWeeklyHoroscope(zodiacSign, zodiacInfo)

    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay() + 1) // Pazartesi
    
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6) // Pazar
    
    return NextResponse.json({
      success: true,
      data: {
        zodiacSign: zodiacSign,
        zodiacNameTr: zodiacInfo.nameTr,
        zodiacSymbol: zodiacInfo.symbol,
        element: zodiacInfo.elementTr,
        planet: zodiacInfo.planetTr,
        weekStart: weekStart.toISOString(),
        weekEnd: weekEnd.toISOString(),
        weekFormatted: `${weekStart.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} - ${weekEnd.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}`,
        reading: reading,
        readingType: "weekly",
        source: "Swiss Ephemeris + Gemini AI"
      }
    })
  } catch (error) {
    console.error("Public weekly horoscope error:", error)
    return NextResponse.json(
      { 
        error: "Haftalık burç yorumu oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
        details: error instanceof Error ? error.message : "Bilinmeyen hata"
      },
      { status: 500 }
    )
  }
}

/**
 * Tüm burçlar için haftalık yorumları toplu olarak getir
 * 
 * Kullanım: POST /api/public/horoscope/weekly { "getAllSigns": true }
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
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay() + 1)
    
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    
    const allReadings: Record<string, any> = {}

    // Tüm burçlar için haftalık yorum oluştur
    for (const [sign, info] of Object.entries(zodiacSigns)) {
      try {
        const reading = await generateWeeklyHoroscope(sign, info)
        allReadings[sign] = {
          zodiacNameTr: info.nameTr,
          zodiacSymbol: info.symbol,
          element: info.elementTr,
          planet: info.planetTr,
          reading: reading
        }
      } catch (error) {
        console.error(`Error generating weekly horoscope for ${sign}:`, error)
        allReadings[sign] = {
          zodiacNameTr: info.nameTr,
          error: "Haftalık yorum oluşturulamadı"
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        weekStart: weekStart.toISOString(),
        weekEnd: weekEnd.toISOString(),
        weekFormatted: `${weekStart.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} - ${weekEnd.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}`,
        readings: allReadings,
        readingType: "weekly",
        source: "Swiss Ephemeris + Gemini AI"
      }
    })
  } catch (error) {
    console.error("Public weekly horoscope bulk error:", error)
    return NextResponse.json(
      { 
        error: "Toplu haftalık burç yorumları oluşturulurken bir hata oluştu.",
        details: error instanceof Error ? error.message : "Bilinmeyen hata"
      },
      { status: 500 }
    )
  }
}
