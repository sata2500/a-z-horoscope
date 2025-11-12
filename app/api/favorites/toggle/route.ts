import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { handleError } from "@/lib/errorHandler";
import { getCurrentUser } from "@/lib/authUtils";

const toggleFavoriteSchema = z.object({
  readingId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user instanceof NextResponse) {
      return user;
    }

    const body = await req.json();
    const { readingId } = toggleFavoriteSchema.parse(body);

    // Check if reading exists and belongs to user
    const reading = await prisma.horoscopeReading.findFirst({
      where: {
        id: readingId,
        userId: user.id,
      },
    });

    if (!reading) {
      return NextResponse.json(
        { error: "Reading not found" },
        { status: 404 }
      );
    }

    // Check if already favorited
    const existingFavorite = await prisma.favoriteReading.findUnique({
      where: {
        userId_readingId: {
          userId: user.id,
          readingId,
        },
      },
    });

    if (existingFavorite) {
      // Remove from favorites
      await prisma.favoriteReading.delete({
        where: {
          id: existingFavorite.id,
        },
      });

      return NextResponse.json({
        success: true,
        isFavorite: false,
        message: "Favorilerden kaldırıldı",
      });
    } else {
      // Add to favorites
      await prisma.favoriteReading.create({
        data: {
          userId: user.id,
          readingId,
        },
      });

      return NextResponse.json({
        success: true,
        isFavorite: true,
        message: "Favorilere eklendi",
      });
    }
  } catch (error) {
    return handleError(error);
  }
}
