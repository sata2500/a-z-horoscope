import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, Heart, TrendingUp, User } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Hoş Geldiniz, {session.user.name}!
        </h1>
        <p className="text-muted-foreground">
          Kişiselleştirilmiş burç yorumlarınıza ve analizlerinize buradan ulaşabilirsiniz.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-primary/20 transition-all hover:shadow-lg">
          <CardHeader>
            <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="size-6 text-primary" />
            </div>
            <CardTitle>Günlük Burç Yorumu</CardTitle>
            <CardDescription>
              Bugüne özel kişiselleştirilmiş burç yorumunuzu alın
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/horoscope">
                Yorumu Gör
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary/20 transition-all hover:shadow-lg">
          <CardHeader>
            <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <Heart className="size-6 text-primary" />
            </div>
            <CardTitle>Uyumluluk Analizi</CardTitle>
            <CardDescription>
              İki burç arasındaki uyumluluğu keşfedin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/horoscope?tab=compatibility">
                Analiz Et
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary/20 transition-all hover:shadow-lg">
          <CardHeader>
            <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <User className="size-6 text-primary" />
            </div>
            <CardTitle>Profilim</CardTitle>
            <CardDescription>
              Burç bilgilerinizi ve tercihlerinizi yönetin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/profile">
                Profili Düzenle
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats Section */}
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">İstatistikler</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Yorum</CardTitle>
              <Sparkles className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Alınan burç yorumu sayısı
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uyumluluk Testi</CardTitle>
              <Heart className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Yapılan uyumluluk analizi
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktif Gün</CardTitle>
              <TrendingUp className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">
                Platformda geçirilen gün
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
