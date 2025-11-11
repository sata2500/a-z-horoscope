"use client"

/**
 * Evler Tablosu
 * 
 * Doğum haritasındaki 12 evi ve başlangıç burçlarını gösterir.
 * 
 * @author Salih TANRISEVEN
 * @date 11 Kasım 2025
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface HousePosition {
  houseNumber: number
  cusp: number
  zodiacSign: string
  zodiacDegree: number
}

interface HousesTableProps {
  houses: HousePosition[]
}

// Ev anlamları
const HOUSE_MEANINGS: Record<number, string> = {
  1: "Kişilik, Dış Görünüş",
  2: "Değerler, Finans",
  3: "İletişim, Kardeşler",
  4: "Aile, Ev, Kökler",
  5: "Yaratıcılık, Aşk, Çocuklar",
  6: "Sağlık, Rutin, İş",
  7: "İlişkiler, Ortaklıklar",
  8: "Dönüşüm, Ortak Kaynaklar",
  9: "Felsefe, Seyahat, Öğrenim",
  10: "Kariyer, Statü, Hedefler",
  11: "Arkadaşlıklar, Topluluk",
  12: "Bilinçaltı, Maneviyat",
}

export function HousesTable({ houses }: HousesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evler</CardTitle>
        <CardDescription>
          Doğum haritanızdaki 12 ev ve başlangıç burçları
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ev</TableHead>
              <TableHead>Burç</TableHead>
              <TableHead>Derece</TableHead>
              <TableHead>Anlam</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {houses.map((house) => (
              <TableRow key={house.houseNumber}>
                <TableCell className="font-medium">{house.houseNumber}. Ev</TableCell>
                <TableCell>{house.zodiacSign}</TableCell>
                <TableCell>
                  {Math.floor(house.zodiacDegree)}° {Math.floor((house.zodiacDegree % 1) * 60)}&apos;
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {HOUSE_MEANINGS[house.houseNumber]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
