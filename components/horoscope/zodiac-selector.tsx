"use client"

import { zodiacSigns, ZodiacSign } from "@/lib/zodiac"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ZodiacSelectorProps {
  selectedSign?: ZodiacSign
  onSelectSign: (sign: ZodiacSign) => void
}

export function ZodiacSelector({ selectedSign, onSelectSign }: ZodiacSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {Object.values(zodiacSigns).map((zodiac) => (
        <Card
          key={zodiac.sign}
          className={cn(
            "cursor-pointer transition-all hover:scale-105 hover:shadow-lg",
            selectedSign === zodiac.sign && "ring-2 ring-primary shadow-lg"
          )}
          onClick={() => onSelectSign(zodiac.sign)}
          style={{
            borderColor: selectedSign === zodiac.sign ? zodiac.color : undefined,
          }}
        >
          <CardContent className="flex flex-col items-center justify-center p-4 gap-2">
            <div 
              className="text-4xl font-bold"
              style={{ color: zodiac.color }}
            >
              {zodiac.symbol}
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">{zodiac.nameTr}</p>
              <p className="text-xs text-muted-foreground">{zodiac.dateRangeTr.split(' - ')[0]}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
