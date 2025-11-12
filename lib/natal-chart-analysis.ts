/**
 * Natal Chart AI Analysis
 * 
 * Gemini AI kullanarak doğum haritası analizi
 * 
 * @author Manus AI
 * @date 12 Kasım 2025
 */

import { GoogleGenerativeAI } from "@google/generative-ai"

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
 * Doğum haritası için detaylı AI analizi oluştur
 */
export async function generateNatalChartAnalysis(
  chartData: NatalChartData,
  birthPlace?: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    // Güneş, Ay ve Yükselen burcu bul
    const sun = chartData.planets.find(p => p.planetName === "Güneş")
    const moon = chartData.planets.find(p => p.planetName === "Ay")
    const mercury = chartData.planets.find(p => p.planetName === "Merkür")
    const venus = chartData.planets.find(p => p.planetName === "Venüs")
    const mars = chartData.planets.find(p => p.planetName === "Mars")

    // Önemli aspect'leri filtrele
    const majorAspects = chartData.aspects.filter(a => 
      ["Kavuşum", "Karşıt", "Üçgen", "Kare", "Altıgen"].includes(a.aspectType)
    )

    const prompt = `Sen profesyonel bir astrologsun. Aşağıdaki doğum haritası verilerini kullanarak detaylı, kişiselleştirilmiş ve profesyonel bir analiz yap.

**DOĞUM BİLGİLERİ:**
- Doğum Tarihi: ${new Date(chartData.birthDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
${birthPlace ? `- Doğum Yeri: ${birthPlace}` : ''}
- Yükselen Burç: ${chartData.ascendant.zodiacSign} ${Math.floor(chartData.ascendant.zodiacDegree)}°
- Orta Gökyüzü (MC): ${chartData.midheaven.zodiacSign} ${Math.floor(chartData.midheaven.zodiacDegree)}°

**GEZEGEN POZİSYONLARI:**
${sun ? `- Güneş: ${sun.zodiacSign} ${Math.floor(sun.zodiacDegree)}°${sun.retrograde ? ' (Retrograde)' : ''}` : ''}
${moon ? `- Ay: ${moon.zodiacSign} ${Math.floor(moon.zodiacDegree)}°${moon.retrograde ? ' (Retrograde)' : ''}` : ''}
${mercury ? `- Merkür: ${mercury.zodiacSign} ${Math.floor(mercury.zodiacDegree)}°${mercury.retrograde ? ' (Retrograde)' : ''}` : ''}
${venus ? `- Venüs: ${venus.zodiacSign} ${Math.floor(venus.zodiacDegree)}°${venus.retrograde ? ' (Retrograde)' : ''}` : ''}
${mars ? `- Mars: ${mars.zodiacSign} ${Math.floor(mars.zodiacDegree)}°${mars.retrograde ? ' (Retrograde)' : ''}` : ''}
${chartData.planets.slice(5, 10).map(p => `- ${p.planetName}: ${p.zodiacSign} ${Math.floor(p.zodiacDegree)}°${p.retrograde ? ' (Retrograde)' : ''}`).join('\n')}

**EVLER:**
${chartData.houses.slice(0, 12).map(h => `- ${h.houseNumber}. Ev: ${h.zodiacSign} ${Math.floor(h.zodiacDegree)}°`).join('\n')}

**ÖNEMLİ ASPECT'LER:**
${majorAspects.slice(0, 10).map(a => `- ${a.planet1} ${a.aspectType} ${a.planet2} (${Math.floor(a.angle)}°, orb: ${a.orb.toFixed(1)}°)`).join('\n')}

**GÖREV:**
Bu doğum haritası için kapsamlı, profesyonel ve kişiselleştirilmiş bir analiz yaz. Analiz şu bölümleri içermeli:

1. **Genel Kişilik Profili** (Güneş, Ay, Yükselen üçlüsü)
2. **İletişim ve Düşünce Tarzı** (Merkür)
3. **Aşk ve İlişkiler** (Venüs)
4. **Enerji ve Motivasyon** (Mars)
5. **Kariyer ve Yaşam Amacı** (MC, 10. Ev)
6. **Ev Yaşamı ve Kökler** (4. Ev, IC)
7. **Önemli Aspect'lerin Yorumu**
8. **Güçlü Yönler ve Potansiyeller**
9. **Üzerinde Çalışılması Gereken Alanlar**
10. **Genel Değerlendirme ve Öneriler**

**YAZIM KURALLARI:**
- Türkçe yaz, samimi ama profesyonel bir dil kullan
- Markdown formatında yaz (başlıklar için ##, vurgular için **bold**)
- Her bölümü detaylı açıkla (her bölüm 3-5 paragraf olsun)
- Gezegen pozisyonlarını ve aspect'leri somut örneklerle açıkla
- Kişiye özel, pratik tavsiyeler ver
- Pozitif ve yapıcı bir dil kullan
- Astrolojik terimleri açıkla
- 1500-2000 kelime arası kapsamlı bir analiz yaz

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
