import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { calculateTransits } from "@/lib/swisseph"
import { validateRequestBody, journalEntrySchema } from "@/lib/validations"
import { sanitize } from "@/lib/sanitize"

// POST /api/journal - Yeni günlük oluşturma
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      )
    }


    // Validation
    const validation = await validateRequestBody(req.clone(), journalEntrySchema)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { title, content, mood, tags, date } = validation.data

    // O günün transit'lerini hesapla
    const entryDate = date ? new Date(date) : new Date()
    let transits = null
    
    try {
      const transitData = calculateTransits(entryDate)
      const transitMap: Record<string, string> = {}
      
      transitData.forEach(planet => {
        const key = planet.planetName.toLowerCase().replace(/ü/g, 'u')
        transitMap[key] = `${planet.zodiacSign} ${Math.round(planet.zodiacDegree)}°${planet.retrograde ? ' ℞' : ''}`
      })
      
      transits = {
        sun: transitMap['gunes'] || transitMap['sun'],
        moon: transitMap['ay'] || transitMap['moon'],
        mercury: transitMap['merkur'] || transitMap['mercury'],
        venus: transitMap['venus'],
        mars: transitMap['mars'],
        jupiter: transitMap['jupiter'] || transitMap['jupıter'],
        saturn: transitMap['saturn'] || transitMap['saturn'],
      }
    } catch (error) {
      console.error("Transit hesaplama hatası:", error)
      // Transit hesaplanamasa bile günlük kaydedilsin
    }

    const sanitizedData = sanitize({ title, content, tags });

    // Günlük oluştur
    const entry = await db.journalEntry.create({
      data: {
        userId: session.user.id,
        title: sanitizedData.title || null,
        content: sanitizedData.content.trim(),
        mood,
        tags: sanitizedData.tags || [],
        date: entryDate,
        transits: transits || undefined,
      },
    })

    return NextResponse.json({
      success: true,
      data: entry,
    })
  } catch (error) {
    console.error("Günlük oluşturma hatası:", error)
    return NextResponse.json(
      { error: "Günlük oluşturulurken bir hata oluştu" },
      { status: 500 }
    )
  }
}

// GET /api/journal - Günlük listesi
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const mood = searchParams.get("mood")
    const tag = searchParams.get("tag")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const search = searchParams.get("search")

    // Filtreleme koşulları
    const where: {
      userId: string;
      mood?: number;
      tags?: { has?: string; hasSome?: string[] };
      date?: { gte?: Date; lte?: Date };
      OR?: Array<{ title?: { contains: string; mode: 'insensitive' }; content?: { contains: string; mode: 'insensitive' } }>;
    } = {
      userId: session.user.id,
    }

    if (mood) {
      where.mood = parseInt(mood)
    }

    if (tag) {
      where.tags = {
        has: tag,
      }
    }

    if (startDate || endDate) {
      where.date = {}
      if (startDate) {
        where.date.gte = new Date(startDate)
      }
      if (endDate) {
        where.date.lte = new Date(endDate)
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ]
    }

    // Toplam kayıt sayısı
    const total = await db.journalEntry.count({ where })

    // Günlükleri getir
    const entries = await db.journalEntry.findMany({
      where,
      orderBy: {
        date: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json({
      success: true,
      data: {
        entries,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Günlük listesi hatası:", error)
    return NextResponse.json(
      { error: "Günlükler getirilirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
