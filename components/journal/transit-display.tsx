"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TransitData } from '@/types'

interface TransitDisplayProps {
  transits: TransitData | null
  compact?: boolean
}

const planetNames: Record<string, string> = {
  sun: "Güneş",
  moon: "Ay",
  mercury: "Merkür",
  venus: "Venüs",
  mars: "Mars",
  jupiter: "Jüpiter",
  saturn: "Satürn",
  uranus: "Uranüs",
  neptune: "Neptün",
  pluto: "Plüton",
}

export function TransitDisplay({ transits, compact = false }: TransitDisplayProps) {
  if (!transits) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Gezegen Pozisyonları</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Bu günlük için transit bilgisi mevcut değil.
          </p>
        </CardContent>
      </Card>
    )
  }

  const transitEntries = Object.entries(transits)

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {transitEntries.map(([planet, position]) => (
          <div
            key={planet}
            className="text-xs bg-muted px-2 py-1 rounded"
          >
            <span className="font-medium">{planetNames[planet] || planet}:</span>{" "}
            <span className="text-muted-foreground">{position as string}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Gezegen Pozisyonları</CardTitle>
        <p className="text-sm text-muted-foreground">
          Bu günlüğü yazdığınız andaki gerçek gezegen konumları
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {transitEntries.map(([planet, position]) => (
            <div
              key={planet}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <span className="font-medium">{planetNames[planet] || planet}</span>
              <span className="text-sm text-muted-foreground font-mono">
                {position as string}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
