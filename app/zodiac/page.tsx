import Link from "next/link"
import { zodiacSigns } from "@/lib/zodiac"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export default function ZodiacListPage() {
  return (
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Burçlar</h1>
        <p className="mt-2 text-muted-foreground">
          Tüm burçlar hakkında detaylı bilgi edinin
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(zodiacSigns).map(([key, zodiac]) => (
          <Link key={key} href={`/zodiac/${key}`}>
            <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
              <CardHeader>
                <div className="mb-2 text-center text-5xl" style={{ color: zodiac.color }}>
                  {zodiac.symbol}
                </div>
                <CardTitle className="text-center">{zodiac.nameTr}</CardTitle>
                <CardDescription className="text-center">
                  {zodiac.dateRangeTr}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Element:</span>
                    <span className="font-medium" style={{ color: zodiac.color }}>
                      {zodiac.elementTr}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Gezegen:</span>
                    <span className="font-medium">{zodiac.planetTr}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-1 text-xs text-primary">
                  <Sparkles className="size-3" />
                  <span>Detayları Gör</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
