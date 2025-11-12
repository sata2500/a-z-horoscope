"use client"

/**
 * Doğum Haritası Sayfası
 * 
 * Kullanıcının doğum haritasını hesaplama, kaydetme ve görüntüleme sayfası.
 * 
 * @author Salih TANRISEVEN & Manus AI
 * @date 11-12 Kasım 2025
 */

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { NatalChartForm } from "@/components/astrology/natal-chart-form"
import { PlanetPositions } from "@/components/astrology/planet-positions"
import { HousesTable } from "@/components/astrology/houses-table"
import { AspectsList } from "@/components/astrology/aspects-list"
import { ElementModalityDistribution } from "@/components/astrology/element-modality-distribution"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, Sparkles, Wand2, Loader2, Save, RefreshCw, ExternalLink, Trash2 } from "lucide-react"
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

interface SavedChartInfo {
  birthDate: Date
  birthTime: string
  birthPlace: string
  birthLatitude: number
  birthLongitude: number
  calculatedAt: Date
}

export default function NatalChartPage() {
  const { status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingSaved, setLoadingSaved] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chartData, setChartData] = useState<NatalChartData | null>(null)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [savedChart, setSavedChart] = useState<SavedChartInfo | null>(null)
  const [showForm, setShowForm] = useState(false)

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

  // Kaydedilmiş doğum haritasını yükle
  useEffect(() => {
    const loadSavedChart = async () => {
      try {
        const response = await fetch("/api/user/natal-chart")
        
        if (response.ok) {
          const result = await response.json()
          if (result.saved && result.data) {
            setSavedChart({
              birthDate: new Date(result.data.birthDate),
              birthTime: result.data.birthTime,
              birthPlace: result.data.birthPlace,
              birthLatitude: result.data.birthLatitude,
              birthLongitude: result.data.birthLongitude,
              calculatedAt: new Date(result.data.calculatedAt),
            })
            
            // Kaydedilmiş chart data varsa göster
            if (result.data.chartData) {
              setChartData(result.data.chartData as NatalChartData)
            }
          }
        }
      } catch (err) {
        console.error("Error loading saved chart:", err)
      } finally {
        setLoadingSaved(false)
      }
    }

    if (status === "authenticated") {
      loadSavedChart()
    }
  }, [status])

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
      
      const newChartData = {
        ...result.data,
        cityName: formData.cityName,
      }
      
      setChartData(newChartData)
      setShowForm(false)
    } catch (err) {
      console.error("Natal chart error:", err)
      setError(err instanceof Error ? err.message : "Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveChart = async () => {
    if (!chartData) return

    setSaving(true)
    setError(null)

    try {
      const response = await fetch("/api/user/natal-chart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          birthDate: chartData.birthDate,
          birthTime: chartData.birthDate.split("T")[1]?.substring(0, 5) || "12:00",
          birthPlace: chartData.cityName || "Bilinmiyor",
          birthLatitude: chartData.latitude,
          birthLongitude: chartData.longitude,
          chartData: chartData,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Kaydetme başarısız")
      }

      const result = await response.json()
      
      setSavedChart({
        birthDate: new Date(result.data.birthDate),
        birthTime: result.data.birthTime,
        birthPlace: result.data.birthPlace,
        birthLatitude: chartData.latitude,
        birthLongitude: chartData.longitude,
        calculatedAt: new Date(result.data.calculatedAt),
      })

      alert("✅ Doğum haritanız başarıyla kaydedildi!")
    } catch (err) {
      console.error("Save error:", err)
      setError(err instanceof Error ? err.message : "Kaydetme başarısız")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteChart = async () => {
    if (!confirm("Kaydedilmiş doğum haritanızı silmek istediğinizden emin misiniz?")) {
      return
    }

    try {
      const response = await fetch("/api/user/natal-chart", {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Silme başarısız")
      }

      setSavedChart(null)
      setChartData(null)
      setAnalysis(null)
      alert("✅ Doğum haritanız başarıyla silindi")
    } catch (err) {
      console.error("Delete error:", err)
      setError(err instanceof Error ? err.message : "Silme başarısız")
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

  if (loadingSaved) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    )
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
          yüksek hassasiyette hesaplanmaktadır. Haritanız kaydedilir ve istediğiniz zaman erişebilirsiniz.
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

      {/* Kaydedilmiş Harita Bilgisi */}
      {savedChart && !showForm && (
        <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Save className="h-5 w-5 text-green-600 dark:text-green-400" />
              Kaydedilmiş Doğum Haritanız
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-300">Doğum Tarihi</p>
                <p className="font-medium dark:text-gray-100">
                  {savedChart.birthDate.toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-300">Doğum Saati</p>
                <p className="font-medium dark:text-gray-100">{savedChart.birthTime}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-300">Doğum Yeri</p>
                <p className="font-medium dark:text-gray-100">{savedChart.birthPlace}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => setShowForm(true)}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Yeniden Hesapla
              </Button>
              <Button
                onClick={handleDeleteChart}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Sil
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
              >
                <Link href="/public-natal-chart">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Başka Birinin Haritasını Hesapla
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form veya Sonuçlar */}
      {(!savedChart || showForm) ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol: Form */}
          <div className="lg:col-span-1">
            <NatalChartForm onSubmit={handleFormSubmit} loading={loading} />
            {savedChart && (
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
                className="w-full mt-4"
              >
                İptal
              </Button>
            )}
          </div>

          {/* Sağ: Placeholder */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="dark:text-white">Doğum Haritanız</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Sol taraftaki formu doldurarak doğum haritanızı hesaplayın
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center min-h-[300px] text-muted-foreground dark:text-gray-400">
                  <p>Formu doldurun ve hesaplama yapın</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : chartData ? (
        <div className="space-y-6">
          {/* Özet Bilgiler */}
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <span className="text-2xl">✨</span>
                  Doğum Bilgileri
                </CardTitle>
                {!savedChart && (
                  <Button
                    onClick={handleSaveChart}
                    disabled={saving}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Kaydet
                      </>
                    )}
                  </Button>
                )}
              </div>
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
      ) : null}
    </div>
  )
}
