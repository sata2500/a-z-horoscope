import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getZodiacSignFromDate } from "@/lib/zodiac";
import { z } from "zod";
import { handleError } from "@/lib/errorHandler";
import { getCurrentUser } from "@/lib/authUtils";

const updateZodiacSchema = z.object({
  birthDate: z.string().datetime(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user instanceof NextResponse) {
      return user;
    }

    const body = await req.json();
    const { birthDate } = updateZodiacSchema.parse(body);

    const zodiacSign = getZodiacSignFromDate(new Date(birthDate));

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        birthDate: new Date(birthDate),
        zodiacSign,
      },
    });

    return NextResponse.json({
      success: true,
      zodiacSign,
      birthDate: updatedUser.birthDate,
    });
  } catch (error) {
    return handleError(error);
  }
}
