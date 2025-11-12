import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Heart, Users, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "Hakkımızda | Az-Horoscope",
  description: "Az-Horoscope hakkında bilgi edinin. Yapay zeka destekli astroloji platformumuz hakkında daha fazla bilgi alın.",
}

export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Hakkımızda</h1>
          <p className="text-xl text-muted-foreground">
            Modern teknoloji ile kadim astroloji bilgeliğini bir araya getiriyoruz
          </p>
        </div>

        {/* Mission Statement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Misyonumuz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Az-Horoscope, astroloji meraklılarına gerçek astronomik verilere dayalı, yapay zeka destekli kişiselleştirilmiş burç yorumları sunmak için tasarlanmış profesyonel bir platformdur.
            </p>
            <p>
              Amacımız, kadim astroloji bilgeliğini modern teknoloji ile birleştirerek kullanıcılarımıza kendilerini daha iyi anlamalarına ve yaşamlarında bilinçli kararlar almalarına yardımcı olacak içgörüler sunmaktır.
            </p>
          </CardContent>
        </Card>

        {/* Values */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Değerlerimiz
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <h3 className="font-semibold">Doğruluk</h3>
                <p className="text-sm text-muted-foreground">
                  Swiss Ephemeris kullanarak gerçek astronomik verilere dayalı hesaplamalar yapıyoruz.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Gizlilik</h3>
                <p className="text-sm text-muted-foreground">
                  Kullanıcı verilerinizin güvenliği ve gizliliği bizim için önceliktir.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">İnovasyon</h3>
                <p className="text-sm text-muted-foreground">
                  Google Gemini AI ile kişiselleştirilmiş ve anlamlı yorumlar sunuyoruz.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Teknolojimiz
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <h3 className="font-semibold">Yapay Zeka</h3>
                <p className="text-sm text-muted-foreground">
                  Google Gemini 2.5 Flash ile güçlendirilmiş kişiselleştirilmiş yorumlar.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Swiss Ephemeris</h3>
                <p className="text-sm text-muted-foreground">
                  Profesyonel astrologlar tarafından kullanılan en doğru gezegen hesaplama motoru.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Modern Stack</h3>
                <p className="text-sm text-muted-foreground">
                  Next.js, TypeScript ve Tailwind CSS ile hızlı ve güvenilir platform.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Ekibimiz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Az-Horoscope, astroloji tutkusu ve teknoloji uzmanlığını bir araya getiren bir ekip tarafından geliştirilmiştir. Hem astroloji meraklıları hem de yazılım geliştiricilerinden oluşan ekibimiz, kullanıcılarımıza en iyi deneyimi sunmak için sürekli çalışmaktadır.
            </p>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center space-y-4 pt-8">
          <h2 className="text-2xl font-bold">Hemen Başlayın</h2>
          <p className="text-muted-foreground">
            Kişiselleştirilmiş burç yorumlarınızı almaya başlamak için kaydolun.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/login">Giriş Yap</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/horoscope">Burçları Keşfet</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
