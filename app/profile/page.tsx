"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodiacSigns } from "@/lib/zodiac"
import { Loader2, Calendar, Sparkles, Bell, Mail } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [birthDate, setBirthDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Bildirim tercihleri state'leri
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [notificationPreferences, setNotificationPreferences] = useState({
    daily: true,
    weekly: false,
    monthly: false,
  })
  const [notificationLoading, setNotificationLoading] = useState(false)
  const [notificationError, setNotificationError] = useState("")
  const [notificationSuccess, setNotificationSuccess] = useState(false)

  // Bildirim tercihlerini yükle
  useEffect(() => {
    if (session?.user?.email) {
      fetch('/api/user/notification-settings')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setEmailNotifications(data.emailNotifications)
            setNotificationPreferences(data.preferences)
          }
        })
        .catch(err => console.error('Bildirim tercihleri yüklenemedi:', err))
    }
  }, [session?.user?.email])

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
      // DD.MM.YYYY formatını ISO formatına çevir
      const parts = birthDate.split('.')
      if (parts.length !== 3) {
        setError("Geçersiz tarih formatı. GG.AA.YYYY formatında girin.")
        setLoading(false)
        return
      }
      
      const [day, month, year] = parts
      const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      const dateObj = new Date(isoDate)
      
      if (isNaN(dateObj.getTime())) {
        setError("Geçersiz tarih. Lütfen geçerli bir tarih girin.")
        setLoading(false)
        return
      }

      const response = await fetch("/api/user/update-zodiac", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthDate: dateObj.toISOString() }),
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
                    {userZodiac.traits.positive.map((trait: string) => (
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
                    variant="default"
                    className="w-full"
                    onClick={() => router.push('/natal-chart')}
                  >
                    <Sparkles className="mr-2 size-4" />
                    Doğum Haritamı Gör
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      if (session.user.birthDate) {
                        // DD.MM.YYYY formatında göster
                        const date = new Date(session.user.birthDate)
                        const day = String(date.getDate()).padStart(2, '0')
                        const month = String(date.getMonth() + 1).padStart(2, '0')
                        const year = date.getFullYear()
                        setBirthDate(`${day}.${month}.${year}`)
                      } else {
                        setBirthDate("")
                      }
                    }}
                  >
                    <Calendar className="mr-2 size-4" />
                    Doğum Tarihini Güncelle
                  </Button>

                  {birthDate !== null && birthDate !== undefined && (
                    <form onSubmit={handleUpdateZodiac} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="birthDate" className="text-sm font-medium">
                          Yeni Doğum Tarihi
                        </label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={birthDate ? (() => {
                            const parts = birthDate.split('.')
                            if (parts.length === 3) {
                              const [day, month, year] = parts
                              return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
                            }
                            return birthDate
                          })() : ''}
                          onChange={(e) => {
                            // YYYY-MM-DD -> DD.MM.YYYY
                            const isoDate = e.target.value
                            if (isoDate) {
                              const [year, month, day] = isoDate.split('-')
                              setBirthDate(`${day}.${month}.${year}`)
                            } else {
                              setBirthDate('')
                            }
                          }}
                          max={new Date().toISOString().split('T')[0]}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Doğum tarihinizi seçin
                        </p>
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
        {/* E-posta Bildirimleri */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="size-5" />
              <CardTitle>E-posta Bildirimleri</CardTitle>
            </div>
            <CardDescription>
              Günlük, haftalık veya aylık burç yorumlarınızı e-posta ile alın
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Ana Toggle */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="email-notifications" className="text-base font-medium">
                    E-posta Bildirimleri
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Burç yorumlarınızı e-posta ile alın
                  </p>
                </div>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
                disabled={notificationLoading}
              />
            </div>

            {/* Bildirim Sıklığı */}
            {emailNotifications && (
              <div className="space-y-4 rounded-lg border p-4">
                <h4 className="text-sm font-semibold">Bildirim Sıklığı</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="daily"
                      checked={notificationPreferences.daily}
                      onCheckedChange={(checked) =>
                        setNotificationPreferences(prev => ({ ...prev, daily: checked as boolean }))
                      }
                      disabled={notificationLoading}
                    />
                    <Label htmlFor="daily" className="text-sm font-normal cursor-pointer">
                      <span className="font-medium">Günlük</span> - Her gün sabah burç yorumunuzu alın
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="weekly"
                      checked={notificationPreferences.weekly}
                      onCheckedChange={(checked) =>
                        setNotificationPreferences(prev => ({ ...prev, weekly: checked as boolean }))
                      }
                      disabled={notificationLoading}
                    />
                    <Label htmlFor="weekly" className="text-sm font-normal cursor-pointer">
                      <span className="font-medium">Haftalık</span> - Her hafta başı haftalık yorumunuzu alın
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="monthly"
                      checked={notificationPreferences.monthly}
                      onCheckedChange={(checked) =>
                        setNotificationPreferences(prev => ({ ...prev, monthly: checked as boolean }))
                      }
                      disabled={notificationLoading}
                    />
                    <Label htmlFor="monthly" className="text-sm font-normal cursor-pointer">
                      <span className="font-medium">Aylık</span> - Her ay başı aylık yorumunuzu alın
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Hata ve Başarı Mesajları */}
            {notificationError && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {notificationError}
              </div>
            )}
            {notificationSuccess && (
              <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
                ✓ Bildirim tercihleri başarıyla güncellendi
              </div>
            )}

            {/* Kaydet Butonu */}
            <Button
              onClick={async () => {
                setNotificationError("")
                setNotificationSuccess(false)
                setNotificationLoading(true)

                try {
                  const response = await fetch('/api/user/notification-settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      emailNotifications,
                      preferences: notificationPreferences,
                    }),
                  })

                  const data = await response.json()

                  if (response.ok) {
                    setNotificationSuccess(true)
                    setTimeout(() => setNotificationSuccess(false), 3000)
                  } else {
                    setNotificationError(data.error || 'Bir hata oluştu')
                  }
                } catch {
                  setNotificationError('Bağlantı hatası')
                } finally {
                  setNotificationLoading(false)
                }
              }}
              disabled={notificationLoading}
              className="w-full"
            >
              {notificationLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 size-4" />
                  Bildirim Tercihlerini Kaydet
                </>
              )}
            </Button>

            {/* Bilgi Notu */}
            <div className="rounded-lg bg-muted p-4">
              <p className="text-xs text-muted-foreground">
                💡 <strong>Not:</strong> E-posta bildirimleri şu anda geliştirme aşamasındadır. 
                Bildirimleri etkinleştirdiğinizde, tercihleriniz kaydedilecek ve sistem hazır olduğunda 
                otomatik olarak e-posta almaya başlayacaksınız.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
