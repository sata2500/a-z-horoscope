/**
 * Astroloji Sabitleri
 * 
 * Gezegen ve burç sembolleri, renkler ve diğer sabitler
 * 
 * @author Manus AI
 * @date 12 Kasım 2025
 */

export const PLANET_SYMBOLS: Record<string, string> = {
  'Güneş': '☉',
  'Ay': '☽',
  'Merkür': '☿',
  'Venüs': '♀',
  'Mars': '♂',
  'Jüpiter': '♃',
  'Satürn': '♄',
  'Uranüs': '♅',
  'Neptün': '♆',
  'Plüton': '♇',
  'Kuzey Düğüm': '☊',
  'Chiron': '⚷',
  'Lilith': '⚸'
}

export const PLANET_COLORS: Record<string, string> = {
  'Güneş': 'text-yellow-500 dark:text-yellow-400',
  'Ay': 'text-blue-300 dark:text-blue-200',
  'Merkür': 'text-gray-500 dark:text-gray-400',
  'Venüs': 'text-pink-500 dark:text-pink-400',
  'Mars': 'text-red-500 dark:text-red-400',
  'Jüpiter': 'text-purple-500 dark:text-purple-400',
  'Satürn': 'text-gray-700 dark:text-gray-300',
  'Uranüs': 'text-cyan-500 dark:text-cyan-400',
  'Neptün': 'text-blue-600 dark:text-blue-400',
  'Plüton': 'text-purple-800 dark:text-purple-300',
  'Kuzey Düğüm': 'text-indigo-500 dark:text-indigo-400',
  'Chiron': 'text-teal-600 dark:text-teal-400',
  'Lilith': 'text-rose-700 dark:text-rose-400'
}

export const PLANET_BG_COLORS: Record<string, string> = {
  'Güneş': 'bg-yellow-500/10 dark:bg-yellow-400/10',
  'Ay': 'bg-blue-300/10 dark:bg-blue-200/10',
  'Merkür': 'bg-gray-500/10 dark:bg-gray-400/10',
  'Venüs': 'bg-pink-500/10 dark:bg-pink-400/10',
  'Mars': 'bg-red-500/10 dark:bg-red-400/10',
  'Jüpiter': 'bg-purple-500/10 dark:bg-purple-400/10',
  'Satürn': 'bg-gray-700/10 dark:bg-gray-300/10',
  'Uranüs': 'bg-cyan-500/10 dark:bg-cyan-400/10',
  'Neptün': 'bg-blue-600/10 dark:bg-blue-400/10',
  'Plüton': 'bg-purple-800/10 dark:bg-purple-300/10',
  'Kuzey Düğüm': 'bg-indigo-500/10 dark:bg-indigo-400/10',
  'Chiron': 'bg-teal-600/10 dark:bg-teal-400/10',
  'Lilith': 'bg-rose-700/10 dark:bg-rose-400/10'
}

export const ZODIAC_SYMBOLS: Record<string, string> = {
  'Koç': '♈',
  'Boğa': '♉',
  'İkizler': '♊',
  'Yengeç': '♋',
  'Aslan': '♌',
  'Başak': '♍',
  'Terazi': '♎',
  'Akrep': '♏',
  'Yay': '♐',
  'Oğlak': '♑',
  'Kova': '♒',
  'Balık': '♓'
}

export const ZODIAC_ELEMENTS: Record<string, string> = {
  'Koç': 'Ateş',
  'Aslan': 'Ateş',
  'Yay': 'Ateş',
  'Boğa': 'Toprak',
  'Başak': 'Toprak',
  'Oğlak': 'Toprak',
  'İkizler': 'Hava',
  'Terazi': 'Hava',
  'Kova': 'Hava',
  'Yengeç': 'Su',
  'Akrep': 'Su',
  'Balık': 'Su'
}

export const ZODIAC_MODALITIES: Record<string, string> = {
  'Koç': 'Kardinal',
  'Yengeç': 'Kardinal',
  'Terazi': 'Kardinal',
  'Oğlak': 'Kardinal',
  'Boğa': 'Sabit',
  'Aslan': 'Sabit',
  'Akrep': 'Sabit',
  'Kova': 'Sabit',
  'İkizler': 'Değişken',
  'Başak': 'Değişken',
  'Yay': 'Değişken',
  'Balık': 'Değişken'
}

export const ELEMENT_COLORS: Record<string, string> = {
  'Ateş': 'text-red-500 dark:text-red-400',
  'Toprak': 'text-green-600 dark:text-green-400',
  'Hava': 'text-yellow-500 dark:text-yellow-400',
  'Su': 'text-blue-500 dark:text-blue-400'
}

export const ELEMENT_BG_COLORS: Record<string, string> = {
  'Ateş': 'bg-gradient-to-br from-red-500 to-orange-500',
  'Toprak': 'bg-gradient-to-br from-green-600 to-emerald-700',
  'Hava': 'bg-gradient-to-br from-yellow-400 to-amber-500',
  'Su': 'bg-gradient-to-br from-blue-500 to-cyan-500'
}

export const MODALITY_COLORS: Record<string, string> = {
  'Kardinal': 'text-red-600 dark:text-red-400',
  'Sabit': 'text-green-600 dark:text-green-400',
  'Değişken': 'text-blue-600 dark:text-blue-400'
}

export const ASPECT_SYMBOLS: Record<string, string> = {
  'Kavuşum': '☌',
  'Karşıt': '☍',
  'Üçgen': '△',
  'Kare': '□',
  'Altıgen': '⚹',
  'Quincunx': '⚻',
  'Yarı Altıgen': '⚺'
}

export const ASPECT_COLORS: Record<string, string> = {
  'Kavuşum': 'text-yellow-600 dark:text-yellow-400',
  'Karşıt': 'text-red-600 dark:text-red-400',
  'Üçgen': 'text-green-600 dark:text-green-400',
  'Kare': 'text-orange-600 dark:text-orange-400',
  'Altıgen': 'text-blue-600 dark:text-blue-400',
  'Quincunx': 'text-purple-600 dark:text-purple-400',
  'Yarı Altıgen': 'text-cyan-600 dark:text-cyan-400'
}

export const HOUSE_MEANINGS: Record<number, string> = {
  1: 'Kişilik, Görünüm, Kimlik',
  2: 'Değerler, Mal Varlığı, Kaynaklar',
  3: 'İletişim, Öğrenme, Kardeşler',
  4: 'Ev, Aile, Kökler, İç Dünya',
  5: 'Yaratıcılık, Aşk, Çocuklar, Eğlence',
  6: 'Sağlık, Günlük Rutin, Hizmet',
  7: 'İlişkiler, Ortaklıklar, Evlilik',
  8: 'Dönüşüm, Ölüm, Miras, Cinsellik',
  9: 'Felsefe, Seyahat, Yüksek Öğrenim',
  10: 'Kariyer, Statü, Kamu İmajı',
  11: 'Arkadaşlıklar, Topluluk, Hayaller',
  12: 'Bilinçaltı, Gizlilik, Spiritüalite'
}

/**
 * Element dağılımını hesapla
 */
export function calculateElementDistribution(planets: { zodiacSign: string }[]): Record<string, number> {
  const distribution: Record<string, number> = {
    'Ateş': 0,
    'Toprak': 0,
    'Hava': 0,
    'Su': 0
  }

  planets.forEach(planet => {
    const element = ZODIAC_ELEMENTS[planet.zodiacSign]
    if (element) {
      distribution[element]++
    }
  })

  return distribution
}

/**
 * Modalite dağılımını hesapla
 */
export function calculateModalityDistribution(planets: { zodiacSign: string }[]): Record<string, number> {
  const distribution: Record<string, number> = {
    'Kardinal': 0,
    'Sabit': 0,
    'Değişken': 0
  }

  planets.forEach(planet => {
    const modality = ZODIAC_MODALITIES[planet.zodiacSign]
    if (modality) {
      distribution[modality]++
    }
  })

  return distribution
}

/**
 * Dominant elementi bul
 */
export function getDominantElement(planets: { zodiacSign: string }[]): string {
  const distribution = calculateElementDistribution(planets)
  return Object.entries(distribution).reduce((a, b) => a[1] > b[1] ? a : b)[0]
}

/**
 * Dominant modaliteyi bul
 */
export function getDominantModality(planets: { zodiacSign: string }[]): string {
  const distribution = calculateModalityDistribution(planets)
  return Object.entries(distribution).reduce((a, b) => a[1] > b[1] ? a : b)[0]
}
