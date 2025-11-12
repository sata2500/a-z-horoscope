import { NextRequest, NextResponse } from "next/server"
import { generateDailyHoroscope } from "@/lib/gemini"
import { zodiacSigns, ZodiacSign } from "@/lib/zodiac"
import { prisma } from "@/lib/db"

/**
 * Public API - Giriş yapmamış kullanıcılar için günlük burç yorumu
 * 
 * Bu endpoint, Swiss Ephemeris verilerini kullanarak Gemini AI ile
 * her burç için profesyonel günlük yorumlar oluşturur.
 * 
 * Cache sistemi: Aynı gün için aynı burç yorumu tekrar oluşturulmaz.
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
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Cache'de bugün için yorum var mı kontrol et
    const cachedReading = await prisma.publicHoroscopeCache.findFirst({
      where: {
        zodiacSign: zodiacSign,
        readingType: "daily",
        date: {
          gte: today,
          lt: tomorrow,
        },
        expiresAt: {
          gt: new Date(), // Henüz expire olmamış
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
          date: cachedReading.date.toISOString(),
          dateFormatted: cachedReading.date.toLocaleDateString('tr-TR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          }),
          reading: cachedReading.content,
          readingType: "daily",
          source: "Swiss Ephemeris + Gemini AI",
          cached: true,
        }
      })
    }

    // Cache'de yok, yeni yorum oluştur
    const reading = await generateDailyHoroscope(zodiacSign, zodiacInfo)

    // Cache'e kaydet (yarın gece yarısına kadar geçerli)
    const expiresAt = new Date(tomorrow)
    expiresAt.setHours(0, 0, 0, 0)

    await prisma.publicHoroscopeCache.create({
      data: {
        zodiacSign: zodiacSign,
        readingType: "daily",
        content: reading,
        date: today,
        expiresAt: expiresAt,
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
        date: today.toISOString(),
        dateFormatted: today.toLocaleDateString('tr-TR', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }),
        reading: reading,
        readingType: "daily",
        source: "Swiss Ephemeris + Gemini AI",
        cached: false,
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
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const allReadings: Record<string, any> = {}

    // Tüm burçlar için yorum oluştur veya cache'den al
    for (const [sign, info] of Object.entries(zodiacSigns)) {
      try {
        // Cache'de var mı kontrol et
        const cachedReading = await prisma.publicHoroscopeCache.findFirst({
          where: {
            zodiacSign: sign,
            readingType: "daily",
            date: {
              gte: today,
              lt: tomorrow,
            },
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
          const reading = await generateDailyHoroscope(sign, info)
          
          // Cache'e kaydet
          const expiresAt = new Date(tomorrow)
          expiresAt.setHours(0, 0, 0, 0)

          await prisma.publicHoroscopeCache.create({
            data: {
              zodiacSign: sign,
              readingType: "daily",
              content: reading,
              date: today,
              expiresAt: expiresAt,
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
