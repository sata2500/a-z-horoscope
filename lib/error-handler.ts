/**
 * Centralized error handling utility
 */

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export function handleApiError(error: unknown): { error: string; statusCode: number } {
  if (error instanceof AppError) {
    return {
      error: error.message,
      statusCode: error.statusCode,
    }
  }

  if (error instanceof Error) {
    return {
      error: error.message || "Bir hata oluştu",
      statusCode: 500,
    }
  }

  return {
    error: "Bilinmeyen bir hata oluştu",
    statusCode: 500,
  }
}

export function logError(error: unknown, context?: string) {
  const timestamp = new Date().toISOString()
  const contextStr = context ? `[${context}]` : ""
  
  console.error(`${timestamp} ${contextStr} Error:`, error)
  
  // Production'da error tracking service'e gönderilebilir
  // Örn: Sentry, LogRocket, etc.
}
