import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const historyQuerySchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  zodiacSign: z.string().optional(),
  readingType: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const { page, limit, zodiacSign, readingType } = historyQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      zodiacSign: searchParams.get("zodiacSign"),
      readingType: searchParams.get("readingType"),
    })

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    // Build where clause
    const where: {
      userId: string
      zodiacSign?: string
      readingType?: string
    } = {
      userId: session.user.id,
    }

    if (zodiacSign) {
      where.zodiacSign = zodiacSign
    }

    if (readingType) {
      where.readingType = readingType
    }

    // Get total count for pagination
    const total = await prisma.horoscopeReading.count({ where })

    // Get readings
    const readings = await prisma.horoscopeReading.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limitNum,
    })

    return NextResponse.json({
      success: true,
      data: readings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasMore: skip + readings.length < total,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Horoscope history error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
