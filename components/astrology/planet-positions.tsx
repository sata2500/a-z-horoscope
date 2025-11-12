"use client"

/**
 * Gezegen Pozisyonları Tablosu
 * 
 * Doğum haritasındaki gezegen pozisyonlarını tablo formatında gösterir.
 * 
 * @author Salih TANRISEVEN & Manus AI
 * @date 11-12 Kasım 2025
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { 
  PLANET_SYMBOLS, 
  PLANET_COLORS, 
  PLANET_BG_COLORS,
  ZODIAC_SYMBOLS,
  ZODIAC_ELEMENTS,
  ELEMENT_COLORS,
  HOUSE_MEANINGS
} from "@/lib/astrology-constants"

interface PlanetPosition {
  planetId: number
  planetName: string
  longitude: number
  latitude: number
  distance: number
  longitudeSpeed: number
  zodiacSign: string
  zodiacDegree: number
  retrograde: boolean
}

interface HousePosition {
  houseNumber: number
  cusp: number
  zodiacSign: string
  zodiacDegree: number
}

interface PlanetPositionsProps {
  planets: PlanetPosition[]
  houses?: HousePosition[]
}

/**
 * Gezegenin hangi evde olduğunu bul
 */
function findPlanetHouse(planetLongitude: number, houses: HousePosition[]): number {
  for (let i = 0; i < houses.length; i++) {
    const currentHouse = houses[i]
    const nextHouse = houses[(i + 1) % houses.length]
    
    const currentCusp = currentHouse.cusp
    let nextCusp = nextHouse.cusp
    
    // 360° geçişini kontrol et
    if (nextCusp < currentCusp) {
      nextCusp += 360
      if (planetLongitude < currentCusp) {
        planetLongitude += 360
      }
    }
    
    if (planetLongitude >= currentCusp && planetLongitude < nextCusp) {
      return currentHouse.houseNumber
    }
  }
  
  return 1 // Fallback
}

export function PlanetPositions({ planets, houses = [] }: PlanetPositionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🌍</span>
          Gezegen Pozisyonları
        </CardTitle>
        <CardDescription>
          Doğum anınızdaki gezegenlerin bulunduğu burçlar, dereceleri ve evleri
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Gezegen</TableHead>
                <TableHead className="w-[120px]">Burç</TableHead>
                <TableHead className="w-[100px]">Derece</TableHead>
                <TableHead className="w-[80px]">Element</TableHead>
                {houses.length > 0 && <TableHead className="w-[80px]">Ev</TableHead>}
                <TableHead className="w-[100px]">Durum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planets.map((planet) => {
                const symbol = PLANET_SYMBOLS[planet.planetName] || '●'
                const color = PLANET_COLORS[planet.planetName] || 'text-gray-500'
                const bgColor = PLANET_BG_COLORS[planet.planetName] || 'bg-gray-500/10'
                const zodiacSymbol = ZODIAC_SYMBOLS[planet.zodiacSign] || ''
                const element = ZODIAC_ELEMENTS[planet.zodiacSign] || ''
                const elementColor = ELEMENT_COLORS[element] || 'text-gray-500'
                const houseNumber = houses.length > 0 ? findPlanetHouse(planet.longitude, houses) : null
                
                return (
                  <TableRow key={planet.planetId} className={`${bgColor} hover:opacity-80 transition-opacity`}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl ${color}`}>{symbol}</span>
                        <span className="text-foreground dark:text-gray-200">{planet.planetName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{zodiacSymbol}</span>
                        <span className="text-foreground dark:text-gray-200">{planet.zodiacSign}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-foreground dark:text-gray-200">
                      {Math.floor(planet.zodiacDegree)}° {Math.floor((planet.zodiacDegree % 1) * 60)}&apos;
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${elementColor} border-current`}>
                        {element}
                      </Badge>
                    </TableCell>
                    {houses.length > 0 && houseNumber && (
                      <TableCell>
                        <Badge variant="secondary" className="font-semibold">
                          {houseNumber}. Ev
                        </Badge>
                      </TableCell>
                    )}
                    <TableCell>
                      {planet.retrograde ? (
                        <Badge variant="destructive" className="gap-1">
                          <span className="text-lg">⟲</span>
                          Retrograde
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <span className="text-lg">→</span>
                          Direkt
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        
        {houses.length > 0 && (
          <div className="mt-6 p-4 bg-muted dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-muted-foreground dark:text-gray-300 mb-2 font-semibold">
              💡 Ev Anlamları:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
              {Object.entries(HOUSE_MEANINGS).slice(0, 6).map(([house, meaning]) => (
                <div key={house} className="text-foreground dark:text-gray-200">
                  <span className="font-semibold">{house}. Ev:</span> {meaning}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
