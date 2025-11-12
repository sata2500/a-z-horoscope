"use client"

/**
 * Element ve Modalite Dağılımı
 * 
 * Doğum haritasındaki element ve modalite dağılımını gösterir.
 * 
 * @author Manus AI
 * @date 12 Kasım 2025
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  calculateElementDistribution,
  calculateModalityDistribution,
  getDominantElement,
  getDominantModality,
  ELEMENT_COLORS,
  MODALITY_COLORS
} from "@/lib/astrology-constants"

interface PlanetPosition {
  planetId: number
  planetName: string
  zodiacSign: string
  zodiacDegree: number
  retrograde: boolean
}

interface ElementModalityDistributionProps {
  planets: PlanetPosition[]
}

export function ElementModalityDistribution({ planets }: ElementModalityDistributionProps) {
  // İlk 10 gezegen (Güneş'ten Plüton'a)
  const mainPlanets = planets.slice(0, 10)
  
  const elementDist = calculateElementDistribution(mainPlanets)
  const modalityDist = calculateModalityDistribution(mainPlanets)
  const dominantElement = getDominantElement(mainPlanets)
  const dominantModality = getDominantModality(mainPlanets)
  
  const totalPlanets = mainPlanets.length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Element Dağılımı */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            Element Dağılımı
          </CardTitle>
          <CardDescription>
            Gezegenlerin element dağılımı ve dominant element
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(elementDist).map(([element, count]) => {
            const percentage = (count / totalPlanets) * 100
            const color = ELEMENT_COLORS[element] || 'text-gray-500'
            const isDominant = element === dominantElement
            
            return (
              <div key={element} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${color}`}>{element}</span>
                    {isDominant && (
                      <Badge variant="default" className="text-xs">
                        Dominant
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground dark:text-gray-400">
                    {count} gezegen ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            )
          })}
          
          <div className="mt-6 p-3 bg-muted dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-muted-foreground dark:text-gray-300">
              <span className="font-semibold">Dominant Element:</span>{' '}
              <span className={ELEMENT_COLORS[dominantElement]}>{dominantElement}</span>
            </p>
            <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
              {dominantElement === 'Ateş' && 'Enerjik, tutkulu, öncü ruh'}
              {dominantElement === 'Toprak' && 'Pratik, güvenilir, istikrarlı'}
              {dominantElement === 'Hava' && 'Zihinsel, iletişimci, sosyal'}
              {dominantElement === 'Su' && 'Duygusal, sezgisel, empatik'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modalite Dağılımı */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            Modalite Dağılımı
          </CardTitle>
          <CardDescription>
            Gezegenlerin modalite dağılımı ve dominant modalite
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(modalityDist).map(([modality, count]) => {
            const percentage = (count / totalPlanets) * 100
            const color = MODALITY_COLORS[modality] || 'text-gray-500'
            const isDominant = modality === dominantModality
            
            return (
              <div key={modality} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${color}`}>{modality}</span>
                    {isDominant && (
                      <Badge variant="default" className="text-xs">
                        Dominant
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground dark:text-gray-400">
                    {count} gezegen ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            )
          })}
          
          <div className="mt-6 p-3 bg-muted dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-muted-foreground dark:text-gray-300">
              <span className="font-semibold">Dominant Modalite:</span>{' '}
              <span className={MODALITY_COLORS[dominantModality]}>{dominantModality}</span>
            </p>
            <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
              {dominantModality === 'Kardinal' && 'Başlatıcı, lider, girişimci'}
              {dominantModality === 'Sabit' && 'Kararlı, sabırlı, dirençli'}
              {dominantModality === 'Değişken' && 'Uyumlu, esnek, çok yönlü'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
