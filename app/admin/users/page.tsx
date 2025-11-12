"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react"

interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
  zodiacSign: string | null
  role: string
  emailNotifications: boolean
  createdAt: string
  _count: {
    horoscopeReadings: number
    favoriteReadings: number
  }
}

interface UsersResponse {
  success: boolean
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function AdminUsersPage() {
  const [data, setData] = useState<UsersResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

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

  useEffect(() => {
    const controller = new AbortController()
    
    async function loadUsers() {
      setLoading(true)
      setError(null)
      
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '10',
          ...(search && { search }),
        })

        const res = await fetch(`/api/admin/users?${params}`, {
          signal: controller.signal
        })
        const data = await res.json()
        
        if (data.success) {
          setData(data)
        } else {
          setError(data.error || 'Bir hata oluştu')
        }
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError('Bağlantı hatası')
        }
      } finally {
        setLoading(false)
      }
    }
    
    loadUsers()
    
    return () => controller.abort()
  }, [page, search])

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1) // Reset to first page on search
  }

  if (loading && !data) {
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

  if (!data) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kullanıcı Yönetimi</h1>
        <p className="text-muted-foreground">
          Tüm kayıtlı kullanıcıları görüntüleyin ve yönetin
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Kullanıcı ara (isim veya e-posta)..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Toplam {data.pagination.total} kullanıcı
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Kullanıcı Listesi</CardTitle>
          <CardDescription>
            Sayfa {data.pagination.page} / {data.pagination.totalPages}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <Avatar className="size-12">
                    <AvatarImage src={user.image || ""} alt={user.name || ""} />
                    <AvatarFallback>
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{user.name || 'İsimsiz'}</p>
                      {user.role === 'ADMIN' && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 text-sm">
                  <div className="text-center">
                    <p className="font-medium">{user.zodiacSign ? zodiacNames[user.zodiacSign] : '-'}</p>
                    <p className="text-xs text-muted-foreground">Burç</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="font-medium">{user._count.horoscopeReadings}</p>
                    <p className="text-xs text-muted-foreground">Yorum</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="font-medium">{user._count.favoriteReadings}</p>
                    <p className="text-xs text-muted-foreground">Favori</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="font-medium">
                      {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                    <p className="text-xs text-muted-foreground">Kayıt</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              >
                <ChevronLeft className="size-4 mr-1" />
                Önceki
              </Button>
              
              <div className="text-sm text-muted-foreground">
                Sayfa {page} / {data.pagination.totalPages}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page === data.pagination.totalPages || loading}
              >
                Sonraki
                <ChevronRight className="size-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
