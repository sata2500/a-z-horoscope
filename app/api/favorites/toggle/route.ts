import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const toggleFavoriteSchema = z.object({
  readingId: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { readingId } = toggleFavoriteSchema.parse(body)

    // Check if reading exists and belongs to user
    const reading = await prisma.horoscopeReading.findFirst({
      where: {
        id: readingId,
        userId: session.user.id,
      },
    })

    if (!reading) {
      return NextResponse.json(
        { error: "Reading not found" },
        { status: 404 }
      )
    }

    // Check if already favorited
    const existingFavorite = await prisma.favoriteReading.findUnique({
      where: {
        userId_readingId: {
          userId: session.user.id,
          readingId,
        },
      },
    })

    if (existingFavorite) {
      // Remove from favorites
      await prisma.favoriteReading.delete({
        where: {
          id: existingFavorite.id,
        },
      })

      return NextResponse.json({
        success: true,
        isFavorite: false,
        message: "Favorilerden kaldırıldı",
      })
    } else {
      // Add to favorites
      await prisma.favoriteReading.create({
        data: {
          userId: session.user.id,
          readingId,
        },
      })

      return NextResponse.json({
        success: true,
        isFavorite: true,
        message: "Favorilere eklendi",
      })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Toggle favorite error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
