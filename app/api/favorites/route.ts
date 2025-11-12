import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleError } from "@/lib/errorHandler";
import { getCurrentUser } from "@/lib/authUtils";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (user instanceof NextResponse) {
      return user;
    }

    const favorites = await prisma.favoriteReading.findMany({
      where: {
        userId: user.id,
      },
      include: {
        reading: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: favorites.map((fav) => ({
        ...fav.reading,
        favoritedAt: fav.createdAt,
      })),
    });
  } catch (error) {
    return handleError(error);
  }
}
