"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface MoodSelectorProps {
  value: number
  onChange: (mood: number) => void
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

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  const currentMood = getMoodInfo(value)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="mood">Ruh Halim</Label>
        <div className="flex items-center gap-2">
          <span className={`text-3xl ${currentMood.color}`}>{currentMood.emoji}</span>
          <span className={`font-medium ${currentMood.color}`}>
            {value}/10 - {currentMood.label}
          </span>
        </div>
      </div>
      
      <Slider
        id="mood"
        min={1}
        max={10}
        step={1}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        className="w-full"
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>😢 Çok Kötü</span>
        <span>😐 Orta</span>
        <span>😄 Harika</span>
      </div>
    </div>
  )
}
