import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { analyzeJournalEntry, findJournalPatterns } from "@/lib/gemini"
import type { TransitData } from '@/types'

// POST /api/journal/analyze - Günlük analizi
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { entryId, analyzeTransits, findPatterns } = body

    if (findPatterns) {
      // Birden fazla günlük için pattern analizi
      const entries = await db.journalEntry.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          date: "desc",
        },
        take: 30, // Son 30 günlük
      })

      if (entries.length < 3) {
        return NextResponse.json(
          { error: "Pattern analizi için en az 3 günlük gereklidir" },
          { status: 400 }
        )
      }

      const analysis = await findJournalPatterns(
        entries.map(entry => ({
          date: entry.date,
          mood: entry.mood,
          content: entry.content,
          transits: entry.transits as TransitData | null,
        }))
      )

      return NextResponse.json({
        success: true,
        analysis,
      })
    } else if (entryId) {
      // Tek günlük analizi
      const entry = await db.journalEntry.findUnique({
        where: {
          id: entryId,
        },
      })

      if (!entry) {
        return NextResponse.json(
          { error: "Günlük bulunamadı" },
          { status: 404 }
        )
      }

      if (entry.userId !== session.user.id) {
        return NextResponse.json(
          { error: "Bu günlüğe erişim yetkiniz yok" },
          { status: 403 }
        )
      }

      const analysis = await analyzeJournalEntry(
        entry.content,
        entry.mood,
        analyzeTransits ? (entry.transits as TransitData | null) : null
      )

      return NextResponse.json({
        success: true,
        analysis,
      })
    } else {
      return NextResponse.json(
        { error: "entryId veya findPatterns parametresi gereklidir" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Günlük analizi hatası:", error)
    return NextResponse.json(
      { error: "Analiz yapılırken bir hata oluştu" },
      { status: 500 }
    )
  }
}
