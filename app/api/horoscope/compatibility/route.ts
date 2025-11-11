import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { generateCompatibilityAnalysis } from "@/lib/gemini"
import { zodiacSigns, ZodiacSign } from "@/lib/zodiac"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { sign1, sign2 } = body

    if (
      !sign1 || 
      !sign2 || 
      !zodiacSigns[sign1 as ZodiacSign] || 
      !zodiacSigns[sign2 as ZodiacSign]
    ) {
      return NextResponse.json(
        { error: "Invalid zodiac signs" },
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
    })
  } catch (error) {
    console.error("Compatibility analysis error:", error)
    return NextResponse.json(
      { error: "Failed to generate compatibility analysis" },
      { status: 500 }
    )
  }
}
