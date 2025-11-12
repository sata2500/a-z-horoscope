import { NextRequest, NextResponse } from "next/server"
import { generateMonthlyHoroscope } from "@/lib/gemini"
import { zodiacSigns, ZodiacSign } from "@/lib/zodiac"
import { prisma } from "@/lib/db"

/**
 * Public API - Giriş yapmamış kullanıcılar için aylık burç yorumu
 * 
 * Bu endpoint, Swiss Ephemeris verilerini kullanarak Gemini AI ile
 * her burç için profesyonel aylık yorumlar oluşturur.
 * 
 * Cache sistemi: Aynı ay için aynı burç yorumu tekrar oluşturulmaz.
 * 
 * Kullanım: GET /api/public/horoscope/monthly?sign=aries
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
    const today = new Date()
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    monthStart.setHours(0, 0, 0, 0)
    
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1)

    // Cache'de bu ay için yorum var mı kontrol et
    const cachedReading = await prisma.publicHoroscopeCache.findFirst({
      where: {
        zodiacSign: zodiacSign,
        readingType: "monthly",
        date: monthStart,
        expiresAt: {
          gt: new Date(),
        },
      },
    })

    if (cachedReading) {
      // Cache'den döndür
      return NextResponse.json({
        success: true,
        data: {
          zodiacSign: zodiacSign,
          zodiacNameTr: zodiacInfo.nameTr,
          zodiacSymbol: zodiacInfo.symbol,
          element: zodiacInfo.elementTr,
          planet: zodiacInfo.planetTr,
          monthStart: monthStart.toISOString(),
          monthEnd: monthEnd.toISOString(),
          monthFormatted: today.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
          reading: cachedReading.content,
          readingType: "monthly",
          source: "Swiss Ephemeris + Gemini AI",
          cached: true,
        }
      })
    }

    // Cache'de yok, yeni yorum oluştur
    const reading = await generateMonthlyHoroscope(zodiacSign, zodiacInfo)

    // Cache'e kaydet (gelecek ay başına kadar geçerli)
    await prisma.publicHoroscopeCache.create({
      data: {
        zodiacSign: zodiacSign,
        readingType: "monthly",
        content: reading,
        date: monthStart,
        expiresAt: nextMonthStart,
      },
    })
    
    return NextResponse.json({
      success: true,
      data: {
        zodiacSign: zodiacSign,
        zodiacNameTr: zodiacInfo.nameTr,
        zodiacSymbol: zodiacInfo.symbol,
        element: zodiacInfo.elementTr,
        planet: zodiacInfo.planetTr,
        monthStart: monthStart.toISOString(),
        monthEnd: monthEnd.toISOString(),
        monthFormatted: today.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
        reading: reading,
        readingType: "monthly",
        source: "Swiss Ephemeris + Gemini AI",
        cached: false,
      }
    })
  } catch (error) {
    console.error("Public monthly horoscope error:", error)
    return NextResponse.json(
      { 
        error: "Aylık burç yorumu oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
        details: error instanceof Error ? error.message : "Bilinmeyen hata"
      },
      { status: 500 }
    )
  }
}

/**
 * Tüm burçlar için aylık yorumları toplu olarak getir
 * 
 * Kullanım: POST /api/public/horoscope/monthly { "getAllSigns": true }
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
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    monthStart.setHours(0, 0, 0, 0)
    
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1)
    
    const allReadings: Record<string, any> = {}

    // Tüm burçlar için aylık yorum oluştur veya cache'den al
    for (const [sign, info] of Object.entries(zodiacSigns)) {
      try {
        // Cache'de var mı kontrol et
        const cachedReading = await prisma.publicHoroscopeCache.findFirst({
          where: {
            zodiacSign: sign,
            readingType: "monthly",
            date: monthStart,
            expiresAt: {
              gt: new Date(),
            },
          },
        })

        if (cachedReading) {
          // Cache'den al
          allReadings[sign] = {
            zodiacNameTr: info.nameTr,
            zodiacSymbol: info.symbol,
            element: info.elementTr,
            planet: info.planetTr,
            reading: cachedReading.content,
            cached: true,
          }
        } else {
          // Yeni yorum oluştur
          const reading = await generateMonthlyHoroscope(sign, info)
          
          // Cache'e kaydet
          await prisma.publicHoroscopeCache.create({
            data: {
              zodiacSign: sign,
              readingType: "monthly",
              content: reading,
              date: monthStart,
              expiresAt: nextMonthStart,
            },
          })

          allReadings[sign] = {
            zodiacNameTr: info.nameTr,
            zodiacSymbol: info.symbol,
            element: info.elementTr,
            planet: info.planetTr,
            reading: reading,
            cached: false,
          }
        }
      } catch (error) {
        console.error(`Error generating monthly horoscope for ${sign}:`, error)
        allReadings[sign] = {
          zodiacNameTr: info.nameTr,
          error: "Aylık yorum oluşturulamadı"
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        monthStart: monthStart.toISOString(),
        monthEnd: monthEnd.toISOString(),
        monthFormatted: today.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
        readings: allReadings,
        readingType: "monthly",
        source: "Swiss Ephemeris + Gemini AI"
      }
    })
  } catch (error) {
    console.error("Public monthly horoscope bulk error:", error)
    return NextResponse.json(
      { 
        error: "Toplu aylık burç yorumları oluşturulurken bir hata oluştu.",
        details: error instanceof Error ? error.message : "Bilinmeyen hata"
      },
      { status: 500 }
    )
  }
}
