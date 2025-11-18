import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session.user;
}

export async function getCurrentAdmin() {
  const user = await getCurrentUser();
  if (user instanceof NextResponse) {
    return user;
  }
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return user;
}
