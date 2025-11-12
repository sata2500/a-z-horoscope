import { auth } from "@/auth"
import { redirect } from "next/navigation"

/**
 * Admin yetkisi kontrolü yapar
 * Yetkisiz kullanıcıları yönlendirir
 */
export async function requireAdmin() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }
  
  if (session.user.role !== "ADMIN") {
    redirect("/")
  }
  
  return session
}

/**
 * Kullanıcının admin olup olmadığını kontrol eder
 */
export async function isAdmin() {
  const session = await auth()
  
  if (!session) {
    return false
  }
  
  return session.user.role === "ADMIN"
}
