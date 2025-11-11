/**
 * Performance monitoring utilities
 */

export class PerformanceMonitor {
  private startTime: number
  private label: string

  constructor(label: string) {
    this.label = label
    this.startTime = performance.now()
  }

  end() {
    const endTime = performance.now()
    const duration = endTime - this.startTime
    
    console.log(`[Performance] ${this.label}: ${duration.toFixed(2)}ms`)
    
    // Production'da analytics service'e gönderilebilir
    return duration
  }
}

export function measureAsync<T>(
  label: string,
  fn: () => Promise<T>
): Promise<T> {
  const monitor = new PerformanceMonitor(label)
  
  return fn().finally(() => {
    monitor.end()
  })
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}
