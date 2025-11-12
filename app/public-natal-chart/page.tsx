"use client"

/**
 * Public Natal Chart Page
 * 
 * Giriş yapmamış kullanıcılar için doğum haritası ve AI analizi
 * 
 * @author Manus AI
 * @date 12 Kasım 2025
 */

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Sparkles, AlertCircle, MapPin, Calendar, Clock } from "lucide-react"

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

export default function PublicNatalChartPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chartData, setChartData] = useState<ChartData | null>(null)

  // Form state
  const [birthDate, setBirthDate] = useState("")
  const [birthTime, setBirthTime] = useState("")
  const [birthPlace, setBirthPlace] = useState("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setChartData(null)

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const setExampleData = () => {
    setBirthDate("1990-01-15")
    setBirthTime("10:30")
    setBirthPlace("İstanbul, Türkiye")
    setLatitude("41.0082")
    setLongitude("28.9784")
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
        </AlertDescription>
      </Alert>

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

                <div className="space-y-2">
                  <Label htmlFor="birthPlace">
                    <MapPin className="inline w-4 h-4 mr-2" />
                    Doğum Yeri (Opsiyonel)
                  </Label>
                  <Input
                    id="birthPlace"
                    type="text"
                    placeholder="İstanbul, Türkiye"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Enlem (Latitude)</Label>
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
                    <Label htmlFor="longitude">Boylam (Longitude)</Label>
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
                  Koordinatlarınızı{" "}
                  <a
                    href="https://www.google.com/maps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google Maps
                  </a>
                  'ten bulabilirsiniz
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
                    Henüz hesaplama yapılmadı
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
                        Kişiselleştirilmiş
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {loading && (
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-lg font-semibold mb-2">
                    Doğum haritanız hesaplanıyor...
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Swiss Ephemeris ile gezegen pozisyonları hesaplanıyor ve
                    Gemini AI ile analiz ediliyor
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {chartData && (
            <Tabs defaultValue="summary" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">Özet</TabsTrigger>
                <TabsTrigger value="planets">Gezegenler</TabsTrigger>
                <TabsTrigger value="houses">Evler</TabsTrigger>
                <TabsTrigger value="analysis">AI Analizi</TabsTrigger>
              </TabsList>

              {/* Summary Tab */}
              <TabsContent value="summary" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Doğum Bilgileri</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Tarih ve Saat</p>
                        <p className="font-medium">{chartData.birthInfo.dateFormatted}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Yer</p>
                        <p className="font-medium">{chartData.birthInfo.place}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Yükselen Burç (ASC)</p>
                        <p className="font-medium text-lg text-primary">
                          {chartData.chart.ascendant.zodiacSign}{" "}
                          {Math.floor(chartData.chart.ascendant.zodiacDegree)}°
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Orta Gökyüzü (MC)</p>
                        <p className="font-medium text-lg text-primary">
                          {chartData.chart.midheaven.zodiacSign}{" "}
                          {Math.floor(chartData.chart.midheaven.zodiacDegree)}°
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Önemli Gezegenler</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {chartData.chart.planets.slice(0, 5).map((planet) => (
                        <div
                          key={planet.planetName}
                          className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                        >
                          <span className="font-medium">{planet.planetName}</span>
                          <span className="text-primary">
                            {planet.zodiacSign} {Math.floor(planet.zodiacDegree)}°
                            {planet.retrograde && " (R)"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Planets Tab */}
              <TabsContent value="planets">
                <Card>
                  <CardHeader>
                    <CardTitle>Gezegen Pozisyonları</CardTitle>
                    <CardDescription>
                      Doğum anınızdaki tüm gezegen pozisyonları
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {chartData.chart.planets.map((planet) => (
                        <div
                          key={planet.planetName}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary transition-colors"
                        >
                          <div>
                            <span className="font-medium">{planet.planetName}</span>
                            {planet.retrograde && (
                              <span className="ml-2 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-1 rounded">
                                Retrograde
                              </span>
                            )}
                          </div>
                          <span className="text-primary font-medium">
                            {planet.zodiacSign} {Math.floor(planet.zodiacDegree)}°
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Houses Tab */}
              <TabsContent value="houses">
                <Card>
                  <CardHeader>
                    <CardTitle>Evler</CardTitle>
                    <CardDescription>
                      Doğum haritanızdaki 12 ev (Placidus sistemi)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {chartData.chart.houses.map((house) => (
                        <div
                          key={house.houseNumber}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary transition-colors"
                        >
                          <span className="font-medium">{house.houseNumber}. Ev</span>
                          <span className="text-primary">
                            {house.zodiacSign} {Math.floor(house.zodiacDegree)}°
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analysis Tab */}
              <TabsContent value="analysis">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Gemini AI Analizi
                    </CardTitle>
                    <CardDescription>
                      Doğum haritanızın detaylı ve kişiselleştirilmiş analizi
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {chartData.analysis ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div className="text-foreground">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => (
                                <p className="text-foreground mb-4">{children}</p>
                              ),
                              strong: ({ children }) => (
                                <strong className="text-foreground font-bold">
                                  {children}
                                </strong>
                              ),
                              em: ({ children }) => (
                                <em className="text-foreground italic">{children}</em>
                              ),
                              h1: ({ children }) => (
                                <h1 className="text-foreground text-2xl font-bold mb-4">
                                  {children}
                                </h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="text-foreground text-xl font-bold mb-3">
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="text-foreground text-lg font-bold mb-2">
                                  {children}
                                </h3>
                              ),
                              ul: ({ children }) => (
                                <ul className="text-foreground list-disc list-inside mb-4">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="text-foreground list-decimal list-inside mb-4">
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => (
                                <li className="text-foreground mb-1">{children}</li>
                              ),
                            }}
                          >
                            {chartData.analysis}
                          </ReactMarkdown>
                        </div>

                        <div className="mt-8 pt-6 border-t border-border">
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Bu analiz, Swiss Ephemeris astronomik verileri ve Gemini
                            AI kullanılarak gerçek gezegen pozisyonlarına dayalı
                            olarak oluşturulmuştur.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Analiz oluşturulamadı. Lütfen tekrar deneyin.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  )
}
