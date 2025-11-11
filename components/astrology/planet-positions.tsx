"use client"

/**
 * Gezegen Pozisyonları Tablosu
 * 
 * Doğum haritasındaki gezegen pozisyonlarını tablo formatında gösterir.
 * 
 * @author Salih TANRISEVEN
 * @date 11 Kasım 2025
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

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

interface PlanetPositionsProps {
  planets: PlanetPosition[]
}

export function PlanetPositions({ planets }: PlanetPositionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gezegen Pozisyonları</CardTitle>
        <CardDescription>
          Doğum anınızdaki gezegenlerin bulunduğu burçlar ve dereceleri
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gezegen</TableHead>
              <TableHead>Burç</TableHead>
              <TableHead>Derece</TableHead>
              <TableHead>Durum</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {planets.map((planet) => (
              <TableRow key={planet.planetId}>
                <TableCell className="font-medium">{planet.planetName}</TableCell>
                <TableCell>{planet.zodiacSign}</TableCell>
                <TableCell>
                  {Math.floor(planet.zodiacDegree)}° {Math.floor((planet.zodiacDegree % 1) * 60)}&apos;
                </TableCell>
                <TableCell>
                  {planet.retrograde ? (
                    <Badge variant="destructive">Retrograde</Badge>
                  ) : (
                    <Badge variant="secondary">Direkt</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
