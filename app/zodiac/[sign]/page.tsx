import { notFound } from "next/navigation"
import { zodiacSigns, ZodiacSign } from "@/lib/zodiac"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, Heart, Users, TrendingUp } from "lucide-react"

interface PageProps {
  params: Promise<{
    sign: string
  }>
}

export async function generateStaticParams() {
  return Object.keys(zodiacSigns).map((sign) => ({
    sign,
  }))
}

export default async function ZodiacDetailPage({ params }: PageProps) {
  const { sign } = await params
  
  if (!zodiacSigns[sign as ZodiacSign]) {
    notFound()
  }

  const zodiac = zodiacSigns[sign as ZodiacSign]

  // Uyumlu burçlar (basit mantık - aynı element)
  const compatibleSigns = Object.entries(zodiacSigns)
    .filter(([key, z]) => z.element === zodiac.element && key !== sign)
    .map(([key, z]) => ({ key, ...z }))

  return (
    <div className="container py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-block text-8xl" style={{ color: zodiac.color }}>
          {zodiac.symbol}
        </div>
        <h1 className="text-4xl font-bold tracking-tight">{zodiac.nameTr}</h1>
        <p className="mt-2 text-xl text-muted-foreground">{zodiac.dateRangeTr}</p>
      </div>

      {/* Temel Bilgiler */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              Element
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold" style={{ color: zodiac.color }}>
              {zodiac.elementTr}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {zodiac.element === "fire" && "Ateş elementli burçlar enerjik, tutkulu ve cesurdur."}
              {zodiac.element === "earth" && "Toprak elementli burçlar pratik, güvenilir ve kararlıdır."}
              {zodiac.element === "air" && "Hava elementli burçlar zeki, sosyal ve iletişim yeteneği güçlüdür."}
              {zodiac.element === "water" && "Su elementli burçlar duygusal, sezgisel ve empatiktir."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              Yönetici Gezegen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold" style={{ color: zodiac.color }}>
              {zodiac.planetTr}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Burcunuzun enerjisini ve karakteristiklerini etkileyen gezegen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="size-5 text-primary" />
              Kalite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold" style={{ color: zodiac.color }}>
              {zodiac.quality === "cardinal" && "Öncü"}
              {zodiac.quality === "fixed" && "Sabit"}
              {zodiac.quality === "mutable" && "Değişken"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {zodiac.quality === "cardinal" && "Yeni başlangıçları başlatır, liderlik özelliği taşır."}
              {zodiac.quality === "fixed" && "Kararlı, sabırlı ve istikrarlıdır."}
              {zodiac.quality === "mutable" && "Uyumlu, esnek ve değişime açıktır."}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Özellikler */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Genel Özellikler</CardTitle>
          <CardDescription>
            {zodiac.nameTr} burcunun karakteristik özellikleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold text-green-600 dark:text-green-400">
                ✓ Güçlü Yönler
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {zodiac.traits.positive.map((trait, index) => (
                  <li key={index}>• {trait}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-orange-600 dark:text-orange-400">
                ! Geliştirilmesi Gerekenler
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {zodiac.traits.negative.map((trait, index) => (
                  <li key={index}>• {trait}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uyumlu Burçlar */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5" />
            Uyumlu Burçlar
          </CardTitle>
          <CardDescription>
            Aynı element grubundan burçlar genellikle uyumludur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {compatibleSigns.map((compatibleSign) => (
              <Link
                key={compatibleSign.key}
                href={`/zodiac/${compatibleSign.key}`}
                className="flex items-center gap-2 rounded-lg border p-3 transition-colors hover:bg-accent"
              >
                <span className="text-2xl" style={{ color: compatibleSign.color }}>
                  {compatibleSign.symbol}
                </span>
                <span className="font-medium">{compatibleSign.nameTr}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <Link href="/public-horoscope">
          <Button size="lg" className="gap-2">
            <Sparkles className="size-5" />
            Burç Yorumunu Al
          </Button>
        </Link>
      </div>
    </div>
  )
}
