"use client"

import { useState } from "react"
import { zodiacSigns, ZodiacSign } from "@/lib/zodiac"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Sparkles, Calendar, TrendingUp } from "lucide-react"

/**
 * Public Horoscope Page
 * 
 * Giriş yapmamış kullanıcılar için burç yorumları sayfası.
 * Swiss Ephemeris + Gemini AI ile profesyonel yorumlar.
 */
export default function PublicHoroscopePage() {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null)
  const [readingType, setReadingType] = useState<"daily" | "weekly" | "monthly">("daily")
  const [reading, setReading] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGetReading = async (sign: ZodiacSign, type: "daily" | "weekly" | "monthly") => {
    setLoading(true)
    setError(null)
    setReading(null)
    setSelectedSign(sign)
    setReadingType(type)

    try {
      const response = await fetch(`/api/public/horoscope/${type}?sign=${sign}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Yorum alınamadı")
      }

      setReading(data.data.reading)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const getReadingTypeLabel = (type: "daily" | "weekly" | "monthly") => {
    switch (type) {
      case "daily":
        return "Günlük"
      case "weekly":
        return "Haftalık"
      case "monthly":
        return "Aylık"
    }
  }

  const getReadingTypeIcon = (type: "daily" | "weekly" | "monthly") => {
    switch (type) {
      case "daily":
        return <Sparkles className="w-5 h-5" />
      case "weekly":
        return <Calendar className="w-5 h-5" />
      case "monthly":
        return <TrendingUp className="w-5 h-5" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          ✨ Profesyonel Burç Yorumları
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Swiss Ephemeris astronomik verileri ve Gemini AI ile hazırlanan,
          gerçek gezegen pozisyonlarına dayalı profesyonel burç yorumları
        </p>
      </div>

      {/* Reading Type Tabs */}
      <Tabs defaultValue="daily" className="mb-8" onValueChange={(value) => setReadingType(value as any)}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Günlük
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Haftalık
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Aylık
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Zodiac Signs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
        {Object.entries(zodiacSigns).map(([sign, info]) => (
          <Card
            key={sign}
            className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
              selectedSign === sign ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleGetReading(sign as ZodiacSign, readingType)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{info.nameTr}</CardTitle>
                  <CardDescription className="text-xs">{info.dateRangeTr}</CardDescription>
                </div>
                <span className="text-3xl">{info.symbol}</span>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-secondary rounded">{info.elementTr}</span>
                <span className="px-2 py-1 bg-secondary rounded">{info.planetTr}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reading Display */}
      {(loading || reading || error) && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  {selectedSign && zodiacSigns[selectedSign].symbol}{" "}
                  {selectedSign && zodiacSigns[selectedSign].nameTr}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  {getReadingTypeIcon(readingType)}
                  {getReadingTypeLabel(readingType)} Burç Yorumu
                </CardDescription>
              </div>
              {selectedSign && (
                <div className="text-right text-sm text-muted-foreground">
                  <div>{zodiacSigns[selectedSign].elementTr} Elementi</div>
                  <div>{zodiacSigns[selectedSign].planetTr} Gezegeni</div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-lg">Profesyonel yorum hazırlanıyor...</span>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
                <p className="font-semibold">Hata</p>
                <p>{error}</p>
              </div>
            )}

            {reading && (
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed">{reading}</div>
                
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Bu yorum, Swiss Ephemeris astronomik verileri ve Gemini AI kullanılarak
                    gerçek gezegen pozisyonlarına dayalı olarak oluşturulmuştur.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Info Section */}
      {!reading && !loading && !error && (
        <Card className="max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              Nasıl Çalışır?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
                <div className="text-3xl mb-2">🔭</div>
                <h3 className="font-semibold mb-2">Swiss Ephemeris</h3>
                <p className="text-sm text-muted-foreground">
                  Gerçek astronomik verilerle gezegen pozisyonları hesaplanır
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
                <div className="text-3xl mb-2">🤖</div>
                <h3 className="font-semibold mb-2">Gemini AI</h3>
                <p className="text-sm text-muted-foreground">
                  Profesyonel astroloji bilgisi ile yorumlar oluşturulur
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
                <div className="text-3xl mb-2">✨</div>
                <h3 className="font-semibold mb-2">Kişiselleştirilmiş</h3>
                <p className="text-sm text-muted-foreground">
                  Her burç için özel, detaylı ve güncel yorumlar
                </p>
              </div>
            </div>
            
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                Yukarıdan burç seçimi yaparak başlayın 👆
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
