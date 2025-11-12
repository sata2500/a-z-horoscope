import { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { JournalForm } from "@/components/journal/journal-form"
import { BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "Yeni Günlük | AZ-Horoscope",
  description: "Yeni günlük girişi oluştur",
}

export default async function NewJournalPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BookOpen className="h-8 w-8" />
          Yeni Günlük
        </h1>
        <p className="text-muted-foreground mt-2">
          Bugün neler yaşadın? Ruh halini kaydet ve gezegen enerjilerini keşfet
        </p>
      </div>

      <JournalForm />
    </div>
  )
}
