"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodiacSigns } from "@/lib/zodiac"
import { Loader2, Calendar, Sparkles } from "lucide-react"

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [birthDate, setBirthDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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

  const userZodiac = session.user.zodiacSign 
    ? zodiacSigns[session.user.zodiacSign as keyof typeof zodiacSigns]
    : null

  const handleUpdateZodiac = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/user/update-zodiac", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthDate: new Date(birthDate).toISOString() }),
      })

      const data = await response.json()

      if (response.ok) {
        // Session'ı güncelle
        await update({
          ...session,
          user: {
            ...session.user,
            birthDate: data.birthDate,
            zodiacSign: data.zodiacSign,
          },
        })
        
        // Sayfayı yenile
        window.location.reload()
      } else {
        setError(data.error || "Bir hata oluştu")
      }
    } catch {
      setError("Bağlantı hatası")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profilim</h1>
        <p className="text-muted-foreground">
          Hesap bilgileriniz ve burç bilgileriniz
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Hesap Bilgileri */}
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

        {/* Burç Bilgileri */}
        <Card>
          <CardHeader>
            <CardTitle>Burç Bilgilerim</CardTitle>
            <CardDescription>
              {userZodiac ? "Burç bilgileriniz" : "Doğum tarihinizi girerek burcunuzu öğrenin"}
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
                    {session.user.birthDate && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Doğum: {new Date(session.user.birthDate).toLocaleDateString('tr-TR')}
                      </p>
                    )}
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

                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      if (session.user.birthDate) {
                        setBirthDate(new Date(session.user.birthDate).toISOString().split('T')[0])
                      }
                    }}
                  >
                    <Calendar className="mr-2 size-4" />
                    Doğum Tarihini Güncelle
                  </Button>

                  {birthDate && (
                    <form onSubmit={handleUpdateZodiac} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="birthDate" className="text-sm font-medium">
                          Yeni Doğum Tarihi
                        </label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          required
                          max={new Date().toISOString().split('T')[0]}
                        />
                      </div>

                      {error && (
                        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                          {error}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          disabled={loading}
                          className="flex-1"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 size-4 animate-spin" />
                              Kaydediliyor...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 size-4" />
                              Kaydet
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setBirthDate("")}
                          disabled={loading}
                        >
                          İptal
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateZodiac} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="birthDate" className="text-sm font-medium">
                    Doğum Tarihiniz
                  </label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <p className="text-xs text-muted-foreground">
                    Doğum tarihinizi girerek burcunuz otomatik olarak hesaplanacak
                  </p>
                </div>

                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || !birthDate}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 size-4" />
                      Burcumu Hesapla ve Kaydet
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
