import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Invalid input", details: error.issues },
      { status: 400 }
    );
  }

  console.error("An unexpected error occurred:", error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
