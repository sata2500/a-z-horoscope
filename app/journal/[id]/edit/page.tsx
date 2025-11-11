import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { JournalForm } from "@/components/journal/journal-form"
import { BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "Günlüğü Düzenle | Az-Horoscope",
}

export default async function EditJournalPage({
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BookOpen className="h-8 w-8" />
          Günlüğü Düzenle
        </h1>
        <p className="text-muted-foreground mt-2">
          Günlük girişinizi güncelleyin
        </p>
      </div>

      <JournalForm
        entryId={entry.id}
        initialData={{
          title: entry.title || undefined,
          content: entry.content,
          mood: entry.mood,
          tags: entry.tags,
          date: entry.date,
        }}
      />
    </div>
  )
}
