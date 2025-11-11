"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

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
  dailyReadingsLast7Days: Array<{ date: string; count: number }>
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0', '#a4de6c', '#ffa07a']

export default function AdminStatsPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Detaylı İstatistikler</h1>
        <p className="text-muted-foreground">
          Sistem performansı ve kullanım analizleri
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Bu Hafta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.overview.thisWeekReadings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Haftalık yorum sayısı
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Bu Ay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.overview.thisMonthReadings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Aylık yorum sayısı
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Ortalama</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.overview.totalUsers > 0
                ? (stats.overview.totalReadings / stats.overview.totalUsers).toFixed(1)
                : '0'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Kullanıcı başına yorum
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Günlük Aktivite */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Günlük Aktivite Trendi</CardTitle>
            <CardDescription>
              Son 7 günün yorum aktivitesi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={stats.dailyReadingsLast7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="Yorum Sayısı" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Burç Dağılımı - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Burç Dağılımı</CardTitle>
            <CardDescription>
              Kullanıcıların burç dağılımı (bar chart)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart 
                data={stats.zodiacDistribution
                  .map(item => ({
                    name: zodiacNames[item.zodiacSign] || item.zodiacSign,
                    count: item.count,
                  }))
                  .sort((a, b) => b.count - a.count)
                }
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Kullanıcı Sayısı" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Burç Dağılımı - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Burç Dağılımı (Pasta)</CardTitle>
            <CardDescription>
              Yüzdelik dağılım
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
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
                  outerRadius={100}
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
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Yorum Tipi Analizi</CardTitle>
            <CardDescription>
              Hangi yorum türleri daha popüler?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={stats.readingTypeDistribution
                  .map(item => ({
                    name: readingTypeNames[item.type] || item.type,
                    count: item.count,
                  }))
                  .sort((a, b) => b.count - a.count)
                }
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Yorum Sayısı" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
