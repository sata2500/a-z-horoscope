import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { zodiacSigns } from "@/lib/zodiac"

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const userZodiac = session.user.zodiacSign 
    ? zodiacSigns[session.user.zodiacSign as keyof typeof zodiacSigns]
    : null

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profilim</h1>
        <p className="text-muted-foreground">
          Hesap bilgileriniz ve burç bilgileriniz
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hesap Bilgileri</CardTitle>
            <CardDescription>
              Google hesabınızdan alınan bilgiler
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="size-20">
                <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                <AvatarFallback className="text-2xl">
                  {session.user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{session.user.name}</h3>
                <p className="text-sm text-muted-foreground">{session.user.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm font-medium">Üyelik Tarihi</span>
                <span className="text-sm text-muted-foreground">
                  {session.user.createdAt ? new Date(session.user.createdAt).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm font-medium">Hesap ID</span>
                <span className="text-sm font-mono text-muted-foreground">
                  {session.user.id.slice(0, 8)}...
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Burç Bilgilerim</CardTitle>
            <CardDescription>
              {userZodiac ? "Burç bilgileriniz" : "Henüz burç bilgisi eklenmemiş"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userZodiac ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <div className="text-5xl" style={{ color: userZodiac.color }}>
                    {userZodiac.symbol}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{userZodiac.nameTr}</h3>
                    <p className="text-sm text-muted-foreground">
                      {userZodiac.dateRangeTr}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-sm font-medium">Element</span>
                    <span className="text-sm text-muted-foreground">
                      {userZodiac.elementTr}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-sm font-medium">Gezegen</span>
                    <span className="text-sm text-muted-foreground">
                      {userZodiac.planetTr}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-sm font-medium">Şanslı Sayılar</span>
                    <span className="text-sm text-muted-foreground">
                      {userZodiac.luckyNumber.join(", ")}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2 text-sm font-semibold">Özellikler</h4>
                  <div className="flex flex-wrap gap-2">
                    {userZodiac.traitsTr.map((trait) => (
                      <span
                        key={trait}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <p className="mb-4">Burç bilgilerinizi eklemek için doğum tarihinizi belirtin</p>
                <p className="text-sm">Bu özellik yakında eklenecek...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
