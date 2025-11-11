"use client"

import { useState } from "react"
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
    } catch (error) {
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
    } catch (error) {
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
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="daily">Günlük Yorum</TabsTrigger>
          <TabsTrigger value="compatibility">Uyumluluk</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Burcunuzu Seçin</CardTitle>
              <CardDescription>
                Günlük burç yorumunuzu almak için burcunuzu seçin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ZodiacSelector
                selectedSign={selectedSign}
                onSelectSign={setSelectedSign}
              />

              {selectedSign && (
                <div className="flex flex-col gap-4">
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <div className="flex items-center gap-4">
                      <div className="text-5xl" style={{ color: zodiacSigns[selectedSign].color }}>
                        {zodiacSigns[selectedSign].symbol}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{zodiacSigns[selectedSign].nameTr}</h3>
                        <p className="text-sm text-muted-foreground">
                          {zodiacSigns[selectedSign].dateRangeTr}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Element: {zodiacSigns[selectedSign].elementTr} | Gezegen: {zodiacSigns[selectedSign].planetTr}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleGetDailyReading}
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 size-5 animate-spin" />
                        Yorum Hazırlanıyor...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 size-5" />
                        Günlük Yorumu Al
                      </>
                    )}
                  </Button>
                </div>
              )}

              {dailyReading && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="size-5 text-primary" />
                      Bugünün Burç Yorumu
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">{dailyReading}</p>
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
              <CardTitle>Burçları Seçin</CardTitle>
              <CardDescription>
                Uyumluluk analizi için iki burç seçin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-4 text-sm font-medium">İlk Burç</h3>
                <ZodiacSelector
                  selectedSign={selectedSign}
                  onSelectSign={setSelectedSign}
                />
              </div>

              <div>
                <h3 className="mb-4 text-sm font-medium">İkinci Burç</h3>
                <ZodiacSelector
                  selectedSign={selectedSign2}
                  onSelectSign={setSelectedSign2}
                />
              </div>

              {selectedSign && selectedSign2 && (
                <Button
                  onClick={handleGetCompatibility}
                  disabled={loading}
                  size="lg"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-5 animate-spin" />
                      Analiz Ediliyor...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 size-5" />
                      Uyumluluk Analizini Al
                    </>
                  )}
                </Button>
              )}

              {compatibility && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="size-5 text-primary" />
                      Uyumluluk Analizi
                    </CardTitle>
                    <CardDescription>
                      {zodiacSigns[selectedSign!].nameTr} & {zodiacSigns[selectedSign2!].nameTr}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">{compatibility}</p>
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
