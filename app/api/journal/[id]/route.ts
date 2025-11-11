import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

// GET /api/journal/:id - Tek günlük detayı
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      )
    }

    const { id } = await params
    const entry = await db.journalEntry.findUnique({
      where: {
        id,
      },
    })

    if (!entry) {
      return NextResponse.json(
        { error: "Günlük bulunamadı" },
        { status: 404 }
      )
    }

    // Sadece kendi günlüğünü görebilir
    if (entry.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Bu günlüğe erişim yetkiniz yok" },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: entry,
    })
  } catch (error) {
    console.error("Günlük getirme hatası:", error)
    return NextResponse.json(
      { error: "Günlük getirilirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

// PUT /api/journal/:id - Günlük güncelleme
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      )
    }

    const { id } = await params
    const entry = await db.journalEntry.findUnique({
      where: {
        id,
      },
    })

    if (!entry) {
      return NextResponse.json(
        { error: "Günlük bulunamadı" },
        { status: 404 }
      )
    }

    // Sadece kendi günlüğünü güncelleyebilir
    if (entry.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Bu günlüğü güncelleme yetkiniz yok" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { title, content, mood, tags } = body

    // Validasyon
    if (content !== undefined && content.trim().length === 0) {
      return NextResponse.json(
        { error: "İçerik boş olamaz" },
        { status: 400 }
      )
    }

    if (mood !== undefined && (mood < 1 || mood > 10)) {
      return NextResponse.json(
        { error: "Ruh hali 1-10 arasında olmalıdır" },
        { status: 400 }
      )
    }

    // Günlük güncelle
    const updatedEntry = await db.journalEntry.update({
      where: {
        id,
      },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content: content.trim() }),
        ...(mood !== undefined && { mood }),
        ...(tags !== undefined && { tags }),
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedEntry,
    })
  } catch (error) {
    console.error("Günlük güncelleme hatası:", error)
    return NextResponse.json(
      { error: "Günlük güncellenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

// DELETE /api/journal/:id - Günlük silme
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      )
    }

    const { id } = await params
    const entry = await db.journalEntry.findUnique({
      where: {
        id,
      },
    })

    if (!entry) {
      return NextResponse.json(
        { error: "Günlük bulunamadı" },
        { status: 404 }
      )
    }

    // Sadece kendi günlüğünü silebilir
    if (entry.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Bu günlüğü silme yetkiniz yok" },
        { status: 403 }
      )
    }

    await db.journalEntry.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Günlük başarıyla silindi",
    })
  } catch (error) {
    console.error("Günlük silme hatası:", error)
    return NextResponse.json(
      { error: "Günlük silinirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
