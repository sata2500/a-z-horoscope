import { NextRequest, NextResponse } from "next/server"
import { generateWeeklyHoroscope } from "@/lib/gemini"
import { zodiacSigns, ZodiacSign } from "@/lib/zodiac"
import { prisma } from "@/lib/db"

/**
 * Haftanın başlangıç tarihini hesapla (Pazartesi)
 */
function getWeekStart(date: Date): Date {
  const weekStart = new Date(date)
  const day = weekStart.getDay()
  const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1) // Pazartesi
  weekStart.setDate(diff)
  weekStart.setHours(0, 0, 0, 0)
  return weekStart
}

/**
 * Public API - Giriş yapmamış kullanıcılar için haftalık burç yorumu
 * 
 * Bu endpoint, Swiss Ephemeris verilerini kullanarak Gemini AI ile
 * her burç için profesyonel haftalık yorumlar oluşturur.
 * 
 * Cache sistemi: Aynı hafta için aynı burç yorumu tekrar oluşturulmaz.
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
    const today = new Date()
    const weekStart = getWeekStart(today)
    
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    
    const nextWeekStart = new Date(weekStart)
    nextWeekStart.setDate(weekStart.getDate() + 7)

    // Cache'de bu hafta için yorum var mı kontrol et
    const cachedReading = await prisma.publicHoroscopeCache.findFirst({
      where: {
        zodiacSign: zodiacSign,
        readingType: "weekly",
        date: weekStart,
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
          weekStart: weekStart.toISOString(),
          weekEnd: weekEnd.toISOString(),
          weekFormatted: `${weekStart.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} - ${weekEnd.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}`,
          reading: cachedReading.content,
          readingType: "weekly",
          source: "Swiss Ephemeris + Gemini AI",
          cached: true,
        }
      })
    }

    // Cache'de yok, yeni yorum oluştur
    const reading = await generateWeeklyHoroscope(zodiacSign, zodiacInfo)

    // Cache'e kaydet (gelecek hafta başına kadar geçerli)
    await prisma.publicHoroscopeCache.create({
      data: {
        zodiacSign: zodiacSign,
        readingType: "weekly",
        content: reading,
        date: weekStart,
        expiresAt: nextWeekStart,
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
        weekStart: weekStart.toISOString(),
        weekEnd: weekEnd.toISOString(),
        weekFormatted: `${weekStart.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} - ${weekEnd.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}`,
        reading: reading,
        readingType: "weekly",
        source: "Swiss Ephemeris + Gemini AI",
        cached: false,
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
    const weekStart = getWeekStart(today)
    
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    
    const nextWeekStart = new Date(weekStart)
    nextWeekStart.setDate(weekStart.getDate() + 7)
    
    const allReadings: Record<string, {
      zodiacNameTr: string;
      zodiacSymbol: string;
      element: string;
      planet: string;
      reading: string;
      cached: boolean;
    }> = {}

    // Tüm burçlar için haftalık yorum oluştur veya cache'den al
    for (const [sign, info] of Object.entries(zodiacSigns)) {
      try {
        // Cache'de var mı kontrol et
        const cachedReading = await prisma.publicHoroscopeCache.findFirst({
          where: {
            zodiacSign: sign,
            readingType: "weekly",
            date: weekStart,
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
          const reading = await generateWeeklyHoroscope(sign, info)
          
          // Cache'e kaydet
          await prisma.publicHoroscopeCache.create({
            data: {
              zodiacSign: sign,
              readingType: "weekly",
              content: reading,
              date: weekStart,
              expiresAt: nextWeekStart,
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
        console.error(`Error generating weekly horoscope for ${sign}:`, error)
        allReadings[sign] = {
          zodiacNameTr: info.nameTr,
          zodiacSymbol: info.symbol,
          element: info.elementTr,
          planet: info.planetTr,
          reading: "Haftalık yorum oluşturulamadı. Lütfen daha sonra tekrar deneyin.",
          cached: false,
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
