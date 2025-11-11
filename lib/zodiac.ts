export type ZodiacSign = 
  | "aries" 
  | "taurus" 
  | "gemini" 
  | "cancer" 
  | "leo" 
  | "virgo" 
  | "libra" 
  | "scorpio" 
  | "sagittarius" 
  | "capricorn" 
  | "aquarius" 
  | "pisces"

export interface ZodiacInfo {
  sign: ZodiacSign
  name: string
  nameTr: string
  symbol: string
  element: "fire" | "earth" | "air" | "water"
  elementTr: string
  planet: string
  planetTr: string
  dateRange: string
  dateRangeTr: string
  traits: string[]
  traitsTr: string[]
  color: string
  luckyNumber: number[]
}

export const zodiacSigns: Record<ZodiacSign, ZodiacInfo> = {
  aries: {
    sign: "aries",
    name: "Aries",
    nameTr: "Koç",
    symbol: "♈",
    element: "fire",
    elementTr: "Ateş",
    planet: "Mars",
    planetTr: "Mars",
    dateRange: "March 21 - April 19",
    dateRangeTr: "21 Mart - 19 Nisan",
    traits: ["Courageous", "Determined", "Confident", "Enthusiastic"],
    traitsTr: ["Cesur", "Kararlı", "Kendine Güvenen", "Heyecanlı"],
    color: "#FF6B6B",
    luckyNumber: [1, 9],
  },
  taurus: {
    sign: "taurus",
    name: "Taurus",
    nameTr: "Boğa",
    symbol: "♉",
    element: "earth",
    elementTr: "Toprak",
    planet: "Venus",
    planetTr: "Venüs",
    dateRange: "April 20 - May 20",
    dateRangeTr: "20 Nisan - 20 Mayıs",
    traits: ["Reliable", "Patient", "Practical", "Devoted"],
    traitsTr: ["Güvenilir", "Sabırlı", "Pratik", "Sadık"],
    color: "#4ECDC4",
    luckyNumber: [2, 6],
  },
  gemini: {
    sign: "gemini",
    name: "Gemini",
    nameTr: "İkizler",
    symbol: "♊",
    element: "air",
    elementTr: "Hava",
    planet: "Mercury",
    planetTr: "Merkür",
    dateRange: "May 21 - June 20",
    dateRangeTr: "21 Mayıs - 20 Haziran",
    traits: ["Gentle", "Affectionate", "Curious", "Adaptable"],
    traitsTr: ["Nazik", "Sevecen", "Meraklı", "Uyumlu"],
    color: "#FFE66D",
    luckyNumber: [5, 7],
  },
  cancer: {
    sign: "cancer",
    name: "Cancer",
    nameTr: "Yengeç",
    symbol: "♋",
    element: "water",
    elementTr: "Su",
    planet: "Moon",
    planetTr: "Ay",
    dateRange: "June 21 - July 22",
    dateRangeTr: "21 Haziran - 22 Temmuz",
    traits: ["Tenacious", "Loyal", "Emotional", "Sympathetic"],
    traitsTr: ["Azimli", "Sadık", "Duygusal", "Anlayışlı"],
    color: "#95E1D3",
    luckyNumber: [2, 7],
  },
  leo: {
    sign: "leo",
    name: "Leo",
    nameTr: "Aslan",
    symbol: "♌",
    element: "fire",
    elementTr: "Ateş",
    planet: "Sun",
    planetTr: "Güneş",
    dateRange: "July 23 - August 22",
    dateRangeTr: "23 Temmuz - 22 Ağustos",
    traits: ["Creative", "Passionate", "Generous", "Cheerful"],
    traitsTr: ["Yaratıcı", "Tutkulu", "Cömert", "Neşeli"],
    color: "#F38181",
    luckyNumber: [1, 3, 10],
  },
  virgo: {
    sign: "virgo",
    name: "Virgo",
    nameTr: "Başak",
    symbol: "♍",
    element: "earth",
    elementTr: "Toprak",
    planet: "Mercury",
    planetTr: "Merkür",
    dateRange: "August 23 - September 22",
    dateRangeTr: "23 Ağustos - 22 Eylül",
    traits: ["Loyal", "Analytical", "Kind", "Hardworking"],
    traitsTr: ["Sadık", "Analitik", "Nazik", "Çalışkan"],
    color: "#AA96DA",
    luckyNumber: [5, 14],
  },
  libra: {
    sign: "libra",
    name: "Libra",
    nameTr: "Terazi",
    symbol: "♎",
    element: "air",
    elementTr: "Hava",
    planet: "Venus",
    planetTr: "Venüs",
    dateRange: "September 23 - October 22",
    dateRangeTr: "23 Eylül - 22 Ekim",
    traits: ["Cooperative", "Diplomatic", "Gracious", "Fair-minded"],
    traitsTr: ["İşbirlikçi", "Diplomatik", "Zarif", "Adil"],
    color: "#FCBAD3",
    luckyNumber: [4, 6, 15],
  },
  scorpio: {
    sign: "scorpio",
    name: "Scorpio",
    nameTr: "Akrep",
    symbol: "♏",
    element: "water",
    elementTr: "Su",
    planet: "Pluto",
    planetTr: "Plüton",
    dateRange: "October 23 - November 21",
    dateRangeTr: "23 Ekim - 21 Kasım",
    traits: ["Resourceful", "Brave", "Passionate", "Stubborn"],
    traitsTr: ["Becerikli", "Cesur", "Tutkulu", "İnatçı"],
    color: "#A8D8EA",
    luckyNumber: [8, 11, 18],
  },
  sagittarius: {
    sign: "sagittarius",
    name: "Sagittarius",
    nameTr: "Yay",
    symbol: "♐",
    element: "fire",
    elementTr: "Ateş",
    planet: "Jupiter",
    planetTr: "Jüpiter",
    dateRange: "November 22 - December 21",
    dateRangeTr: "22 Kasım - 21 Aralık",
    traits: ["Generous", "Idealistic", "Great sense of humor"],
    traitsTr: ["Cömert", "İdealist", "Harika mizah anlayışı"],
    color: "#FFAAA5",
    luckyNumber: [3, 7, 9],
  },
  capricorn: {
    sign: "capricorn",
    name: "Capricorn",
    nameTr: "Oğlak",
    symbol: "♑",
    element: "earth",
    elementTr: "Toprak",
    planet: "Saturn",
    planetTr: "Satürn",
    dateRange: "December 22 - January 19",
    dateRangeTr: "22 Aralık - 19 Ocak",
    traits: ["Responsible", "Disciplined", "Self-control", "Good managers"],
    traitsTr: ["Sorumlu", "Disiplinli", "Öz kontrol", "İyi yöneticiler"],
    color: "#FF8B94",
    luckyNumber: [4, 8, 13],
  },
  aquarius: {
    sign: "aquarius",
    name: "Aquarius",
    nameTr: "Kova",
    symbol: "♒",
    element: "air",
    elementTr: "Hava",
    planet: "Uranus",
    planetTr: "Uranüs",
    dateRange: "January 20 - February 18",
    dateRangeTr: "20 Ocak - 18 Şubat",
    traits: ["Progressive", "Original", "Independent", "Humanitarian"],
    traitsTr: ["İlerici", "Özgün", "Bağımsız", "İnsancıl"],
    color: "#B4F8C8",
    luckyNumber: [4, 7, 11],
  },
  pisces: {
    sign: "pisces",
    name: "Pisces",
    nameTr: "Balık",
    symbol: "♓",
    element: "water",
    elementTr: "Su",
    planet: "Neptune",
    planetTr: "Neptün",
    dateRange: "February 19 - March 20",
    dateRangeTr: "19 Şubat - 20 Mart",
    traits: ["Compassionate", "Artistic", "Intuitive", "Gentle"],
    traitsTr: ["Merhametli", "Sanatsal", "Sezgisel", "Nazik"],
    color: "#A0E7E5",
    luckyNumber: [3, 9, 12],
  },
}

export function getZodiacByDate(date: Date): ZodiacSign {
  const month = date.getMonth() + 1
  const day = date.getDate()

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "aries"
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "taurus"
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "gemini"
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "cancer"
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "leo"
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "virgo"
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "libra"
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "scorpio"
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "sagittarius"
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "capricorn"
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "aquarius"
  return "pisces"
}

export function getAllZodiacSigns(): ZodiacInfo[] {
  return Object.values(zodiacSigns)
}


/**
 * Doğum tarihinden burç hesaplar
 * @param birthDate - Doğum tarihi (Date object veya ISO string)
 * @returns ZodiacSign
 */
export function getZodiacSignFromDate(birthDate: Date | string): ZodiacSign {
  const date = typeof birthDate === 'string' ? new Date(birthDate) : birthDate
  const month = date.getMonth() + 1 // 1-12
  const day = date.getDate() // 1-31

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "aries"
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "taurus"
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "gemini"
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "cancer"
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "leo"
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "virgo"
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "libra"
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "scorpio"
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "sagittarius"
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "capricorn"
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "aquarius"
  return "pisces" // (month === 2 && day >= 19) || (month === 3 && day <= 20)
}
