import { z } from "zod"

// Journal Entry Validation
export const journalEntrySchema = z.object({
  title: z.string().min(1, "Başlık gereklidir").max(200, "Başlık çok uzun"),
  content: z.string().min(1, "İçerik gereklidir").max(10000, "İçerik çok uzun"),
  mood: z.number().min(1, "Ruh hali 1-10 arasında olmalıdır").max(10, "Ruh hali 1-10 arasında olmalıdır"),
  tags: z.array(z.string()).optional(),
  date: z.string().datetime().optional(),
})

export const journalUpdateSchema = journalEntrySchema.partial()

// User Profile Validation
export const userProfileSchema = z.object({
  name: z.string().min(1, "İsim gereklidir").max(100, "İsim çok uzun").optional(),
  birthDate: z.string().datetime().optional(),
  birthTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Geçersiz saat formatı (HH:MM)").optional(),
  birthPlace: z.string().max(200, "Doğum yeri çok uzun").optional(),
  zodiacSign: z.enum([
    "aries", "taurus", "gemini", "cancer", "leo", "virgo",
    "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
  ]).optional(),
})

// Notification Settings Validation
export const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  dailyHoroscope: z.boolean(),
  weeklyHoroscope: z.boolean(),
  monthlyHoroscope: z.boolean(),
})

// Horoscope Request Validation
export const horoscopeRequestSchema = z.object({
  sign: z.enum([
    "aries", "taurus", "gemini", "cancer", "leo", "virgo",
    "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
  ]),
  period: z.enum(["daily", "weekly", "monthly"]).optional(),
})

// Natal Chart Validation
export const natalChartSchema = z.object({
  birthDate: z.string().datetime(),
  birthTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Geçersiz saat formatı (HH:MM)"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
})

// Admin User Update Validation
export const adminUserUpdateSchema = z.object({
  role: z.enum(["USER", "ADMIN"]).optional(),
  emailVerified: z.boolean().optional(),
})

// Helper function to validate request body
export async function validateRequestBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const body = await request.json()
    const data = schema.parse(body)
    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`).join(', ')
      return { success: false, error: errorMessage }
    }
    return { success: false, error: "Geçersiz istek verisi" }
  }
}
