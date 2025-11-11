import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "")

export async function generateDailyHoroscope(
  zodiacSign: string,
  zodiacInfo: { nameTr: string; elementTr: string; planetTr: string }
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

  const prompt = `Sen profesyonel bir astrolog ve burç yorumcususun. ${zodiacInfo.nameTr} burcu için bugüne özel, pozitif ve motive edici bir günlük burç yorumu yaz.

Burç Bilgileri:
- Burç: ${zodiacInfo.nameTr}
- Element: ${zodiacInfo.elementTr}
- Gezegen: ${zodiacInfo.planetTr}

Yorum şu konuları içermeli:
1. Genel Enerji (bugünün genel havası)
2. Aşk ve İlişkiler
3. Kariyer ve Finans
4. Sağlık ve Enerji
5. Günün Tavsiyesi

Yorum Türkçe olmalı, samimi ve sıcak bir dille yazılmalı. Yaklaşık 200-250 kelime olsun. Başlık ekleme, doğrudan yoruma başla.`

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

  const prompt = `Sen profesyonel bir astrolog ve burç yorumcususun. ${zodiacInfo.nameTr} burcu için bu haftaya özel, detaylı bir haftalık burç yorumu yaz.

Burç Bilgileri:
- Burç: ${zodiacInfo.nameTr}
- Element: ${zodiacInfo.elementTr}
- Gezegen: ${zodiacInfo.planetTr}

Yorum şu konuları içermeli:
1. Haftanın Genel Enerjisi
2. Aşk ve İlişkiler (hafta boyunca)
3. Kariyer ve Finans (fırsatlar ve dikkat edilmesi gerekenler)
4. Sağlık ve Enerji
5. Haftanın Önemli Günleri (hangi günler daha verimli)
6. Haftanın Tavsiyesi

Yorum Türkçe olmalı, samimi ve sıcak bir dille yazılmalı. Yaklaşık 300-350 kelime olsun. Başlık ekleme, doğrudan yoruma başla.`

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

  const prompt = `Sen profesyonel bir astrolog ve burç yorumcususun. ${zodiacInfo.nameTr} burcu için ${currentMonth} ayına özel, kapsamlı bir aylık burç yorumu yaz.

Burç Bilgileri:
- Burç: ${zodiacInfo.nameTr}
- Element: ${zodiacInfo.elementTr}
- Gezegen: ${zodiacInfo.planetTr}

Yorum şu konuları içermeli:
1. Ayın Genel Enerjisi ve Teması
2. Aşk ve İlişkiler (ay boyunca beklentiler)
3. Kariyer ve Finans (büyük fırsatlar, dikkat edilmesi gerekenler)
4. Kişisel Gelişim ve Öğrenme
5. Sağlık ve Enerji
6. Ayın Önemli Dönemleri (hangi haftalar/günler kritik)
7. Ayın Genel Tavsiyesi

Yorum Türkçe olmalı, samimi ve sıcak bir dille yazılmalı. Yaklaşık 400-450 kelime olsun. Başlık ekleme, doğrudan yoruma başla.`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response
    return response.text()
  } catch (error) {
    console.error("Gemini API Error:", error)
    throw new Error("Aylık burç yorumu oluşturulamadı")
  }
}
