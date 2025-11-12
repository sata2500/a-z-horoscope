import { NextRequest, NextResponse } from "next/server"
import { generateCompatibilityAnalysis } from "@/lib/gemini"
import { zodiacSigns, ZodiacSign } from "@/lib/zodiac"

/**
 * Public Compatibility Analysis API
 * 
 * Giriş yapmamış kullanıcılar için burç uyumluluk analizi.
 * GET request ile iki burç arasındaki uyumluluğu analiz eder.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sign1 = searchParams.get("sign1")
    const sign2 = searchParams.get("sign2")

    // Validate zodiac signs
    if (
      !sign1 || 
      !sign2 || 
      !zodiacSigns[sign1 as ZodiacSign] || 
      !zodiacSigns[sign2 as ZodiacSign]
    ) {
      return NextResponse.json(
        { error: "Geçersiz burç seçimi" },
        { status: 400 }
      )
    }

    const info1 = zodiacSigns[sign1 as ZodiacSign]
    const info2 = zodiacSigns[sign2 as ZodiacSign]

    // Generate compatibility analysis using Gemini AI
    const analysis = await generateCompatibilityAnalysis(
      sign1,
      sign2,
      info1,
      info2
    )

    return NextResponse.json({
      success: true,
      data: {
        analysis,
        sign1Info: {
          name: info1.nameTr,
          symbol: info1.symbol,
          element: info1.elementTr,
        },
        sign2Info: {
          name: info2.nameTr,
          symbol: info2.symbol,
          element: info2.elementTr,
        },
      },
    })
  } catch (error) {
    console.error("Compatibility analysis error:", error)
    return NextResponse.json(
      { error: "Uyumluluk analizi oluşturulamadı" },
      { status: 500 }
    )
  }
}
