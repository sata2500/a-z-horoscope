/**
 * Natal Chart AI Analysis
 * 
 * Gemini AI kullanarak doğum haritası analizi
 * 
 * @author Manus AI
 * @date 12 Kasım 2025
 */

import { GoogleGenerativeAI } from "@google/generative-ai"
import {
  calculateElementDistribution,
  calculateModalityDistribution,
  getDominantElement,
  getDominantModality
} from "./astrology-constants"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

interface PlanetPosition {
  planetId: number
  planetName: string
  longitude: number
  latitude: number
  distance: number
  longitudeSpeed: number
  zodiacSign: string
  zodiacDegree: number
  retrograde: boolean
}

interface HousePosition {
  houseNumber: number
  cusp: number
  zodiacSign: string
  zodiacDegree: number
}

interface Aspect {
  planet1: string
  planet2: string
  aspectType: string
  angle: number
  orb: number
  applying: boolean
}

interface NatalChartData {
  birthDate: string
  latitude: number
  longitude: number
  planets: PlanetPosition[]
  houses: HousePosition[]
  ascendant: {
    longitude: number
    zodiacSign: string
    zodiacDegree: number
  }
  midheaven: {
    longitude: number
    zodiacSign: string
    zodiacDegree: number
  }
  aspects: Aspect[]
  houseSystem: string
}

/**
 * Gezegenin hangi evde olduğunu bul
 */
function findPlanetHouse(planetLongitude: number, houses: HousePosition[]): number {
  for (let i = 0; i < houses.length; i++) {
    const currentHouse = houses[i]
    const nextHouse = houses[(i + 1) % houses.length]
    
    const currentCusp = currentHouse.cusp
    let nextCusp = nextHouse.cusp
    
    if (nextCusp < currentCusp) {
      nextCusp += 360
      if (planetLongitude < currentCusp) {
        planetLongitude += 360
      }
    }
    
    if (planetLongitude >= currentCusp && planetLongitude < nextCusp) {
      return currentHouse.houseNumber
    }
  }
  
  return 1
}

/**
 * Doğum haritası için detaylı AI analizi oluştur
 */
export async function generateNatalChartAnalysis(
  chartData: NatalChartData,
  birthPlace?: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    // Güneş, Ay ve diğer önemli gezegenleri bul
    const sun = chartData.planets.find(p => p.planetName === "Güneş")
    const moon = chartData.planets.find(p => p.planetName === "Ay")
    const mercury = chartData.planets.find(p => p.planetName === "Merkür")
    const venus = chartData.planets.find(p => p.planetName === "Venüs")
    const mars = chartData.planets.find(p => p.planetName === "Mars")
    const jupiter = chartData.planets.find(p => p.planetName === "Jüpiter")
    const saturn = chartData.planets.find(p => p.planetName === "Satürn")
    const uranus = chartData.planets.find(p => p.planetName === "Uranüs")
    const neptune = chartData.planets.find(p => p.planetName === "Neptün")
    const pluto = chartData.planets.find(p => p.planetName === "Plüton")

    // Element ve modalite dağılımı
    const mainPlanets = chartData.planets.slice(0, 10)
    const elementDist = calculateElementDistribution(mainPlanets)
    const modalityDist = calculateModalityDistribution(mainPlanets)
    const dominantElement = getDominantElement(mainPlanets)
    const dominantModality = getDominantModality(mainPlanets)

    // Önemli aspect'leri filtrele
    const majorAspects = chartData.aspects.filter(a => 
      ["Kavuşum", "Karşıt", "Üçgen", "Kare", "Altıgen"].includes(a.aspectType)
    )

    // Retrograde gezegenleri bul
    const retrogradePlanets = chartData.planets.filter(p => p.retrograde)

    const prompt = `Sen profesyonel bir astrolog ve doğum haritası uzmanısın. Aşağıdaki doğum haritası verilerini kullanarak son derece detaylı, kişiselleştirilmiş ve profesyonel bir analiz yaz.

**DOĞUM BİLGİLERİ:**
- Doğum Tarihi: ${new Date(chartData.birthDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
${birthPlace ? `- Doğum Yeri: ${birthPlace}` : ''}
- Yükselen Burç: ${chartData.ascendant.zodiacSign} ${Math.floor(chartData.ascendant.zodiacDegree)}°
- Orta Gökyüzü (MC): ${chartData.midheaven.zodiacSign} ${Math.floor(chartData.midheaven.zodiacDegree)}°

**GEZEGEN POZİSYONLARI VE EVLER:**
${sun ? `- Güneş: ${sun.zodiacSign} ${Math.floor(sun.zodiacDegree)}° (${findPlanetHouse(sun.longitude, chartData.houses)}. Ev)${sun.retrograde ? ' ⟲ RETROGRADE' : ''}` : ''}
${moon ? `- Ay: ${moon.zodiacSign} ${Math.floor(moon.zodiacDegree)}° (${findPlanetHouse(moon.longitude, chartData.houses)}. Ev)${moon.retrograde ? ' ⟲ RETROGRADE' : ''}` : ''}
${mercury ? `- Merkür: ${mercury.zodiacSign} ${Math.floor(mercury.zodiacDegree)}° (${findPlanetHouse(mercury.longitude, chartData.houses)}. Ev)${mercury.retrograde ? ' ⟲ RETROGRADE' : ''}` : ''}
${venus ? `- Venüs: ${venus.zodiacSign} ${Math.floor(venus.zodiacDegree)}° (${findPlanetHouse(venus.longitude, chartData.houses)}. Ev)${venus.retrograde ? ' ⟲ RETROGRADE' : ''}` : ''}
${mars ? `- Mars: ${mars.zodiacSign} ${Math.floor(mars.zodiacDegree)}° (${findPlanetHouse(mars.longitude, chartData.houses)}. Ev)${mars.retrograde ? ' ⟲ RETROGRADE' : ''}` : ''}
${jupiter ? `- Jüpiter: ${jupiter.zodiacSign} ${Math.floor(jupiter.zodiacDegree)}° (${findPlanetHouse(jupiter.longitude, chartData.houses)}. Ev)${jupiter.retrograde ? ' ⟲ RETROGRADE' : ''}` : ''}
${saturn ? `- Satürn: ${saturn.zodiacSign} ${Math.floor(saturn.zodiacDegree)}° (${findPlanetHouse(saturn.longitude, chartData.houses)}. Ev)${saturn.retrograde ? ' ⟲ RETROGRADE' : ''}` : ''}
${uranus ? `- Uranüs: ${uranus.zodiacSign} ${Math.floor(uranus.zodiacDegree)}° (${findPlanetHouse(uranus.longitude, chartData.houses)}. Ev)${uranus.retrograde ? ' ⟲ RETROGRADE' : ''}` : ''}
${neptune ? `- Neptün: ${neptune.zodiacSign} ${Math.floor(neptune.zodiacDegree)}° (${findPlanetHouse(neptune.longitude, chartData.houses)}. Ev)${neptune.retrograde ? ' ⟲ RETROGRADE' : ''}` : ''}
${pluto ? `- Plüton: ${pluto.zodiacSign} ${Math.floor(pluto.zodiacDegree)}° (${findPlanetHouse(pluto.longitude, chartData.houses)}. Ev)${pluto.retrograde ? ' ⟲ RETROGRADE' : ''}` : ''}

**ELEMENT DAĞILIMI:**
${Object.entries(elementDist).map(([element, count]) => `- ${element}: ${count} gezegen (${((count/10)*100).toFixed(0)}%)`).join('\n')}
**Dominant Element:** ${dominantElement}

**MODALİTE DAĞILIMI:**
${Object.entries(modalityDist).map(([modality, count]) => `- ${modality}: ${count} gezegen (${((count/10)*100).toFixed(0)}%)`).join('\n')}
**Dominant Modalite:** ${dominantModality}

**ÖNEMLİ ASPECT'LER (İlk 15):**
${majorAspects.slice(0, 15).map(a => `- ${a.planet1} ${a.aspectType} ${a.planet2} (${Math.floor(a.angle)}°, orb: ${a.orb.toFixed(1)}°)${a.applying ? ' [Yaklaşan]' : ' [Ayrılan]'}`).join('\n')}

${retrogradePlanets.length > 0 ? `**RETROGRADE GEZEGENLER:**
${retrogradePlanets.map(p => `- ${p.planetName} ${p.zodiacSign} burçunda retrograde (${findPlanetHouse(p.longitude, chartData.houses)}. Ev)`).join('\n')}` : ''}

**EVLER:**
${chartData.houses.slice(0, 12).map(h => `- ${h.houseNumber}. Ev: ${h.zodiacSign} ${Math.floor(h.zodiacDegree)}°`).join('\n')}

**GÖREV:**
Bu doğum haritası için son derece kapsamlı, profesyonel ve kişiselleştirilmiş bir analiz yaz. Analiz şu bölümleri içermeli:

## 1. Genel Kişilik Profili
- Güneş, Ay, Yükselen üçlüsünün detaylı yorumu
- Bu üçlünün birbirleriyle etkileşimi
- Dominant element ve modalite'nin kişiliğe etkisi

## 2. İletişim ve Düşünce Tarzı
- Merkür'ün burcu ve evi
- Merkür'ün aspect'leri
- İletişim tarzı, öğrenme şekli

## 3. Aşk ve İlişkiler
- Venüs'ün burcu ve evi
- Venüs'ün aspect'leri
- İlişki ihtiyaçları, aşk dili

## 4. Enerji ve Motivasyon
- Mars'ın burcu ve evi
- Mars'ın aspect'leri
- Enerji yönetimi, motivasyon kaynakları

## 5. Büyüme ve Genişleme
- Jüpiter'in burcu ve evi
- Jüpiter'in aspect'leri
- Şans alanları, büyüme fırsatları

## 6. Sorumluluk ve Disiplin
- Satürn'ün burcu ve evi
- Satürn'ün aspect'leri
- Yaşam dersleri, zorluklar

## 7. Kariyer ve Yaşam Amacı
- MC (Orta Gökyüzü) burcu
- 10. Ev ve içindeki gezegenler
- Kariyer potansiyeli, kamu imajı

## 8. Ev Yaşamı ve Kökler
- IC (Gök Dibi) burcu
- 4. Ev ve içindeki gezegenler
- Aile dinamikleri, duygusal temeller

## 9. Önemli Aspect'lerin Yorumu
- Major aspect'lerin detaylı yorumu
- Aspect'lerin yaşama etkisi

${retrogradePlanets.length > 0 ? `## 10. Retrograde Gezegenlerin Derin Yorumu
- Her retrograde gezegenin anlamı
- İçe dönük enerji, geçmiş yaşam temaları
- Retrograde enerjisini nasıl kullanmalı` : ''}

## ${retrogradePlanets.length > 0 ? '11' : '10'}. Güçlü Yönler ve Potansiyeller
- Doğal yetenekler
- Güçlü aspect'ler
- Fırsat alanları

## ${retrogradePlanets.length > 0 ? '12' : '11'}. Üzerinde Çalışılması Gereken Alanlar
- Zorlu aspect'ler
- Gelişim alanları
- Denge kurulması gereken konular

## ${retrogradePlanets.length > 0 ? '13' : '12'}. Genel Değerlendirme ve Öneriler
- Doğum haritasının genel teması
- Yaşam yolculuğu için öneriler
- Kişisel gelişim tavsiyeleri

**YAZIM KURALLARI:**
- Türkçe yaz, samimi ama profesyonel bir dil kullan
- Markdown formatında yaz (başlıklar için ##, alt başlıklar için ###, vurgular için **bold**)
- Her bölümü SON DERECE detaylı açıkla (her ana bölüm 4-6 paragraf olsun)
- Gezegen pozisyonlarını, evleri ve aspect'leri MUTLAKA somut örneklerle açıkla
- Kişiye özel, pratik, uygulanabilir tavsiyeler ver
- Pozitif ve yapıcı bir dil kullan ama gerçekçi ol
- Astrolojik terimleri açıkla
- Element ve modalite dağılımını MUTLAKA yorumla
- Dominant özellikleri vurgula
- 2000-2500 kelime arası KAPSAMLI bir analiz yaz

Analizi şimdi başlat:`

    const result = await model.generateContent(prompt)
    const response = result.response
    const analysis = response.text()

    return analysis
  } catch (error) {
    console.error("Natal chart analysis error:", error)
    throw new Error("Doğum haritası analizi oluşturulamadı")
  }
}
