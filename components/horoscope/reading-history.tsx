"use client"

import { useState, useEffect, useCallback } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { zodiacSigns } from "@/lib/zodiac"
import { Loader2, Calendar, ChevronLeft, ChevronRight, Filter, Heart, Share2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Reading {
  id: string
  zodiacSign: string
  readingType: string
  content: string
  date: string
  createdAt: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

export function ReadingHistory() {
  const [readings, setReadings] = useState<Reading[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [zodiacFilter, setZodiacFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [togglingFavorite, setTogglingFavorite] = useState<string | null>(null)

  const fetchReadings = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      })

      // "all" değerini API'ye gönderme, sadece spesifik filtreleri gönder
      if (zodiacFilter && zodiacFilter !== "all") {
        params.append("zodiacSign", zodiacFilter)
      }

      if (typeFilter && typeFilter !== "all") {
        params.append("readingType", typeFilter)
      }

      const response = await fetch(`/api/horoscope/history?${params}`)
      const data = await response.json()

      if (response.ok) {
        setReadings(data.data)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Failed to fetch readings:", error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, zodiacFilter, typeFilter])

  const fetchFavorites = useCallback(async () => {
    try {
      const response = await fetch("/api/favorites")
      const data = await response.json()
      
      if (response.ok) {
        const favoriteIds = new Set<string>(data.data.map((item: { id: string }) => item.id))
        setFavorites(favoriteIds)
      }
    } catch (error) {
      console.error("Failed to fetch favorites:", error)
    }
  }, [])

  useEffect(() => {
    fetchReadings()
    fetchFavorites()
  }, [fetchReadings, fetchFavorites])

  const toggleFavorite = async (readingId: string) => {
    setTogglingFavorite(readingId)
    try {
      const response = await fetch("/api/favorites/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readingId }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.isFavorite) {
          setFavorites(prev => new Set([...prev, readingId]))
        } else {
          setFavorites(prev => {
            const newSet = new Set(prev)
            newSet.delete(readingId)
            return newSet
          })
        }
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
    } finally {
      setTogglingFavorite(null)
    }
  }

  const shareReading = async (reading: { zodiacSign: string; readingType: string; content: string }) => {
    const shareText = `${zodiacSigns[reading.zodiacSign as keyof typeof zodiacSigns].nameTr} - ${getReadingTypeLabel(reading.readingType)}\n\n${reading.content.substring(0, 200)}...`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Burç Yorumu",
          text: shareText,
          url: window.location.origin,
        })
      } catch {
        console.log("Share cancelled")
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(shareText)
      alert("Yorum panoya kopyalandı!")
    }
  }

  const getReadingTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      daily: "Günlük",
      weekly: "Haftalık",
      monthly: "Aylık",
      compatibility: "Uyumluluk",
    }
    return labels[type] || type
  }

  if (loading && readings.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="size-5" />
            Filtrele
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Burç</label>
              <Select value={zodiacFilter} onValueChange={setZodiacFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tüm burçlar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm burçlar</SelectItem>
                  {Object.values(zodiacSigns).map((sign) => (
                    <SelectItem key={sign.sign} value={sign.sign}>
                      {sign.symbol} {sign.nameTr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Yorum Tipi</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tüm tipler" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm tipler</SelectItem>
                  <SelectItem value="daily">Günlük</SelectItem>
                  <SelectItem value="weekly">Haftalık</SelectItem>
                  <SelectItem value="monthly">Aylık</SelectItem>
                  <SelectItem value="compatibility">Uyumluluk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Readings List */}
      {readings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Henüz burç yorumu almadınız. Horoscope sayfasından yorum alabilirsiniz.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {readings.map((reading) => {
            const zodiac = zodiacSigns[reading.zodiacSign as keyof typeof zodiacSigns]
            return (
              <Card key={reading.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl" style={{ color: zodiac?.color }}>
                        {zodiac?.symbol}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {zodiac?.nameTr} - {getReadingTypeLabel(reading.readingType)}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="size-3" />
                          {new Date(reading.createdAt).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(reading.id)}
                        disabled={togglingFavorite === reading.id}
                        className="h-8 w-8"
                      >
                        <Heart
                          className={`size-4 ${
                            favorites.has(reading.id)
                              ? "fill-red-500 text-red-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => shareReading(reading)}
                        className="h-8 w-8"
                      >
                        <Share2 className="size-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="text-foreground">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className="text-foreground mb-4">{children}</p>,
                          strong: ({ children }) => <strong className="text-foreground font-bold">{children}</strong>,
                          em: ({ children }) => <em className="text-foreground italic">{children}</em>,
                          h1: ({ children }) => <h1 className="text-foreground text-2xl font-bold mb-4">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-foreground text-xl font-bold mb-3">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-foreground text-lg font-bold mb-2">{children}</h3>,
                          ul: ({ children }) => <ul className="text-foreground list-disc list-inside mb-4">{children}</ul>,
                          ol: ({ children }) => <ol className="text-foreground list-decimal list-inside mb-4">{children}</ol>,
                          li: ({ children }) => <li className="text-foreground mb-1">{children}</li>,
                        }}
                      >
                        {reading.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Toplam {pagination.total} yorum - Sayfa {pagination.page} / {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft className="size-4" />
              Önceki
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={!pagination.hasMore || loading}
            >
              Sonraki
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
