"use client"

/**
 * Unified Natal Chart Page
 * 
 * Hem giriş yapan hem yapmayan kullanıcılar için birleşik doğum haritası sayfası
 * 
 * @author Salih TANRISEVEN & Manus AI
 * @date 12 Kasım 2025
 */

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Sparkles, AlertCircle, Calendar, Clock, Save, UserPlus, CheckCircle, RefreshCw } from "lucide-react"
import { CitySearch } from "@/components/geocode/city-search"

interface PlanetPosition {
  planetName: string
  zodiacSign: string
  zodiacDegree: number
  retrograde: boolean
}

interface HousePosition {
  houseNumber: number
  zodiacSign: string
  zodiacDegree: number
}

interface ChartData {
  birthInfo: {
    date: string
    dateFormatted: string
    place: string
    latitude: number
    longitude: number
  }
  chart: {
    planets: PlanetPosition[]
    houses: HousePosition[]
    ascendant: {
      zodiacSign: string
      zodiacDegree: number
    }
    midheaven: {
      zodiacSign: string
      zodiacDegree: number
    }
  }
  analysis: string | null
}

export default function NatalChartPage() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [loadingSaved, setLoadingSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [savedChartExists, setSavedChartExists] = useState(false)
  const [autoSaved, setAutoSaved] = useState(false)

  // Form state
  const [birthDate, setBirthDate] = useState("")
  const [birthTime, setBirthTime] = useState("")
  const [birthPlace, setBirthPlace] = useState("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")

  // Giriş yapan kullanıcı için kaydedilmiş haritayı yükle
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      loadSavedChart()
    }
  }, [status, session])

  const loadSavedChart = async () => {
    setLoadingSaved(true)
    try {
      const response = await fetch("/api/user/natal-chart")
      
      if (response.ok) {
        const result = await response.json()
        if (result.saved && result.data) {
          setSavedChartExists(true)
          
          // Form alanlarını doldur
          if (result.data.birthDate) {
            const date = new Date(result.data.birthDate)
            setBirthDate(date.toISOString().split('T')[0])
          }
          if (result.data.birthTime) {
            setBirthTime(result.data.birthTime)
          }
          if (result.data.birthPlace) {
            setBirthPlace(result.data.birthPlace)
          }
          if (result.data.birthLatitude) {
            setLatitude(result.data.birthLatitude.toString())
          }
          if (result.data.birthLongitude) {
            setLongitude(result.data.birthLongitude.toString())
          }
          
          // Chart data varsa göster
          if (result.data.chartData) {
            setChartData(result.data.chartData as ChartData)
          }
        }
      }
    } catch (err) {
      console.error("Error loading saved chart:", err)
    } finally {
      setLoadingSaved(false)
    }
  }

  const handleLocationSelect = (location: { name: string; latitude: number; longitude: number }) => {
    setBirthPlace(location.name)
    setLatitude(location.latitude.toString())
    setLongitude(location.longitude.toString())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setChartData(null)
    setAutoSaved(false)

    try {
      const response = await fetch("/api/public/natal-chart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          birthDate,
          birthTime,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          birthPlace: birthPlace || undefined,
          houseSystem: "P",
          includeAnalysis: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Doğum haritası hesaplanamadı")
      }

      setChartData(data.data)
      
      // Giriş yapmış kullanıcı için otomatik kaydet
      if (status === "authenticated" && session?.user) {
        await autoSaveChart(data.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const autoSaveChart = async (data: ChartData) => {
    try {
      const response = await fetch("/api/user/natal-chart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          birthDate: data.birthInfo.date,
          birthTime: birthTime,
          birthPlace: birthPlace || "Bilinmiyor",
          birthLatitude: data.birthInfo.latitude,
          birthLongitude: data.birthInfo.longitude,
          chartData: data,
        }),
      })

      if (response.ok) {
        setSavedChartExists(true)
        setAutoSaved(true)
      }
    } catch (err) {
      console.error("Auto-save error:", err)
      // Hata gösterme, sessizce başarısız ol
    }
  }

  const handleManualSave = async () => {
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
          birthDate: chartData.birthInfo.date,
          birthTime: birthTime,
          birthPlace: birthPlace || "Bilinmiyor",
          birthLatitude: chartData.birthInfo.latitude,
          birthLongitude: chartData.birthInfo.longitude,
          chartData: chartData,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Kaydetme başarısız")
      }

      setSavedChartExists(true)
      setAutoSaved(true)
      alert("✅ Doğum haritanız başarıyla kaydedildi!")
    } catch (err) {
      console.error("Save error:", err)
      setError(err instanceof Error ? err.message : "Kaydetme başarısız")
    } finally {
      setSaving(false)
    }
  }

  const setExampleData = () => {
    setBirthDate("1990-01-15")
    setBirthTime("10:30")
    setBirthPlace("İstanbul, Türkiye")
    setLatitude("41.0082")
    setLongitude("28.9784")
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          ✨ Profesyonel Doğum Haritası ve AI Analizi
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Swiss Ephemeris ile hesaplanan doğum haritanız ve Gemini AI ile
          hazırlanan detaylı kişilik analizi
        </p>
      </div>

      {/* Info Alert */}
      <Alert className="mb-8 max-w-4xl mx-auto">
        <Sparkles className="h-4 w-4" />
        <AlertTitle>Nasıl Çalışır?</AlertTitle>
        <AlertDescription>
          Doğum tarihiniz, saatiniz ve yerinizi girerek NASA JPL ephemeris verilerini
          kullanan Swiss Ephemeris ile yüksek hassasiyette doğum haritanızı hesaplayın.
          Ardından Gemini AI ile kişiselleştirilmiş, profesyonel bir analiz alın.
          {status === "authenticated" && " Haritanız otomatik olarak kaydedilir."}
        </AlertDescription>
      </Alert>

      {/* Saved Chart Info for Authenticated Users */}
      {status === "authenticated" && savedChartExists && !chartData && (
        <Alert className="mb-6 max-w-4xl mx-auto bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-200">Kaydedilmiş Doğum Haritanız Var</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            Daha önce kaydettiğiniz doğum bilgileriniz form alanlarına yüklendi. 
            "Doğum Haritamı Hesapla" butonuna tıklayarak haritanızı görüntüleyin.
          </AlertDescription>
        </Alert>
      )}

      {/* Auto-save Success Message */}
      {autoSaved && (
        <Alert className="mb-6 max-w-4xl mx-auto bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-200">Otomatik Kaydedildi!</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            Doğum haritanız başarıyla kaydedildi. Artık istediğiniz zaman erişebilirsiniz.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Doğum Bilgileriniz</CardTitle>
              <CardDescription>
                Doğum haritanızı hesaplamak için bilgilerinizi girin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    Doğum Tarihi
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthTime">
                    <Clock className="inline w-4 h-4 mr-2" />
                    Doğum Saati
                  </Label>
                  <Input
                    id="birthTime"
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Doğum saatinizi bilmiyorsanız 12:00 yazabilirsiniz
                  </p>
                </div>

                {/* City Search Component */}
                <CitySearch
                  onLocationSelect={handleLocationSelect}
                  defaultValue={birthPlace}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Enlem</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.0001"
                      placeholder="41.0082"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Boylam</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.0001"
                      placeholder="28.9784"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Koordinatlar şehir seçimiyle otomatik doldurulur
                </p>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Hesaplanıyor...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Doğum Haritamı Hesapla
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={setExampleData}
                >
                  Örnek Veri Doldur
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* CTA for Non-Authenticated Users */}
          {status === "unauthenticated" && chartData && (
            <Card className="mt-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                  <UserPlus className="h-5 w-5" />
                  Daha Fazlası İçin Kaydolun
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Ücretsiz hesap oluşturarak:
                </p>
                <ul className="text-sm space-y-2 text-purple-700 dark:text-purple-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Doğum haritanızı kaydedin ve istediğiniz zaman erişin</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Kişiselleştirilmiş günlük burç yorumları alın</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Astrolojik günlük tutun ve analizler yapın</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Uyumluluk analizleri ve daha fazlası</span>
                  </li>
                </ul>
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                  <Link href="/login">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Ücretsiz Kaydol
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Hata</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!chartData && !loading && !error && (
            <Card>
              <CardHeader>
                <CardTitle>Doğum Haritanız</CardTitle>
                <CardDescription>
                  Sol taraftaki formu doldurarak doğum haritanızı hesaplayın
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                  <div className="text-6xl mb-4">🔮</div>
                  <p className="text-muted-foreground mb-6">
                    {savedChartExists 
                      ? "Kaydedilmiş bilgilerinizle hesaplama yapın" 
                      : "Henüz hesaplama yapılmadı"}
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="bg-secondary p-4 rounded-lg">
                      <div className="text-2xl mb-2">🌟</div>
                      <p className="font-semibold">Swiss Ephemeris</p>
                      <p className="text-xs text-muted-foreground">
                        NASA JPL verileri
                      </p>
                    </div>
                    <div className="bg-secondary p-4 rounded-lg">
                      <div className="text-2xl mb-2">🤖</div>
                      <p className="font-semibold">Gemini AI</p>
                      <p className="text-xs text-muted-foreground">
                        Detaylı analiz
                      </p>
                    </div>
                    <div className="bg-secondary p-4 rounded-lg">
                      <div className="text-2xl mb-2">✨</div>
                      <p className="font-semibold">Profesyonel</p>
                      <p className="text-xs text-muted-foreground">
                        Yüksek hassasiyet
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {chartData && (
            <div className="space-y-6">
              {/* Birth Info Card */}
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">✨</span>
                      Doğum Bilgileri
                    </CardTitle>
                    {status === "authenticated" && !autoSaved && (
                      <Button
                        onClick={handleManualSave}
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
                      <p className="text-sm text-muted-foreground">Doğum Tarihi</p>
                      <p className="font-medium">{chartData.birthInfo.dateFormatted}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Doğum Yeri</p>
                      <p className="font-medium">{chartData.birthInfo.place}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Yükselen Burç</p>
                      <p className="font-medium text-lg text-purple-600 dark:text-purple-400">
                        {chartData.chart.ascendant.zodiacSign} {Math.floor(chartData.chart.ascendant.zodiacDegree)}°
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Orta Gökyüzü (MC)</p>
                      <p className="font-medium text-lg text-blue-600 dark:text-blue-400">
                        {chartData.chart.midheaven.zodiacSign} {Math.floor(chartData.chart.midheaven.zodiacDegree)}°
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Planets and Houses */}
              <Tabs defaultValue="planets" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="planets">Gezegenler</TabsTrigger>
                  <TabsTrigger value="houses">Evler</TabsTrigger>
                </TabsList>

                <TabsContent value="planets" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Gezegen Pozisyonları</CardTitle>
                      <CardDescription>
                        Doğum anınızdaki gezegen konumları
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {chartData.chart.planets.map((planet, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-lg">{planet.planetName}</span>
                              {planet.retrograde && (
                                <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded">
                                  Retrograde
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {planet.zodiacSign} {Math.floor(planet.zodiacDegree)}°
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="houses" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Astrolojik Evler</CardTitle>
                      <CardDescription>
                        12 astrolojik evin burç konumları
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {chartData.chart.houses.map((house, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                          >
                            <span className="font-semibold">{house.houseNumber}. Ev</span>
                            <span className="font-medium">
                              {house.zodiacSign} {Math.floor(house.zodiacDegree)}°
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* AI Analysis */}
              {chartData.analysis && (
                <Card className="border-purple-200 dark:border-purple-800">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      AI Doğum Haritası Analizi
                    </CardTitle>
                    <CardDescription>
                      Gemini AI tarafından oluşturulan kişiselleştirilmiş analiz
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="prose dark:prose-invert max-w-none">
                      <ReactMarkdown>{chartData.analysis}</ReactMarkdown>
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
