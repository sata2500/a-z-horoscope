"use client"

/**
 * Public Natal Chart Redirect
 * 
 * /public-natal-chart artık /natal-chart'a yönlendiriliyor
 * 
 * @author Salih TANRISEVEN & Manus AI
 * @date 12 Kasım 2025
 */

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function PublicNatalChartRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/natal-chart")
  }, [router])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Yönlendiriliyor...</p>
      </div>
    </div>
  )
}
