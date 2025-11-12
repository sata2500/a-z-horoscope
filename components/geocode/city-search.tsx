"use client"

/**
 * City Search Component
 * 
 * Global şehir arama ve otomatik koordinat doldurma
 * 
 * @author Manus AI
 * @date 12 Kasım 2025
 */

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, MapPin, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface LocationResult {
  id: number
  name: string
  displayName: string
  latitude: number
  longitude: number
  type: string
  country?: string
  countryCode?: string
}

interface CitySearchProps {
  onLocationSelect: (location: {
    name: string
    latitude: number
    longitude: number
  }) => void
  defaultValue?: string
}

export function CitySearch({ onLocationSelect, defaultValue = "" }: CitySearchProps) {
  const [query, setQuery] = useState(defaultValue)
  const [results, setResults] = useState<LocationResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setShowResults(false)
      return
    }

    const timeoutId = setTimeout(() => {
      searchCity(query)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [query])

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const searchCity = async (searchQuery: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Arama başarısız")
      }

      setResults(data.results || [])
      setShowResults(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelectLocation = (location: LocationResult) => {
    setQuery(location.displayName)
    setShowResults(false)
    onLocationSelect({
      name: location.displayName,
      latitude: location.latitude,
      longitude: location.longitude,
    })
  }

  return (
    <div ref={searchRef} className="relative space-y-2">
      <Label htmlFor="citySearch">
        <MapPin className="inline w-4 h-4 mr-2" />
        Doğum Yeri
      </Label>
      <div className="relative">
        <Input
          id="citySearch"
          type="text"
          placeholder="Şehir adı yazın (örn: İstanbul, London, Tokyo)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) {
              setShowResults(true)
            }
          }}
          className="pr-10"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {results.map((location) => (
            <button
              key={location.id}
              type="button"
              onClick={() => handleSelectLocation(location)}
              className={cn(
                "w-full px-4 py-3 text-left hover:bg-accent transition-colors",
                "flex items-start gap-3 border-b border-border last:border-0"
              )}
            >
              <MapPin className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {location.name}
                  {location.countryCode && (
                    <span className="ml-2 text-xs bg-secondary px-2 py-0.5 rounded">
                      {location.countryCode}
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {location.displayName}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && results.length === 0 && !loading && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg p-4">
          <p className="text-sm text-muted-foreground text-center">
            Sonuç bulunamadı. Farklı bir şehir adı deneyin.
          </p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Şehir adını yazmaya başlayın, otomatik olarak koordinatlar bulunacak
      </p>
    </div>
  )
}
