import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { JournalCard } from "@/components/journal/journal-card"
import { Plus, BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "Günlüğüm | Az-Horoscope",
  description: "Kişisel günlüğünüz ve ruh hali takibi",
}

export default async function JournalPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  // Son 20 günlük getir
  const entries = await db.journalEntry.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      date: "desc",
    },
    take: 20,
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Günlüğüm
          </h1>
          <p className="text-muted-foreground mt-2">
            Günlük notlarınız, ruh haliniz ve gezegen enerjileri
          </p>
        </div>
        <Button asChild>
          <Link href="/journal/new">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Günlük
          </Link>
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Henüz günlük yazmadınız</h2>
          <p className="text-muted-foreground mb-6">
            İlk günlüğünüzü yazarak başlayın ve ruh halinizi takip edin
          </p>
          <Button asChild size="lg">
            <Link href="/journal/new">
              <Plus className="mr-2 h-5 w-5" />
              İlk Günlüğümü Yaz
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {entries.map((entry) => (
              <JournalCard
                key={entry.id}
                entry={{
                  ...entry,
                  date: entry.date,
                }}
              />
            ))}
          </div>

          {entries.length >= 20 && (
            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground">
                Son 20 günlük gösteriliyor
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
