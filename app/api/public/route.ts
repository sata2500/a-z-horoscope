import { NextResponse } from "next/server"
import { zodiacSigns } from "@/lib/zodiac"

/**
 * Public API Ana Endpoint
 * 
 * Bu endpoint, giriş yapmamış kullanıcılar için mevcut tüm
 * public API endpoint'lerini ve kullanım bilgilerini listeler.
 * 
 * Kullanım: GET /api/public
 */
export async function GET() {
  const validSigns = Object.keys(zodiacSigns)
  
  return NextResponse.json({
    success: true,
    message: "AZ-Horoscope Public API - Swiss Ephemeris + Gemini AI destekli profesyonel burç yorumları",
    version: "1.0.0",
    features: [
      "Gerçek astronomik verilerle (Swiss Ephemeris) hesaplanan gezegen pozisyonları",
      "Gemini AI ile oluşturulan profesyonel burç yorumları",
      "Günlük, haftalık ve aylık burç yorumları",
      "12 burç için kapsamlı analizler",
      "Giriş gerektirmeyen açık API"
    ],
    endpoints: {
      daily: {
        description: "Günlük burç yorumu",
        methods: {
          GET: {
            url: "/api/public/horoscope/daily?sign={zodiacSign}",
            example: "/api/public/horoscope/daily?sign=aries",
            description: "Belirtilen burç için günlük yorum getirir"
          },
          POST: {
            url: "/api/public/horoscope/daily",
            body: { getAllSigns: true },
            description: "Tüm burçlar için günlük yorumları toplu olarak getirir"
          }
        }
      },
      weekly: {
        description: "Haftalık burç yorumu",
        methods: {
          GET: {
            url: "/api/public/horoscope/weekly?sign={zodiacSign}",
            example: "/api/public/horoscope/weekly?sign=taurus",
            description: "Belirtilen burç için haftalık yorum getirir"
          },
          POST: {
            url: "/api/public/horoscope/weekly",
            body: { getAllSigns: true },
            description: "Tüm burçlar için haftalık yorumları toplu olarak getirir"
          }
        }
      },
      monthly: {
        description: "Aylık burç yorumu",
        methods: {
          GET: {
            url: "/api/public/horoscope/monthly?sign={zodiacSign}",
            example: "/api/public/horoscope/monthly?sign=gemini",
            description: "Belirtilen burç için aylık yorum getirir"
          },
          POST: {
            url: "/api/public/horoscope/monthly",
            body: { getAllSigns: true },
            description: "Tüm burçlar için aylık yorumları toplu olarak getirir"
          }
        }
      }
    },
    zodiacSigns: {
      available: validSigns,
      details: Object.entries(zodiacSigns).map(([sign, info]) => ({
        sign: sign,
        nameTr: info.nameTr,
        symbol: info.symbol,
        element: info.elementTr,
        planet: info.planetTr,
        dateRange: info.dateRangeTr
      }))
    },
    usage: {
      rateLimit: "Şu anda rate limit yok, ancak makul kullanım beklenmektedir",
      authentication: "Gerekmez - Public API",
      responseFormat: "JSON",
      cors: "Tüm origin'lere açık"
    },
    technology: {
      ephemeris: "Swiss Ephemeris - Profesyonel astronomik hesaplamalar",
      ai: "Google Gemini 2.0 Flash - Gelişmiş AI yorumları",
      planets: [
        "Güneş", "Ay", "Merkür", "Venüs", "Mars", 
        "Jüpiter", "Satürn", "Uranüs", "Neptün", "Plüton",
        "Kuzey Düğüm", "Chiron", "Lilith"
      ],
      aspects: [
        "Kavuşum (0°)", "Karşıt (180°)", "Üçgen (120°)", 
        "Kare (90°)", "Altıgen (60°)", "Quincunx (150°)", 
        "Yarı Altıgen (30°)"
      ]
    },
    contact: {
      developer: "Salih TANRISEVEN",
      email: "salihtanriseven25@gmail.com",
      github: "https://github.com/sata2500/a-z-horoscope",
      website: "https://a-z-horoscope.vercel.app"
    }
  })
}
