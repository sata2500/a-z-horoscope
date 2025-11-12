import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Stars, Heart, TrendingUp, Calendar, BookOpen, Zap } from "lucide-react"
import { auth } from "@/auth"

export default async function HomePage() {
  const session = await auth()

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
              Gemini AI destekli kişiselleştirilmiş burç yorumları ve Swiss Ephemeris ile gerçek astronomik verilere dayalı analizler. 
              Modern teknoloji ile kadim bilgeliği birleştiren Az-Horoscope&apos;a hoş geldiniz.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              {!session ? (
                <>
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
                </>
              ) : (
                <>
                  <Button size="lg" asChild>
                    <Link href="/dashboard">
                      <TrendingUp className="mr-2 size-5" />
                      Dashboard&apos;a Git
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/public-horoscope">Burç Yorumları</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/natal-chart">Doğum Haritam</Link>
                  </Button>
                </>
              )}
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
              Modern teknoloji ve astrolojinin mükemmel birleşimi ile size özel deneyim
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-primary/20 transition-all hover:shadow-lg hover:border-primary/40">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="size-6 text-primary" />
                </div>
                <CardTitle>Yapay Zeka Destekli</CardTitle>
                <CardDescription>
                  Google Gemini AI ile kişiselleştirilmiş, detaylı ve güncel burç yorumları. 
                  Her yorum size özel olarak hazırlanır.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 transition-all hover:shadow-lg hover:border-primary/40">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Stars className="size-6 text-primary" />
                </div>
                <CardTitle>Swiss Ephemeris</CardTitle>
                <CardDescription>
                  Gerçek astronomik veriler ve gezegen pozisyonları ile profesyonel doğum haritası analizleri
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 transition-all hover:shadow-lg hover:border-primary/40">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="size-6 text-primary" />
                </div>
                <CardTitle>Günlük, Haftalık, Aylık</CardTitle>
                <CardDescription>
                  Her gün yeni, özgün ve size özel hazırlanmış burç yorumları ile geleceğinizi planlayın
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 transition-all hover:shadow-lg hover:border-primary/40">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Heart className="size-6 text-primary" />
                </div>
                <CardTitle>Uyumluluk Analizi</CardTitle>
                <CardDescription>
                  Burçlar arası uyumluluk analizi ile ilişkilerinizi keşfedin ve anlamlandırın
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 transition-all hover:shadow-lg hover:border-primary/40">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="size-6 text-primary" />
                </div>
                <CardTitle>Kişisel Günlük</CardTitle>
                <CardDescription>
                  Ruh halinizi takip edin, gezegen geçişleri ile korelasyonları keşfedin
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 transition-all hover:shadow-lg hover:border-primary/40">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="size-6 text-primary" />
                </div>
                <CardTitle>Modern ve Hızlı</CardTitle>
                <CardDescription>
                  Kullanıcı dostu, responsive, dark mode destekli arayüz ve Google OAuth ile güvenli giriş
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section - Only for logged in users */}
      {session && (
        <section className="bg-gradient-to-b from-background to-primary/5 py-16">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="text-center border-primary/20">
                <CardHeader>
                  <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="size-8 text-primary" />
                  </div>
                  <CardTitle className="text-3xl font-bold">Kişisel</CardTitle>
                  <CardDescription>
                    Size özel burç yorumları ve analizler
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center border-primary/20">
                <CardHeader>
                  <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-full bg-primary/10">
                    <TrendingUp className="size-8 text-primary" />
                  </div>
                  <CardTitle className="text-3xl font-bold">Dashboard</CardTitle>
                  <CardDescription>
                    Tüm yorumlarınızı tek bir yerde takip edin
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center border-primary/20">
                <CardHeader>
                  <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-full bg-primary/10">
                    <BookOpen className="size-8 text-primary" />
                  </div>
                  <CardTitle className="text-3xl font-bold">Günlük</CardTitle>
                  <CardDescription>
                    Ruh halinizi kaydedin, gezegen etkilerini görün
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-background to-primary/10 py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {!session ? "Yolculuğunuza Bugün Başlayın" : "Keşfetmeye Devam Edin"}
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              {!session 
                ? "Ücretsiz hesap oluşturun ve kişiselleştirilmiş burç yorumlarınıza hemen erişin."
                : "Dashboard'unuzda yeni yorumlarınızı keşfedin ve günlüğünüzü tutmaya devam edin."
              }
            </p>
            {!session ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/login">
                    <Sparkles className="mr-2 size-5" />
                    Ücretsiz Başla
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/public-horoscope">
                    Önce İncele
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/dashboard">
                    <TrendingUp className="mr-2 size-5" />
                    Dashboard
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/journal">
                    <BookOpen className="mr-2 size-5" />
                    Günlüğüm
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
