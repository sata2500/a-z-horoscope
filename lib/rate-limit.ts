/**
 * Simple in-memory rate limiting
 * For production, use Redis or similar
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

export interface RateLimitConfig {
  interval: number // in milliseconds
  maxRequests: number
}

export function rateLimit(identifier: string, config: RateLimitConfig): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired one
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + config.interval,
    })
    return true
  }

  if (entry.count >= config.maxRequests) {
    // Rate limit exceeded
    return false
  }

  // Increment count
  entry.count++
  return true
}

export function getRateLimitStatus(identifier: string, config: RateLimitConfig) {
  const entry = rateLimitMap.get(identifier)
  const now = Date.now()

  if (!entry || now > entry.resetTime) {
    return {
      remaining: config.maxRequests,
      reset: now + config.interval,
      exceeded: false,
    }
  }

  return {
    remaining: Math.max(0, config.maxRequests - entry.count),
    reset: entry.resetTime,
    exceeded: entry.count >= config.maxRequests,
  }
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 60000) // Clean up every minute
