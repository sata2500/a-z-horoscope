import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Stars, Heart, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-20 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <Sparkles className="size-16 text-primary animate-pulse" />
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Yeni Nesil Astroloji
              </span>
              <br />
              Yapay Zeka ile Buluştu
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Gemini AI destekli kişiselleştirilmiş burç yorumları ve analizleri ile geleceğinizi keşfedin.
              Modern teknoloji ile kadim bilgeliği birleştiren Az-Horoscope&apos;a hoş geldiniz.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/login">
                  <Sparkles className="mr-2 size-5" />
                  Hemen Başla
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/public-horoscope">Ücretsiz Burç Yorumları</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/public-natal-chart">Doğum Haritası Hesapla</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 opacity-30">
            <div className="size-96 rounded-full bg-primary/20 blur-3xl" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Neden Az-Horoscope?
            </h2>
            <p className="text-lg text-muted-foreground">
              Modern teknoloji ve astrolojinin mükemmel birleşimi
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-primary/20 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="size-6 text-primary" />
                </div>
                <CardTitle>Yapay Zeka Destekli</CardTitle>
                <CardDescription>
                  Google Gemini AI ile kişiselleştirilmiş, detaylı ve güncel burç yorumları
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Stars className="size-6 text-primary" />
                </div>
                <CardTitle>Günlük Yorumlar</CardTitle>
                <CardDescription>
                  Her gün yeni, özgün ve size özel hazırlanmış burç yorumları
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Heart className="size-6 text-primary" />
                </div>
                <CardTitle>Uyumluluk Analizi</CardTitle>
                <CardDescription>
                  Burçlar arası uyumluluk analizi ile ilişkilerinizi keşfedin
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="size-6 text-primary" />
                </div>
                <CardTitle>Kişisel Dashboard</CardTitle>
                <CardDescription>
                  Tüm yorumlarınızı ve analizlerinizi tek bir yerde takip edin
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="size-6 text-primary" />
                </div>
                <CardTitle>Modern Tasarım</CardTitle>
                <CardDescription>
                  Kullanıcı dostu, responsive ve dark mode destekli arayüz
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Stars className="size-6 text-primary" />
                </div>
                <CardTitle>Güvenli ve Hızlı</CardTitle>
                <CardDescription>
                  Google OAuth ile güvenli giriş, hızlı ve stabil performans
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-background to-primary/10 py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Yolculuğunuza Bugün Başlayın
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Ücretsiz hesap oluşturun ve kişiselleştirilmiş burç yorumlarınıza hemen erişin.
            </p>
            <Button size="lg" asChild>
              <Link href="/login">
                <Sparkles className="mr-2 size-5" />
                Ücretsiz Başla
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
