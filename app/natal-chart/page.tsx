"use client"

/**
 * Doğum Haritası Sayfası
 * 
 * Kullanıcının doğum haritasını hesaplama ve görüntüleme sayfası.
 * 
 * @author Salih TANRISEVEN
 * @date 11 Kasım 2025
 */

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { NatalChartForm } from "@/components/astrology/natal-chart-form"
import { PlanetPositions } from "@/components/astrology/planet-positions"
import { HousesTable } from "@/components/astrology/houses-table"
import { AspectsList } from "@/components/astrology/aspects-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Sparkles } from "lucide-react"

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

interface Aspect {
  planet1: string
  planet2: string
  aspectType: string
  angle: number
  orb: number
  applying: boolean
}

interface NatalChartData {
  birthDate: string
  latitude: number
  longitude: number
  planets: PlanetPosition[]
  houses: HousePosition[]
  ascendant: {
    longitude: number
    zodiacSign: string
    zodiacDegree: number
  }
  midheaven: {
    longitude: number
    zodiacSign: string
    zodiacDegree: number
  }
  aspects: Aspect[]
  houseSystem: string
  cityName?: string
}

export default function NatalChartPage() {
  const { status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chartData, setChartData] = useState<NatalChartData | null>(null)

  // Auth kontrolü
  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  const handleFormSubmit = async (formData: {
    birthDate: string
    birthTime: string
    latitude: number
    longitude: number
    cityName: string
    houseSystem: string
  }) => {
    setLoading(true)
    setError(null)

    try {
      // API'ye istek gönder
      const response = await fetch("/api/astrology/natal-chart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          birthDate: `${formData.birthDate}T${formData.birthTime}:00Z`,
          birthTime: formData.birthTime,
          latitude: formData.latitude,
          longitude: formData.longitude,
          houseSystem: formData.houseSystem,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Doğum haritası hesaplanamadı")
      }

      const result = await response.json()
      
      setChartData({
        ...result.data,
        cityName: formData.cityName,
      })
    } catch (err) {
      console.error("Natal chart error:", err)
      setError(err instanceof Error ? err.message : "Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Başlık */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Doğum Haritam</h1>
        <p className="text-muted-foreground">
          Doğum anınızdaki gezegen pozisyonlarını ve astrolojik haritanızı keşfedin
        </p>
      </div>

      {/* Bilgilendirme */}
      <Alert className="mb-6">
        <Sparkles className="h-4 w-4" />
        <AlertTitle>Swiss Ephemeris ile Profesyonel Hesaplama</AlertTitle>
        <AlertDescription>
          Doğum haritanız, NASA JPL ephemeris verilerini kullanan Swiss Ephemeris ile
          yüksek hassasiyette hesaplanmaktadır.
        </AlertDescription>
      </Alert>

      {/* Hata Mesajı */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol: Form */}
        <div className="lg:col-span-1">
          <NatalChartForm onSubmit={handleFormSubmit} loading={loading} />
        </div>

        {/* Sağ: Sonuçlar */}
        <div className="lg:col-span-2">
          {!chartData ? (
            <Card>
              <CardHeader>
                <CardTitle>Doğum Haritanız</CardTitle>
                <CardDescription>
                  Sol taraftaki formu doldurarak doğum haritanızı hesaplayın
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center min-h-[300px] text-muted-foreground">
                  <p>Henüz hesaplama yapılmadı</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Özet Bilgiler */}
              <Card>
                <CardHeader>
                  <CardTitle>Doğum Bilgileri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Doğum Tarihi</p>
                      <p className="font-medium">
                        {new Date(chartData.birthDate).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Doğum Yeri</p>
                      <p className="font-medium">{chartData.cityName || "Özel Konum"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Yükselen Burç</p>
                      <p className="font-medium text-lg">
                        {chartData.ascendant.zodiacSign} {Math.floor(chartData.ascendant.zodiacDegree)}°
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Orta Gökyüzü (MC)</p>
                      <p className="font-medium text-lg">
                        {chartData.midheaven.zodiacSign} {Math.floor(chartData.midheaven.zodiacDegree)}°
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Gezegen Pozisyonları */}
              <PlanetPositions planets={chartData.planets} />

              {/* Evler */}
              <HousesTable houses={chartData.houses} />

              {/* Aspect'ler */}
              <AspectsList aspects={chartData.aspects} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
