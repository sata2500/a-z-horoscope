"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"

interface JournalEntry {
  id: string
  date: Date
  title?: string | null
  content: string
  mood: number
  tags: string[]
}

interface JournalCardProps {
  entry: JournalEntry
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
}

const moodEmojis = [
  { range: [1, 2], emoji: "😢", label: "Çok Kötü", color: "text-red-500" },
  { range: [3, 4], emoji: "😟", label: "Kötü", color: "text-orange-500" },
  { range: [5, 6], emoji: "😐", label: "Orta", color: "text-yellow-500" },
  { range: [7, 8], emoji: "🙂", label: "İyi", color: "text-green-400" },
  { range: [9, 10], emoji: "😄", label: "Harika", color: "text-green-600" },
]

function getMoodInfo(mood: number) {
  return moodEmojis.find(m => mood >= m.range[0] && mood <= m.range[1]) || moodEmojis[2]
}

export function JournalCard({ entry, onDelete, onEdit }: JournalCardProps) {
  const moodInfo = getMoodInfo(entry.mood)
  const date = new Date(entry.date)
  const dateStr = date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const timeStr = date.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const contentPreview = entry.content.length > 150
    ? entry.content.substring(0, 150) + "..."
    : entry.content

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-2xl ${moodInfo.color}`}>{moodInfo.emoji}</span>
              <span className="text-sm text-muted-foreground">
                {dateStr} • {timeStr}
              </span>
            </div>
            {entry.title && (
              <h3 className="font-semibold text-lg">{entry.title}</h3>
            )}
          </div>
          <Badge variant="secondary" className={moodInfo.color}>
            {entry.mood}/10
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {contentPreview}
        </p>

        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {entry.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t flex gap-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="flex-1"
        >
          <Link href={`/journal/${entry.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Detay
          </Link>
        </Button>
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(entry.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(entry.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
