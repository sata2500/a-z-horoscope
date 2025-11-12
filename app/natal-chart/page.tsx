"use client"

/**
 * Doğum Haritası Sayfası
 * 
 * Kullanıcının doğum haritasını hesaplama ve görüntüleme sayfası.
 * 
 * @author Salih TANRISEVEN & Manus AI
 * @date 11-12 Kasım 2025
 */

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { NatalChartForm } from "@/components/astrology/natal-chart-form"
import { PlanetPositions } from "@/components/astrology/planet-positions"
import { HousesTable } from "@/components/astrology/houses-table"
import { AspectsList } from "@/components/astrology/aspects-list"
import { ElementModalityDistribution } from "@/components/astrology/element-modality-distribution"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, Sparkles, Wand2, Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"

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
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chartData, setChartData] = useState<NatalChartData | null>(null)
  const [analysis, setAnalysis] = useState<string | null>(null)

  // Auth kontrolü
  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground dark:text-gray-300">Yükleniyor...</p>
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
    setAnalysis(null)

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

  const handleAnalyze = async () => {
    if (!chartData) return

    setAnalyzing(true)
    setError(null)

    try {
      const response = await fetch("/api/astrology/natal-chart-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chartData,
          birthPlace: chartData.cityName,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Analiz oluşturulamadı")
      }

      const result = await response.json()
      setAnalysis(result.analysis)
    } catch (err) {
      console.error("Analysis error:", err)
      setError(err instanceof Error ? err.message : "Analiz oluşturulamadı")
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Başlık */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 dark:text-white">Doğum Haritam</h1>
        <p className="text-muted-foreground dark:text-gray-300">
          Doğum anınızdaki gezegen pozisyonlarını ve astrolojik haritanızı keşfedin
        </p>
      </div>

      {/* Bilgilendirme */}
      <Alert className="mb-6">
        <Sparkles className="h-4 w-4" />
        <AlertTitle className="dark:text-white">Swiss Ephemeris ile Profesyonel Hesaplama</AlertTitle>
        <AlertDescription className="dark:text-gray-200">
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
                <CardTitle className="dark:text-white">Doğum Haritanız</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Sol taraftaki formu doldurarak doğum haritanızı hesaplayın
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center min-h-[300px] text-muted-foreground dark:text-gray-400">
                  <p>Henüz hesaplama yapılmadı</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Özet Bilgiler */}
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 dark:text-white">
                    <span className="text-2xl">✨</span>
                    Doğum Bilgileri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground dark:text-gray-300">Doğum Tarihi</p>
                      <p className="font-medium dark:text-gray-100">
                        {new Date(chartData.birthDate).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground dark:text-gray-300">Doğum Yeri</p>
                      <p className="font-medium dark:text-gray-100">{chartData.cityName || "Özel Konum"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground dark:text-gray-300">Yükselen Burç</p>
                      <p className="font-medium text-lg text-purple-600 dark:text-purple-400">
                        {chartData.ascendant.zodiacSign} {Math.floor(chartData.ascendant.zodiacDegree)}°
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground dark:text-gray-300">Orta Gökyüzü (MC)</p>
                      <p className="font-medium text-lg text-blue-600 dark:text-blue-400">
                        {chartData.midheaven.zodiacSign} {Math.floor(chartData.midheaven.zodiacDegree)}°
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Element ve Modalite Dağılımı */}
              <ElementModalityDistribution planets={chartData.planets} />

              {/* Gezegen Pozisyonları */}
              <PlanetPositions planets={chartData.planets} houses={chartData.houses} />

              {/* Evler */}
              <HousesTable houses={chartData.houses} />

              {/* Aspect'ler */}
              <AspectsList aspects={chartData.aspects} />

              {/* AI Analiz Butonu */}
              {!analysis && (
                <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <Wand2 className="h-12 w-12" />
                      <div>
                        <h3 className="text-xl font-bold mb-2">
                          Doğum Haritanızı AI ile Analiz Edin
                        </h3>
                        <p className="text-purple-100 mb-4">
                          Gemini AI ile kişiselleştirilmiş, profesyonel doğum haritası analizi alın
                        </p>
                      </div>
                      <Button
                        onClick={handleAnalyze}
                        disabled={analyzing}
                        size="lg"
                        className="bg-white text-purple-600 hover:bg-purple-50 font-semibold"
                      >
                        {analyzing ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Analiz Ediliyor...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            AI Analizi Başlat
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* AI Analiz Sonucu */}
              {analysis && (
                <Card className="border-purple-200 dark:border-purple-800">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      AI Doğum Haritası Analizi
                    </CardTitle>
                    <CardDescription className="dark:text-gray-300">
                      Gemini AI tarafından oluşturulan kişiselleştirilmiş analiz
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="prose dark:prose-invert max-w-none">
                      <ReactMarkdown>{analysis}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
