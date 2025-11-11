"use client"

/**
 * Aspect&apos;ler Listesi
 * 
 * Doğum haritasındaki gezegen aspectlerini gösterir.
 * 
 * @author Salih TANRISEVEN
 * @date 11 Kasım 2025
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Aspect {
  planet1: string
  planet2: string
  aspectType: string
  angle: number
  orb: number
  applying: boolean
}

interface AspectsListProps {
  aspects: Aspect[]
}

// Aspect renkleri ve açıklamaları
const ASPECT_INFO: Record<string, { color: string; description: string }> = {
  "Kavuşum": { color: "bg-yellow-500", description: "Güçlü birleşim" },
  "Karşıt": { color: "bg-red-500", description: "Gerilim ve denge" },
  "Üçgen": { color: "bg-green-500", description: "Uyum ve akış" },
  "Kare": { color: "bg-orange-500", description: "Zorluk ve büyüme" },
  "Altıgen": { color: "bg-blue-500", description: "Fırsat ve destek" },
  "Quincunx": { color: "bg-purple-500", description: "Uyum arayışı" },
  "Yarı Altıgen": { color: "bg-cyan-500", description: "Hafif bağlantı" },
}

export function AspectsList({ aspects }: AspectsListProps) {
  if (aspects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aspect&apos;ler</CardTitle>
        <CardDescription>
          Doğum haritanızda önemli aspect bulunamadı
        </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aspect&apos;ler</CardTitle>
        <CardDescription>
          Gezegenlerin birbirleriyle oluşturduğu açılar ve ilişkiler
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {aspects.map((aspect, index) => {
            const info = ASPECT_INFO[aspect.aspectType] || { color: "bg-gray-500", description: "" }
            
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${info.color}`} />
                  <div>
                    <div className="font-medium">
                      {aspect.planet1} {aspect.aspectType} {aspect.planet2}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {info.description}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{aspect.angle}°</div>
                  <div className="text-xs text-muted-foreground">
                    Orb: {aspect.orb.toFixed(1)}°
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {aspects.length > 10 && (
          <p className="text-sm text-muted-foreground mt-4">
            Toplam {aspects.length} aspect bulundu. En önemlileri gösteriliyor.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
