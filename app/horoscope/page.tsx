"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ZodiacSelector } from "@/components/horoscope/zodiac-selector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { zodiacSigns, ZodiacSign } from "@/lib/zodiac"
import { Loader2, Sparkles } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function HoroscopePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | undefined>()
  const [selectedSign2, setSelectedSign2] = useState<ZodiacSign | undefined>()
  const [dailyReading, setDailyReading] = useState<string>("")
  const [weeklyReading, setWeeklyReading] = useState<string>("")
  const [monthlyReading, setMonthlyReading] = useState<string>("")
  const [compatibility, setCompatibility] = useState<string>("")
  const [loading, setLoading] = useState(false)

  if (status === "loading") {
    return (
      <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session) {
    router.push("/login")
    return null
  }

  const handleGetDailyReading = async () => {
    if (!selectedSign) return

    setLoading(true)
    try {
      const response = await fetch("/api/horoscope/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zodiacSign: selectedSign }),
      })

      const data = await response.json()
      if (response.ok) {
        setDailyReading(data.reading)
      } else {
        alert("Burç yorumu alınamadı: " + data.error)
      }
    } catch {
      alert("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const handleGetWeeklyReading = async () => {
    if (!selectedSign) return

    setLoading(true)
    try {
      const response = await fetch("/api/horoscope/weekly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zodiacSign: selectedSign }),
      })

      const data = await response.json()
      if (response.ok) {
        setWeeklyReading(data.reading)
      } else {
        alert("Haftalık burç yorumu alınamadı: " + data.error)
      }
    } catch {
      alert("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const handleGetMonthlyReading = async () => {
    if (!selectedSign) return

    setLoading(true)
    try {
      const response = await fetch("/api/horoscope/monthly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zodiacSign: selectedSign }),
      })

      const data = await response.json()
      if (response.ok) {
        setMonthlyReading(data.reading)
      } else {
        alert("Aylık burç yorumu alınamadı: " + data.error)
      }
    } catch {
      alert("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const handleGetCompatibility = async () => {
    if (!selectedSign || !selectedSign2) return

    setLoading(true)
    try {
      const response = await fetch("/api/horoscope/compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sign1: selectedSign, sign2: selectedSign2 }),
      })

      const data = await response.json()
      if (response.ok) {
        setCompatibility(data.analysis)
      } else {
        alert("Uyumluluk analizi alınamadı: " + data.error)
      }
    } catch {
      alert("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Burç Yorumları</h1>
        <p className="text-muted-foreground">
          Yapay zeka destekli kişiselleştirilmiş burç yorumları ve uyumluluk analizleri
        </p>
      </div>

      <Tabs defaultValue="daily" className="space-y-8">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="daily">Günlük</TabsTrigger>
          <TabsTrigger value="weekly">Haftalık</TabsTrigger>
          <TabsTrigger value="monthly">Aylık</TabsTrigger>
          <TabsTrigger value="compatibility">Uyumluluk</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Günlük Burç Yorumu</CardTitle>
              <CardDescription>
                Bugüne özel kişiselleştirilmiş burç yorumunuzu alın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium">Burcunuzu Seçin</label>
                <ZodiacSelector
                  selectedSign={selectedSign}
                  onSelectSign={setSelectedSign}
                />
              </div>

              <Button
                onClick={handleGetDailyReading}
                disabled={!selectedSign || loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Yorum Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 size-4" />
                    Günlük Yorum Al
                  </>
                )}
              </Button>

              {dailyReading && (
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">
                        {selectedSign && zodiacSigns[selectedSign].symbol}
                      </span>
                      {selectedSign && zodiacSigns[selectedSign].nameTr} - Günlük Yorum
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {dailyReading}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Haftalık Burç Yorumu</CardTitle>
              <CardDescription>
                Bu haftaya özel detaylı burç yorumunuzu alın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium">Burcunuzu Seçin</label>
                <ZodiacSelector
                  selectedSign={selectedSign}
                  onSelectSign={setSelectedSign}
                />
              </div>

              <Button
                onClick={handleGetWeeklyReading}
                disabled={!selectedSign || loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Yorum Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 size-4" />
                    Haftalık Yorum Al
                  </>
                )}
              </Button>

              {weeklyReading && (
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">
                        {selectedSign && zodiacSigns[selectedSign].symbol}
                      </span>
                      {selectedSign && zodiacSigns[selectedSign].nameTr} - Haftalık Yorum
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {weeklyReading}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Aylık Burç Yorumu</CardTitle>
              <CardDescription>
                Bu aya özel kapsamlı burç yorumunuzu alın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium">Burcunuzu Seçin</label>
                <ZodiacSelector
                  selectedSign={selectedSign}
                  onSelectSign={setSelectedSign}
                />
              </div>

              <Button
                onClick={handleGetMonthlyReading}
                disabled={!selectedSign || loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Yorum Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 size-4" />
                    Aylık Yorum Al
                  </>
                )}
              </Button>

              {monthlyReading && (
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">
                        {selectedSign && zodiacSigns[selectedSign].symbol}
                      </span>
                      {selectedSign && zodiacSigns[selectedSign].nameTr} - Aylık Yorum
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {monthlyReading}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compatibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Burç Uyumluluk Analizi</CardTitle>
              <CardDescription>
                İki burç arasındaki uyumluluğu keşfedin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium">İlk Burç</label>
                <ZodiacSelector
                  selectedSign={selectedSign}
                  onSelectSign={setSelectedSign}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">İkinci Burç</label>
                <ZodiacSelector
                  selectedSign={selectedSign2}
                  onSelectSign={setSelectedSign2}
                />
              </div>

              <Button
                onClick={handleGetCompatibility}
                disabled={!selectedSign || !selectedSign2 || loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Analiz Ediliyor...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 size-4" />
                    Uyumluluğu Analiz Et
                  </>
                )}
              </Button>

              {compatibility && (
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">
                        {selectedSign && zodiacSigns[selectedSign].symbol}
                      </span>
                      <span className="text-muted-foreground">&</span>
                      <span className="text-2xl">
                        {selectedSign2 && zodiacSigns[selectedSign2].symbol}
                      </span>
                      Uyumluluk Analizi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {compatibility}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
