import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { Prisma } from "@prisma/client"

/**
 * GET /api/user/natal-chart
 * Kullanıcının kaydedilmiş doğum haritasını getirir
 */
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        birthDate: true,
        birthTime: true,
        birthPlace: true,
        birthLatitude: true,
        birthLongitude: true,
        natalChartData: true,
        natalChartCalculatedAt: true,
      },
    })

    if (!user || !user.natalChartData) {
      return NextResponse.json(
        { error: "Kaydedilmiş doğum haritası bulunamadı", saved: false },
        { status: 404 }
      )
    }

    return NextResponse.json({
      saved: true,
      data: {
        birthDate: user.birthDate,
        birthTime: user.birthTime,
        birthPlace: user.birthPlace,
        birthLatitude: user.birthLatitude,
        birthLongitude: user.birthLongitude,
        chartData: user.natalChartData,
        calculatedAt: user.natalChartCalculatedAt,
      },
    })
  } catch (error) {
    console.error("Natal chart fetch error:", error)
    return NextResponse.json(
      { error: "Doğum haritası yüklenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/user/natal-chart
 * Kullanıcının doğum haritasını kaydeder
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      birthDate,
      birthTime,
      birthPlace,
      birthLatitude,
      birthLongitude,
      chartData,
    } = body

    // Validasyon
    if (!birthDate || !birthTime || !birthLatitude || !birthLongitude || !chartData) {
      return NextResponse.json(
        { error: "Eksik bilgi. Tüm alanlar gereklidir." },
        { status: 400 }
      )
    }

    // Kullanıcının doğum haritasını kaydet
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        birthDate: new Date(birthDate),
        birthTime,
        birthPlace,
        birthLatitude,
        birthLongitude,
        natalChartData: chartData,
        natalChartCalculatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: "Doğum haritanız başarıyla kaydedildi",
      data: {
        birthDate: updatedUser.birthDate,
        birthTime: updatedUser.birthTime,
        birthPlace: updatedUser.birthPlace,
        calculatedAt: updatedUser.natalChartCalculatedAt,
      },
    })
  } catch (error) {
    console.error("Natal chart save error:", error)
    return NextResponse.json(
      { error: "Doğum haritası kaydedilirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/user/natal-chart
 * Kullanıcının kaydedilmiş doğum haritasını siler
 */
export async function DELETE() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      )
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        birthDate: null,
        birthTime: null,
        birthPlace: null,
        birthLatitude: null,
        birthLongitude: null,
        natalChartData: Prisma.JsonNull,
        natalChartCalculatedAt: null,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Doğum haritanız başarıyla silindi",
    })
  } catch (error) {
    console.error("Natal chart delete error:", error)
    return NextResponse.json(
      { error: "Doğum haritası silinirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
