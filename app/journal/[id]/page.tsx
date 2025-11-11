import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TransitDisplay } from "@/components/journal/transit-display"
import { AnalysisPanel } from "@/components/journal/analysis-panel"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { DeleteJournalButton } from "./delete-button"

export const metadata: Metadata = {
  title: "Günlük Detayı | Az-Horoscope",
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

export default async function JournalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const { id } = await params
  const entry = await db.journalEntry.findUnique({
    where: {
      id,
    },
  })

  if (!entry) {
    notFound()
  }

  if (entry.userId !== session.user.id) {
    redirect("/journal")
  }

  const moodInfo = getMoodInfo(entry.mood)
  const dateStr = entry.date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const timeStr = entry.date.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/journal">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Günlüklerime Dön
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        {/* Ana Günlük Kartı */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-4xl ${moodInfo.color}`}>{moodInfo.emoji}</span>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {dateStr} • {timeStr}
                    </div>
                    {entry.title && (
                      <h1 className="text-2xl font-bold mt-1">{entry.title}</h1>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={`${moodInfo.color} text-base`}>
                  {entry.mood}/10
                </Badge>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/journal/${entry.id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <DeleteJournalButton entryId={entry.id} />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="text-base whitespace-pre-wrap leading-relaxed">
                {entry.content}
              </p>
            </div>

            {entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                {entry.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transit Bilgileri */}
        <TransitDisplay transits={entry.transits} />

        {/* AI Analizi */}
        <AnalysisPanel entryId={entry.id} hasTransits={!!entry.transits} />
      </div>
    </div>
  )
}
