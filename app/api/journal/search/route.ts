import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;

    const searchTerm = query.trim().split(/\s+/).join(' & ');

    const countResult: [{ count: BigInt }] = await db.$queryRaw`
      SELECT count(*)
      FROM "journal_entries"
      WHERE to_tsvector('english', "title" || ' ' || "content") @@ to_tsquery('english', ${searchTerm})
      AND "user_id" = ${session.user.id}
    `;

    const total = Number(countResult[0].count);

    const entries = await db.$queryRaw`
      SELECT *
      FROM "journal_entries"
      WHERE to_tsvector('english', "title" || ' ' || "content") @@ to_tsquery('english', ${searchTerm})
      AND "user_id" = ${session.user.id}
      ORDER BY ts_rank(to_tsvector('english', "title" || ' ' || "content"), to_tsquery('english', ${searchTerm})) DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    return NextResponse.json({
      success: true,
      data: {
        entries,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "An error occurred during search" },
      { status: 500 }
    );
  }
}
