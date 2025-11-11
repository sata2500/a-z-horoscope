import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const favorites = await prisma.favoriteReading.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        reading: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      data: favorites.map(fav => ({
        ...fav.reading,
        favoritedAt: fav.createdAt,
      })),
    })
  } catch (error) {
    console.error("Get favorites error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
