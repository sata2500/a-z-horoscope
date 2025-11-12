import { GoogleGenerativeAI } from "@google/generative-ai"
import type { TransitData } from '@/types'
import { calculateTransits, PlanetPosition } from "./swisseph"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "")

/**
 * Transit verilerini okunabilir formata çevir
 */
function formatTransitsForAI(transits: PlanetPosition[], includeAll: boolean = false): string {
  // Klasik 7 gezegen veya tüm gezegenler
  const planetIds = includeAll 
    ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15] // Tüm gezegenler + Kuzey Düğüm + Chiron
    : [0, 1, 2, 3, 4, 5, 6] // Klasik 7 gezegen
    
  const selectedPlanets = transits.filter(p => planetIds.includes(p.planetId))
  
  return selectedPlanets.map(p => {
    const retroText = p.retrograde ? ' ⟲ (Retrograde - Geri gidiş)' : ''
    return `${p.planetName}: ${p.zodiacSign} ${Math.floor(p.zodiacDegree)}°${retroText}`
  }).join('\n')
}

/**
 * Ay evresini hesapla
 */
function calculateMoonPhase(transits: PlanetPosition[]): string {
  const sun = transits.find(p => p.planetId === 0)
  const moon = transits.find(p => p.planetId === 1)
  
  if (!sun || !moon) return 'Bilinmiyor'
  
  // Ay ve Güneş arasındaki açı farkı
  let diff = moon.longitude - sun.longitude
  if (diff < 0) diff += 360
  
  if (diff < 45 || diff >= 315) return 'Yeni Ay 🌑 (Yeni başlangıçlar, niyetler)'
  if (diff >= 45 && diff < 135) return 'İlk Dördün 🌓 (Eylem, ilerleme)'
  if (diff >= 135 && diff < 225) return 'Dolunay 🌕 (Zirve, tamamlanma, duygusal yoğunluk)'
  return 'Son Dördün 🌗 (Bırakma, temizlenme, yansıtma)'
}

/**
 * Önemli aspect'leri hesapla ve formatla
 */
function calculateImportantAspects(transits: PlanetPosition[]): string {
  const aspects: string[] = []
  const majorPlanets = transits.filter(p => [0, 1, 2, 3, 4, 5, 6].includes(p.planetId))
  
  // Her gezegen çifti için aspect kontrolü
  for (let i = 0; i < majorPlanets.length; i++) {
    for (let j = i + 1; j < majorPlanets.length; j++) {
      const p1 = majorPlanets[i]
      const p2 = majorPlanets[j]
      
      let diff = Math.abs(p1.longitude - p2.longitude)
      if (diff > 180) diff = 360 - diff
      
      // Önemli aspect'leri kontrol et (orb: ±8°)
      if (Math.abs(diff - 0) <= 8) {
        aspects.push(`${p1.planetName} ☌ ${p2.planetName} (Kavuşum - Güçlü birleşme)`)
      } else if (Math.abs(diff - 180) <= 8) {
        aspects.push(`${p1.planetName} ☍ ${p2.planetName} (Karşıt - Gerilim, denge)`)
      } else if (Math.abs(diff - 120) <= 8) {
        aspects.push(`${p1.planetName} △ ${p2.planetName} (Üçgen - Uyum, akış)`)
      } else if (Math.abs(diff - 90) <= 8) {
        aspects.push(`${p1.planetName} □ ${p2.planetName} (Kare - Zorluk, eylem)`)
      } else if (Math.abs(diff - 60) <= 6) {
        aspects.push(`${p1.planetName} ⚹ ${p2.planetName} (Altıgen - Fırsat, destek)`)
      }
    }
  }
  
  return aspects.length > 0 
    ? aspects.slice(0, 5).join('\n') // En fazla 5 aspect
    : 'Bugün önemli bir aspect yok'
}

export async function generateDailyHoroscope(
  zodiacSign: string,
  zodiacInfo: { nameTr: string; elementTr: string; planetTr: string }
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

  // Bugünkü gerçek gezegen pozisyonlarını al
  const todayTransits = calculateTransits(new Date())
  const transitsText = formatTransitsForAI(todayTransits, true) // Tüm gezegenler
  const moonPhase = calculateMoonPhase(todayTransits)
  const aspects = calculateImportantAspects(todayTransits)
  const today = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })

  const prompt = `Sen profesyonel bir astrolog ve burç yorumcususun. ${zodiacInfo.nameTr} burcu için ${today} tarihine özel, gerçek astronomik verilere dayanan profesyonel bir günlük burç yorumu yaz.

**BURÇ BİLGİLERİ:**
- Burç: ${zodiacInfo.nameTr}
- Element: ${zodiacInfo.elementTr}
- Yönetici Gezegen: ${zodiacInfo.planetTr}

**BUGÜNKÜ GERÇEK GEZEGEN POZİSYONLARI (Swiss Ephemeris - NASA JPL Verileri):**
${transitsText}

**AY EVRESİ:**
${moonPhase}

**BUGÜNKÜ ÖNEMLİ ASPECT'LER:**
${aspects}

**ÖNEMLİ TALİMATLAR:**
1. Yukarıdaki GERÇEK astronomik verileri kullanarak yorumunu oluştur
2. Gezegenlerin bulunduğu burçları ve aspect'leri MUTLAKA yoruma dahil et
3. Retrograde gezegenleri özellikle vurgula (geri gidiş etkisi)
4. Ay evresinin ${zodiacInfo.nameTr} burcu üzerindeki etkisini açıkla
5. Aspect'lerin yarattığı enerjiyi somut örneklerle anlat

**YORUM İÇERİĞİ:**
1. **Genel Enerji:** Bugünkü gezegen pozisyonları ve aspect'lerin yarattığı genel hava
2. **Aşk ve İlişkiler:** Venüs ve Ay pozisyonlarına göre ilişki enerjisi
3. **Kariyer ve Finans:** Mars, Jüpiter ve Satürn etkisiyle iş hayatı
4. **Sağlık ve Enerji:** Fiziksel ve zihinsel enerji durumu
5. **Günün Tavsiyesi:** Gezegen enerjilerine uygun pratik öneriler

**YAZIM TARZI:**
- Türkçe, samimi ve sıcak bir dil kullan
- Astrolojik terimleri açıklayıcı şekilde kullan
- Pozitif ama gerçekçi ol
- 250-300 kelime arası yaz
- Başlık ekleme, doğrudan yoruma başla

Yorumu şimdi yaz:`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response
    return response.text()
  } catch (error) {
    console.error("Gemini API Error:", error)
    throw new Error("Burç yorumu oluşturulamadı")
  }
}

export async function generateCompatibilityAnalysis(
  sign1: string,
  sign2: string,
  info1: { nameTr: string; elementTr: string },
  info2: { nameTr: string; elementTr: string }
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

  const prompt = `Sen profesyonel bir astrolog ve ilişki danışmanısın. ${info1.nameTr} ve ${info2.nameTr} burçları arasındaki uyumluluğu analiz et.

Burç 1: ${info1.nameTr} (${info1.elementTr})
Burç 2: ${info2.nameTr} (${info2.elementTr})

Analiz şu konuları içermeli:
1. Genel Uyumluluk (1-10 puan)
2. Güçlü Yönler
3. Zorluklar ve Dikkat Edilmesi Gerekenler
4. İlişki Tavsiyeleri
5. Uzun Vadeli Potansiyel

Analiz Türkçe olmalı, dengeli ve yapıcı bir dille yazılmalı. Hem olumlu hem de geliştirilmesi gereken yönleri içermeli. Yaklaşık 250-300 kelime olsun.`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response
    return response.text()
  } catch (error) {
    console.error("Gemini API Error:", error)
    throw new Error("Uyumluluk analizi oluşturulamadı")
  }
}


export async function generateWeeklyHoroscope(
  zodiacSign: string,
  zodiacInfo: { nameTr: string; elementTr: string; planetTr: string }
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

  // Bu haftanın başındaki gezegen pozisyonları
  const todayTransits = calculateTransits(new Date())
  const transitsText = formatTransitsForAI(todayTransits, true) // Tüm gezegenler
  const moonPhase = calculateMoonPhase(todayTransits)
  const aspects = calculateImportantAspects(todayTransits)
  
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay() + 1) // Pazartesi
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6) // Pazar
  
  const weekRange = `${weekStart.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} - ${weekEnd.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}`

  const prompt = `Sen profesyonel bir astrolog ve burç yorumcususun. ${zodiacInfo.nameTr} burcu için ${weekRange} haftasına özel, gerçek astronomik verilere dayanan profesyonel bir haftalık burç yorumu yaz.

**BURÇ BİLGİLERİ:**
- Burç: ${zodiacInfo.nameTr}
- Element: ${zodiacInfo.elementTr}
- Yönetici Gezegen: ${zodiacInfo.planetTr}

**BU HAFTANİN GERÇEK GEZEGEN POZİSYONLARI (Swiss Ephemeris - NASA JPL Verileri):**
${transitsText}

**AY EVRESİ:**
${moonPhase}

**BU HAFTANİN ÖNEMLİ ASPECT'LERİ:**
${aspects}

**ÖNEMLİ TALİMATLAR:**
1. Yukarıdaki GERÇEK astronomik verileri kullanarak haftalık yorumunu oluştur
2. Gezegenlerin hafta boyunca hareketlerini ve etkilerini anlat
3. Retrograde gezegenlerin haftalık etkisini vurgula
4. Ay evresinin hafta boyunca nasıl değişeceğini ve etkisini açıkla
5. Aspect'lerin haftanın hangi günlerinde daha etkili olacağını belirt

**YORUM İÇERİĞİ:**
1. **Haftanın Genel Enerjisi:** Gezegen pozisyonları ve aspect'lerin yarattığı haftalık tema
2. **Aşk ve İlişkiler:** Venüs ve Ay'ın haftalık etkisi, ilişkilerde beklentiler
3. **Kariyer ve Finans:** Mars, Jüpiter ve Satürn'le iş hayatı, fırsatlar ve dikkat edilmesi gerekenler
4. **Sağlık ve Enerji:** Fiziksel ve zihinsel enerji düzeyi, dinlenme ihtiyacı
5. **Haftanın Önemli Günleri:** Hangi günler daha verimli, hangi günler dikkatli olunmalı
6. **Haftanın Tavsiyesi:** Gezegen enerjilerine uygun haftalık strateji

**YAZIM TARZI:**
- Türkçe, samimi ve sıcak bir dil kullan
- Astrolojik terimleri açıklayıcı şekilde kullan
- Pozitif ama gerçekçi ol
- 350-400 kelime arası yaz
- Başlık ekleme, doğrudan yoruma başla

Yorumu şimdi yaz:`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response
    return response.text()
  } catch (error) {
    console.error("Gemini API Error:", error)
    throw new Error("Haftalık burç yorumu oluşturulamadı")
  }
}

export async function generateMonthlyHoroscope(
  zodiacSign: string,
  zodiacInfo: { nameTr: string; elementTr: string; planetTr: string }
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

  const currentMonth = new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
  
  // Ay başındaki gezegen pozisyonları
  const todayTransits = calculateTransits(new Date())
  const transitsText = formatTransitsForAI(todayTransits, true) // Tüm gezegenler
  const moonPhase = calculateMoonPhase(todayTransits)
  const aspects = calculateImportantAspects(todayTransits)

  const prompt = `Sen profesyonel bir astrolog ve burç yorumcususun. ${zodiacInfo.nameTr} burcu için ${currentMonth} ayına özel, gerçek astronomik verilere dayanan kapsamlı bir aylık burç yorumu yaz.

**BURÇ BİLGİLERİ:**
- Burç: ${zodiacInfo.nameTr}
- Element: ${zodiacInfo.elementTr}
- Yönetici Gezegen: ${zodiacInfo.planetTr}

**BU AYIN GERÇEK GEZEGEN POZİSYONLARI (Swiss Ephemeris - NASA JPL Verileri):**
${transitsText}

**ŞU ANKİ AY EVRESİ:**
${moonPhase}

**BU AYIN ÖNEMLİ ASPECT'LERİ:**
${aspects}

**ÖNEMLİ TALİMATLAR:**
1. Yukarıdaki GERÇEK astronomik verileri kullanarak aylık yorumunu oluştur
2. Gezegenlerin ay boyunca hareketlerini ve etkilerini detaylı anlat
3. Retrograde gezegenlerin aylık etkisini ve hangi tarihlerde başlayıp biteceğini belirt
4. Ay evresinin ay boyunca nasıl değişeceğini (Yeni Ay, Dolunay) ve etkilerini açıkla
5. Aspect'lerin ayın hangi dönemlerinde daha etkili olacağını belirt
6. Uranüs, Neptün, Plütôn gibi yavaş gezegenlerin uzun vadeli etkilerini vurgula

**YORUM İÇERİĞİ:**
1. **Ayın Genel Enerjisi ve Teması:** Gezegen pozisyonları ve aspect'lerin yarattığı aylık ana tema
2. **Aşk ve İlişkiler:** Venüs ve Ay'ın aylık etkisi, ilişkilerde beklentiler ve dönüm noktaları
3. **Kariyer ve Finans:** Mars, Jüpiter ve Satürn'le iş hayatı, büyük fırsatlar, dikkat edilmesi gerekenler
4. **Kişisel Gelişim ve Öğrenme:** Merkür ve Jüpiter etkisiyle öğrenme ve gelişim fırsatları
5. **Sağlık ve Enerji:** Fiziksel ve zihinsel sağlık, enerji düzeyi, dinlenme ihtiyacı
6. **Ayın Önemli Dönemleri:** Hangi haftalar/günler kritik, hangi dönemler verimli
7. **Ayın Genel Tavsiyesi:** Gezegen enerjilerine uygun aylık strateji ve öneriler

**YAZIM TARZI:**
- Türkçe, samimi ve sıcak bir dil kullan
- Astrolojik terimleri açıklayıcı şekilde kullan
- Pozitif ama gerçekçi ol
- 450-500 kelime arası yaz
- Başlık ekleme, doğrudan yoruma başla

Yorumu şimdi yaz:`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response
    return response.text()
  } catch (error) {
    console.error("Gemini API Error:", error)
    throw new Error("Aylık burç yorumu oluşturulamadı")
  }
}

/**
 * Günlük içeriğini analiz et
 */
export async function analyzeJournalEntry(
  content: string,
  mood: number,
  transits: TransitData | null
): Promise<{
  emotionalTone: string
  keywords: string[]
  transitInsights: string
  suggestions: string[]
}> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

  const transitsText = transits 
    ? Object.entries(transits).map(([planet, position]) => `${planet}: ${position}`).join(', ')
    : 'Transit bilgisi yok'

  const prompt = `Sen profesyonel bir astrolog ve psikoloğun. Aşağıdaki günlük girişini analiz et ve kullanıcıya içgörüler sun.

Günlük İçeriği:
${content}

Ruh Hali Skoru: ${mood}/10

O Günün Gezegen Pozisyonları:
${transitsText}

Lütfen şu formatta bir JSON yanıtı döndür:
{
  "emotionalTone": "Pozitif/Nötr/Negatif",
  "keywords": ["anahtar kelime 1", "anahtar kelime 2", "anahtar kelime 3"],
  "transitInsights": "Gezegen pozisyonlarının bu günlük üzerindeki olası etkisi hakkında 2-3 cümlelik analiz",
  "suggestions": ["öneri 1", "öneri 2", "öneri 3"]
}

Analiz Türkçe olmalı, empatik ve yapıcı olmalı.`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response.text()
    
    // JSON yanıtını parse et
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    // Fallback
    return {
      emotionalTone: mood >= 7 ? "Pozitif" : mood >= 4 ? "Nötr" : "Negatif",
      keywords: [],
      transitInsights: "Analiz yapılamadı",
      suggestions: ["Günlüğünüzü yazmaya devam edin"],
    }
  } catch (error) {
    console.error("Günlük analizi hatası:", error)
    throw new Error("Günlük analizi oluşturulamadı")
  }
}

/**
 * Birden fazla günlük girişinde pattern bul
 */
export async function findJournalPatterns(
  entries: Array<{
    date: Date
    mood: number
    content: string
    transits: TransitData | null
  }>
): Promise<{
  moodTrend: string
  transitCorrelations: string[]
  insights: string[]
  recommendations: string[]
}> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

  // Günlükleri özetle
  const entriesSummary = entries.map((entry, index) => {
    const transitsText = entry.transits 
      ? Object.entries(entry.transits).map(([planet, position]) => `${planet}: ${position}`).join(', ')
      : 'Yok'
    
    return `
Gün ${index + 1} (${entry.date.toLocaleDateString('tr-TR')}):
- Ruh Hali: ${entry.mood}/10
- İçerik Özeti: ${entry.content.substring(0, 100)}...
- Transit'ler: ${transitsText}
`
  }).join('\n')

  const prompt = `Sen profesyonel bir astrolog ve psikoloğun. Aşağıdaki günlük girişlerini analiz et ve kullanıcının ruh hali ile gezegen hareketleri arasındaki korelasyonları bul.

Günlük Girişleri:
${entriesSummary}

Lütfen şu formatta bir JSON yanıtı döndür:
{
  "moodTrend": "Ruh halindeki genel eğilim (yükseliyor/düşüyor/stabil)",
  "transitCorrelations": ["korelasyon 1", "korelasyon 2"],
  "insights": ["içgörü 1", "içgörü 2", "içgörü 3"],
  "recommendations": ["öneri 1", "öneri 2", "öneri 3"]
}

Analiz Türkçe olmalı, empatik ve yapıcı olmalı. Gezegen hareketleri ile ruh hali değişimleri arasındaki bağlantıları vurgula.`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response.text()
    
    // JSON yanıtını parse et
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    // Fallback
    return {
      moodTrend: "Analiz için yeterli veri yok",
      transitCorrelations: [],
      insights: ["Daha fazla günlük yazarak pattern'leri keşfedebilirsiniz"],
      recommendations: ["Düzenli günlük tutmaya devam edin"],
    }
  } catch (error) {
    console.error("Pattern analizi hatası:", error)
    throw new Error("Pattern analizi oluşturulamadı")
  }
}
