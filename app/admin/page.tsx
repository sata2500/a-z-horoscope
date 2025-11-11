"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Heart, TrendingUp, Loader2 } from "lucide-react"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface AdminStats {
  overview: {
    totalUsers: number
    totalReadings: number
    todayReadings: number
    thisWeekReadings: number
    thisMonthReadings: number
    totalFavorites: number
  }
  zodiacDistribution: Array<{ zodiacSign: string; count: number }>
  readingTypeDistribution: Array<{ type: string; count: number }>
  recentUsers: Array<{
    id: string
    name: string | null
    email: string | null
    zodiacSign: string | null
    createdAt: string
  }>
  dailyReadingsLast7Days: Array<{ date: string; count: number }>
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0', '#a4de6c', '#ffa07a']

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.stats)
        } else {
          setError(data.error || 'Bir hata oluştu')
        }
      })
      .catch(() => setError('Bağlantı hatası'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-destructive">{error}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Lütfen admin yetkilerinizi kontrol edin
          </p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const zodiacNames: Record<string, string> = {
    aries: 'Koç',
    taurus: 'Boğa',
    gemini: 'İkizler',
    cancer: 'Yengeç',
    leo: 'Aslan',
    virgo: 'Başak',
    libra: 'Terazi',
    scorpio: 'Akrep',
    sagittarius: 'Yay',
    capricorn: 'Oğlak',
    aquarius: 'Kova',
    pisces: 'Balık',
  }

  const readingTypeNames: Record<string, string> = {
    daily: 'Günlük',
    weekly: 'Haftalık',
    monthly: 'Aylık',
    compatibility: 'Uyumluluk',
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Sistem istatistikleri ve genel bakış
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Kayıtlı kullanıcı sayısı
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Yorum</CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalReadings}</div>
            <p className="text-xs text-muted-foreground">
              Oluşturulan burç yorumu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bugün</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.todayReadings}</div>
            <p className="text-xs text-muted-foreground">
              Bugünkü yorum sayısı
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favoriler</CardTitle>
            <Heart className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalFavorites}</div>
            <p className="text-xs text-muted-foreground">
              Favorilere eklenen yorum
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Günlük Yorumlar - Son 7 Gün */}
        <Card>
          <CardHeader>
            <CardTitle>Günlük Yorumlar (Son 7 Gün)</CardTitle>
            <CardDescription>
              Her güne ait oluşturulan yorum sayısı
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.dailyReadingsLast7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" name="Yorum Sayısı" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Burç Dağılımı */}
        <Card>
          <CardHeader>
            <CardTitle>Burç Dağılımı</CardTitle>
            <CardDescription>
              Kullanıcıların burç dağılımı
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.zodiacDistribution.map(item => ({
                    name: zodiacNames[item.zodiacSign] || item.zodiacSign,
                    value: item.count,
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.zodiacDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Yorum Tipi Dağılımı */}
        <Card>
          <CardHeader>
            <CardTitle>Yorum Tipi Dağılımı</CardTitle>
            <CardDescription>
              Yorum türlerine göre dağılım
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.readingTypeDistribution.map(item => ({
                name: readingTypeNames[item.type] || item.type,
                count: item.count,
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Yorum Sayısı" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Son Kullanıcılar */}
        <Card>
          <CardHeader>
            <CardTitle>Son Kayıt Olan Kullanıcılar</CardTitle>
            <CardDescription>
              En son kayıt olan 10 kullanıcı
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.name || 'İsimsiz'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="text-right">
                    {user.zodiacSign && (
                      <p className="text-xs font-medium">{zodiacNames[user.zodiacSign]}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
