import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { generateWeeklyHoroscope } from "@/lib/gemini"
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

    // Get start of current week (Monday)
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek // Adjust to Monday
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() + diff)
    weekStart.setHours(0, 0, 0, 0)
    
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)

    // Check if there's already a reading for this week
    const existingReading = await prisma.horoscopeReading.findFirst({
      where: {
        userId: session.user.id,
        zodiacSign,
        readingType: "weekly",
        date: {
          gte: weekStart,
          lt: weekEnd,
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
    const reading = await generateWeeklyHoroscope(zodiacSign, zodiacInfo)

    // Save to database
    await prisma.horoscopeReading.create({
      data: {
        userId: session.user.id,
        zodiacSign,
        readingType: "weekly",
        content: reading,
        date: weekStart,
      },
    })

    return NextResponse.json({
      reading,
      cached: false,
    })
  } catch (error) {
    console.error("Weekly horoscope error:", error)
    return NextResponse.json(
      { error: "Failed to generate weekly horoscope" },
      { status: 500 }
    )
  }
}
