"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles } from "lucide-react"

interface AnalysisPanelProps {
  entryId: string
  hasTransits?: boolean
}

interface AnalysisResult {
  emotionalTone: string
  keywords: string[]
  transitInsights: string
  suggestions: string[]
}

export function AnalysisPanel({ entryId, hasTransits = false }: AnalysisPanelProps) {
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState("")

  const handleAnalyze = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/journal/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entryId,
          analyzeTransits: hasTransits,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Analiz yapılamadı")
      }

      setAnalysis(data.analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Analizi
          </CardTitle>
          {!analysis && (
            <Button
              onClick={handleAnalyze}
              disabled={loading}
              size="sm"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analiz Et
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {!analysis && !loading && (
          <p className="text-sm text-muted-foreground">
            Günlüğünüzü AI ile analiz ederek duygusal tonunuzu, anahtar kelimeleri ve
            gezegen pozisyonlarının olası etkilerini keşfedin.
          </p>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {analysis && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Duygusal Ton</h4>
              <Badge
                variant={
                  analysis.emotionalTone === "Pozitif"
                    ? "default"
                    : analysis.emotionalTone === "Negatif"
                    ? "destructive"
                    : "secondary"
                }
              >
                {analysis.emotionalTone}
              </Badge>
            </div>

            {analysis.keywords.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Anahtar Kelimeler</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {hasTransits && analysis.transitInsights && (
              <div>
                <h4 className="font-medium mb-2">Transit İçgörüleri</h4>
                <p className="text-sm text-muted-foreground">
                  {analysis.transitInsights}
                </p>
              </div>
            )}

            {analysis.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Öneriler</h4>
                <ul className="space-y-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              Yeniden Analiz Et
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
