import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { generateDailyHoroscope } from "@/lib/gemini"
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

    // Check if there's already a reading for today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const existingReading = await prisma.horoscopeReading.findFirst({
      where: {
        userId: session.user.id,
        zodiacSign,
        readingType: "daily",
        date: {
          gte: today,
          lt: tomorrow,
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
    const reading = await generateDailyHoroscope(zodiacSign, zodiacInfo)

    // Save to database
    await prisma.horoscopeReading.create({
      data: {
        userId: session.user.id,
        zodiacSign,
        readingType: "daily",
        content: reading,
        date: today,
      },
    })

    return NextResponse.json({
      reading,
      cached: false,
    })
  } catch (error) {
    console.error("Daily horoscope error:", error)
    return NextResponse.json(
      { error: "Failed to generate horoscope" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const zodiacSign = searchParams.get("sign")

    if (!zodiacSign || !zodiacSigns[zodiacSign as ZodiacSign]) {
      return NextResponse.json(
        { error: "Invalid zodiac sign" },
        { status: 400 }
      )
    }

    // Get today's reading
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const reading = await prisma.horoscopeReading.findFirst({
      where: {
        userId: session.user.id,
        zodiacSign,
        readingType: "daily",
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    })

    if (!reading) {
      return NextResponse.json(
        { error: "No reading found for today" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      reading: reading.content,
      date: reading.date,
    })
  } catch (error) {
    console.error("Get daily horoscope error:", error)
    return NextResponse.json(
      { error: "Failed to fetch horoscope" },
      { status: 500 }
    )
  }
}
