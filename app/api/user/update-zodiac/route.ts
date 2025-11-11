import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { getZodiacSignFromDate } from "@/lib/zodiac"
import { z } from "zod"

const updateZodiacSchema = z.object({
  birthDate: z.string().datetime(),
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
    const { birthDate } = updateZodiacSchema.parse(body)

    // Doğum tarihinden burç hesapla
    const zodiacSign = getZodiacSignFromDate(birthDate)

    // Kullanıcıyı güncelle
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        birthDate: new Date(birthDate),
        zodiacSign,
      },
    })

    return NextResponse.json({
      success: true,
      zodiacSign,
      birthDate: updatedUser.birthDate,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Update zodiac error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
