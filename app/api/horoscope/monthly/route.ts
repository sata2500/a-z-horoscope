import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { generateMonthlyHoroscope } from "@/lib/gemini"
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
    const { zodiacSign } = body

    if (!zodiacSign || !zodiacSigns[zodiacSign as ZodiacSign]) {
      return NextResponse.json(
        { error: "Invalid zodiac sign" },
        { status: 400 }
      )
    }

    const zodiacInfo = zodiacSigns[zodiacSign as ZodiacSign]

    // Get start of current month
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    monthStart.setHours(0, 0, 0, 0)
    
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    // Check if there's already a reading for this month
    const existingReading = await prisma.horoscopeReading.findFirst({
      where: {
        userId: session.user.id,
        zodiacSign,
        readingType: "monthly",
        date: {
          gte: monthStart,
          lt: monthEnd,
        },
      },
    })

    if (existingReading) {
      return NextResponse.json({
        reading: existingReading.content,
        cached: true,
      })
    }

    // Generate new reading using Gemini AI
    const reading = await generateMonthlyHoroscope(zodiacSign, zodiacInfo)

    // Save to database
    await prisma.horoscopeReading.create({
      data: {
        userId: session.user.id,
        zodiacSign,
        readingType: "monthly",
        content: reading,
        date: monthStart,
      },
    })

    return NextResponse.json({
      reading,
      cached: false,
    })
  } catch (error) {
    console.error("Monthly horoscope error:", error)
    return NextResponse.json(
      { error: "Failed to generate monthly horoscope" },
      { status: 500 }
    )
  }
}
