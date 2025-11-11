"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MoodSelector } from "./mood-selector"
import { TagInput } from "./tag-input"
import { Loader2 } from "lucide-react"

interface JournalFormData {
  title?: string
  content: string
  mood: number
  tags: string[]
  date?: Date
}

interface JournalFormProps {
  initialData?: JournalFormData
  entryId?: string
  onSubmit?: (data: JournalFormData) => void
  loading?: boolean
}

export function JournalForm({ initialData, entryId, onSubmit, loading: externalLoading }: JournalFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState<JournalFormData>({
    title: initialData?.title || "",
    content: initialData?.content || "",
    mood: initialData?.mood || 5,
    tags: initialData?.tags || [],
    date: initialData?.date,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.content.trim()) {
      setError("İçerik boş olamaz")
      return
    }

    if (onSubmit) {
      onSubmit(formData)
      return
    }

    setLoading(true)

    try {
      const url = entryId ? `/api/journal/${entryId}` : "/api/journal"
      const method = entryId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Bir hata oluştu")
      }

      router.push("/journal")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const isLoading = loading || externalLoading

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Başlık (Opsiyonel)</Label>
        <Input
          id="title"
          type="text"
          placeholder="Bugün nasıl bir gündü?"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">İçerik *</Label>
        <Textarea
          id="content"
          placeholder="Bugün neler yaşadın? Ne hissettin?"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          disabled={isLoading}
          rows={10}
          className="resize-none"
        />
      </div>

      <MoodSelector
        value={formData.mood}
        onChange={(mood) => setFormData({ ...formData, mood })}
      />

      <TagInput
        tags={formData.tags}
        onChange={(tags) => setFormData({ ...formData, tags })}
      />

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {entryId ? "Güncelle" : "Kaydet"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          İptal
        </Button>
      </div>
    </form>
  )
}
