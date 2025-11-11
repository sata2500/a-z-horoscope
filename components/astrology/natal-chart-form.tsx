"use client"

/**
 * Doğum Haritası Formu
 * 
 * Kullanıcının doğum bilgilerini girerek doğum haritasını hesaplamasını sağlar.
 * 
 * @author Salih TANRISEVEN
 * @date 11 Kasım 2025
 */

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface NatalChartFormProps {
  onSubmit: (data: {
    birthDate: string
    birthTime: string
    latitude: number
    longitude: number
    cityName: string
    houseSystem: string
  }) => void
  loading?: boolean
}

// Türkiye'nin büyük şehirleri ve koordinatları
const TURKISH_CITIES = [
  { name: "İstanbul", lat: 41.0082, lon: 28.9784 },
  { name: "Ankara", lat: 39.9334, lon: 32.8597 },
  { name: "İzmir", lat: 38.4237, lon: 27.1428 },
  { name: "Bursa", lat: 40.1826, lon: 29.0665 },
  { name: "Antalya", lat: 36.8969, lon: 30.7133 },
  { name: "Adana", lat: 37.0000, lon: 35.3213 },
  { name: "Konya", lat: 37.8746, lon: 32.4932 },
  { name: "Gaziantep", lat: 37.0662, lon: 37.3833 },
  { name: "Şanlıurfa", lat: 37.1591, lon: 38.7969 },
  { name: "Kocaeli", lat: 40.8533, lon: 29.8815 },
  { name: "Mersin", lat: 36.8121, lon: 34.6415 },
  { name: "Diyarbakır", lat: 37.9144, lon: 40.2306 },
  { name: "Kayseri", lat: 38.7312, lon: 35.4787 },
  { name: "Eskişehir", lat: 39.7767, lon: 30.5206 },
  { name: "Samsun", lat: 41.2867, lon: 36.3300 },
  { name: "Denizli", lat: 37.7765, lon: 29.0864 },
  { name: "Trabzon", lat: 41.0015, lon: 39.7178 },
  { name: "Van", lat: 38.4891, lon: 43.4089 },
  { name: "Malatya", lat: 38.3552, lon: 38.3095 },
  { name: "Erzurum", lat: 39.9043, lon: 41.2678 },
]

// Ev sistemleri
const HOUSE_SYSTEMS = [
  { value: "P", label: "Placidus (En yaygın)" },
  { value: "K", label: "Koch" },
  { value: "E", label: "Equal (Eşit)" },
  { value: "W", label: "Whole Sign (Tam Burç)" },
  { value: "C", label: "Campanus" },
  { value: "R", label: "Regiomontanus" },
]

export function NatalChartForm({ onSubmit, loading = false }: NatalChartFormProps) {
  const [birthDate, setBirthDate] = useState("")
  const [birthTime, setBirthTime] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [customLat, setCustomLat] = useState("")
  const [customLon, setCustomLon] = useState("")
  const [useCustomCoords, setUseCustomCoords] = useState(false)
  const [houseSystem, setHouseSystem] = useState("P")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    let latitude: number
    let longitude: number
    let cityName: string

    if (useCustomCoords) {
      latitude = parseFloat(customLat)
      longitude = parseFloat(customLon)
      cityName = "Özel Konum"
    } else {
      const city = TURKISH_CITIES.find(c => c.name === selectedCity)
      if (!city) {
        alert("Lütfen bir şehir seçin")
        return
      }
      latitude = city.lat
      longitude = city.lon
      cityName = city.name
    }

    if (!birthDate) {
      alert("Lütfen doğum tarihinizi girin")
      return
    }

    onSubmit({
      birthDate,
      birthTime: birthTime || "12:00", // Eğer saat girilmemişse öğlen
      latitude,
      longitude,
      cityName,
      houseSystem,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doğum Bilgileriniz</CardTitle>
        <CardDescription>
          Doğum haritanızı hesaplamak için aşağıdaki bilgileri girin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Doğum Tarihi */}
          <div className="space-y-2">
            <Label htmlFor="birthDate">Doğum Tarihi *</Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />
          </div>

          {/* Doğum Saati */}
          <div className="space-y-2">
            <Label htmlFor="birthTime">
              Doğum Saati (Opsiyonel - bilmiyorsanız boş bırakın)
            </Label>
            <Input
              id="birthTime"
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Doğum saatinizi bilmiyorsanız, öğlen (12:00) kullanılacaktır
            </p>
          </div>

          {/* Şehir veya Koordinat Seçimi */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useCustomCoords"
                checked={useCustomCoords}
                onChange={(e) => setUseCustomCoords(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="useCustomCoords" className="cursor-pointer">
                Özel koordinat gir
              </Label>
            </div>
          </div>

          {!useCustomCoords ? (
            // Şehir Seçimi
            <div className="space-y-2">
              <Label htmlFor="city">Doğum Yeri (Şehir) *</Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Şehir seçin" />
                </SelectTrigger>
                <SelectContent>
                  {TURKISH_CITIES.map((city) => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            // Özel Koordinatlar
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Enlem (Latitude) *</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.0001"
                  placeholder="Örn: 41.0082"
                  value={customLat}
                  onChange={(e) => setCustomLat(e.target.value)}
                  required={useCustomCoords}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Boylam (Longitude) *</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.0001"
                  placeholder="Örn: 28.9784"
                  value={customLon}
                  onChange={(e) => setCustomLon(e.target.value)}
                  required={useCustomCoords}
                />
              </div>
            </div>
          )}

          {/* Ev Sistemi */}
          <div className="space-y-2">
            <Label htmlFor="houseSystem">Ev Sistemi</Label>
            <Select value={houseSystem} onValueChange={setHouseSystem}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HOUSE_SYSTEMS.map((system) => (
                  <SelectItem key={system.value} value={system.value}>
                    {system.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Placidus en yaygın kullanılan ev sistemidir
            </p>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Hesaplanıyor...
              </>
            ) : (
              "Doğum Haritamı Hesapla"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
