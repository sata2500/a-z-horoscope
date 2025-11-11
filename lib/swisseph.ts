/**
 * Swiss Ephemeris Wrapper
 * 
 * Bu modül, Swiss Ephemeris kütüphanesini kullanarak profesyonel astroloji hesaplamaları yapar.
 * - Doğum haritası (natal chart) hesaplama
 * - Gezegen pozisyonları
 * - Yükselen burç (Ascendant)
 * - Evler (Houses)
 * - Aspect'ler
 * 
 * @author Salih TANRISEVEN
 * @date 11 Kasım 2025
 */

import path from 'path';

// sweph import - TypeScript desteği built-in
// eslint-disable-next-line @typescript-eslint/no-require-imports
const sweph = require('sweph');

// Ephemeris dosyalarının bulunduğu klasör
const EPHEMERIS_PATH = path.join(process.cwd(), 'public', 'ephemeris');

// Gezegen ID'leri
export const PLANETS = {
  SUN: 0,
  MOON: 1,
  MERCURY: 2,
  VENUS: 3,
  MARS: 4,
  JUPITER: 5,
  SATURN: 6,
  URANUS: 7,
  NEPTUNE: 8,
  PLUTO: 9,
  MEAN_NODE: 10,      // North Node (Kuzey Düğüm)
  TRUE_NODE: 11,
  CHIRON: 15,
  MEAN_APOG: 12,      // Lilith (Black Moon)
} as const;

// Gezegen isimleri (Türkçe)
export const PLANET_NAMES: Record<number, string> = {
  [PLANETS.SUN]: 'Güneş',
  [PLANETS.MOON]: 'Ay',
  [PLANETS.MERCURY]: 'Merkür',
  [PLANETS.VENUS]: 'Venüs',
  [PLANETS.MARS]: 'Mars',
  [PLANETS.JUPITER]: 'Jüpiter',
  [PLANETS.SATURN]: 'Satürn',
  [PLANETS.URANUS]: 'Uranüs',
  [PLANETS.NEPTUNE]: 'Neptün',
  [PLANETS.PLUTO]: 'Plüton',
  [PLANETS.MEAN_NODE]: 'Kuzey Düğüm',
  [PLANETS.CHIRON]: 'Chiron',
  [PLANETS.MEAN_APOG]: 'Lilith',
};

// Burç isimleri
export const ZODIAC_SIGNS = [
  'Koç',      // Aries
  'Boğa',     // Taurus
  'İkizler',  // Gemini
  'Yengeç',   // Cancer
  'Aslan',    // Leo
  'Başak',    // Virgo
  'Terazi',   // Libra
  'Akrep',    // Scorpio
  'Yay',      // Sagittarius
  'Oğlak',    // Capricorn
  'Kova',     // Aquarius
  'Balık',    // Pisces
] as const;

// Ev sistemleri
export const HOUSE_SYSTEMS = {
  PLACIDUS: 'P',
  KOCH: 'K',
  EQUAL: 'E',
  WHOLE_SIGN: 'W',
  CAMPANUS: 'C',
  REGIOMONTANUS: 'R',
} as const;

// Aspect türleri
export const ASPECTS = {
  CONJUNCTION: { name: 'Kavuşum', angle: 0, orb: 8 },
  OPPOSITION: { name: 'Karşıt', angle: 180, orb: 8 },
  TRINE: { name: 'Üçgen', angle: 120, orb: 8 },
  SQUARE: { name: 'Kare', angle: 90, orb: 8 },
  SEXTILE: { name: 'Altıgen', angle: 60, orb: 6 },
  QUINCUNX: { name: 'Quincunx', angle: 150, orb: 3 },
  SEMISEXTILE: { name: 'Yarı Altıgen', angle: 30, orb: 2 },
} as const;

/**
 * Gezegen pozisyonu interface
 */
export interface PlanetPosition {
  planetId: number;
  planetName: string;
  longitude: number;        // Ekliptik boylam (0-360°)
  latitude: number;         // Ekliptik enlem
  distance: number;         // Dünya'dan uzaklık (AU)
  longitudeSpeed: number;   // Günlük hareket hızı
  zodiacSign: string;       // Burç adı
  zodiacDegree: number;     // Burç içindeki derece (0-30°)
  retrograde: boolean;      // Retrograde (geri gidiş) durumu
}

/**
 * Ev (House) pozisyonu interface
 */
export interface HousePosition {
  houseNumber: number;
  cusp: number;             // Ev başlangıcı (derece)
  zodiacSign: string;
  zodiacDegree: number;
}

/**
 * Aspect interface
 */
export interface Aspect {
  planet1: string;
  planet2: string;
  aspectType: string;
  angle: number;
  orb: number;              // Sapma miktarı
  applying: boolean;        // Yaklaşıyor mu?
}

/**
 * Doğum haritası interface
 */
export interface NatalChart {
  birthDate: Date;
  latitude: number;
  longitude: number;
  planets: PlanetPosition[];
  houses: HousePosition[];
  ascendant: {
    longitude: number;
    zodiacSign: string;
    zodiacDegree: number;
  };
  midheaven: {
    longitude: number;
    zodiacSign: string;
    zodiacDegree: number;
  };
  aspects: Aspect[];
}

/**
 * Ephemeris path'i ayarla
 */
export function initializeSwissEph(): void {
  try {
    sweph.set_ephe_path(EPHEMERIS_PATH);
    console.log('[SwissEph] Ephemeris path set:', EPHEMERIS_PATH);
  } catch (error) {
    console.error('[SwissEph] Failed to set ephemeris path:', error);
    throw new Error('Swiss Ephemeris initialization failed');
  }
}

/**
 * Tarih ve saati Julian Day'e çevir
 */
export function dateToJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // JavaScript 0-indexed
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + (date.getUTCMinutes() / 60) + (date.getUTCSeconds() / 3600);

  return sweph.julday(year, month, day, hour, sweph.constants.SE_GREG_CAL);
}

/**
 * Ekliptik boylamdan burç ve derece hesapla
 */
export function longitudeToZodiac(longitude: number): { sign: string; degree: number } {
  const normalizedLongitude = longitude % 360;
  const signIndex = Math.floor(normalizedLongitude / 30);
  const degree = normalizedLongitude % 30;

  return {
    sign: ZODIAC_SIGNS[signIndex],
    degree: degree,
  };
}

/**
 * Tek bir gezegenin pozisyonunu hesapla
 */
export function calculatePlanetPosition(julianDay: number, planetId: number): PlanetPosition {
  // Hesaplama flag'leri: SWIEPH (Swiss Ephemeris) + SPEED (hız hesapla)
  const flags = sweph.constants.SEFLG_SWIEPH | sweph.constants.SEFLG_SPEED;

  try {
    const result = sweph.calc_ut(julianDay, planetId, flags);

    if (result.error) {
      throw new Error(`Planet calculation error: ${result.error}`);
    }

    const { sign, degree } = longitudeToZodiac(result.data[0]);
    const isRetrograde = result.data[3] < 0; // Negatif hız = retrograde

    return {
      planetId,
      planetName: PLANET_NAMES[planetId] || `Planet ${planetId}`,
      longitude: result.data[0],
      latitude: result.data[1],
      distance: result.data[2],
      longitudeSpeed: result.data[3],
      zodiacSign: sign,
      zodiacDegree: degree,
      retrograde: isRetrograde,
    };
  } catch (error) {
    console.error(`[SwissEph] Error calculating planet ${planetId}:`, error);
    throw error;
  }
}

/**
 * Tüm gezegenlerin pozisyonlarını hesapla
 */
export function calculateAllPlanets(julianDay: number): PlanetPosition[] {
  const planetsToCalculate = [
    PLANETS.SUN,
    PLANETS.MOON,
    PLANETS.MERCURY,
    PLANETS.VENUS,
    PLANETS.MARS,
    PLANETS.JUPITER,
    PLANETS.SATURN,
    PLANETS.URANUS,
    PLANETS.NEPTUNE,
    PLANETS.PLUTO,
    PLANETS.MEAN_NODE,
    PLANETS.CHIRON,
    PLANETS.MEAN_APOG,
  ];

  return planetsToCalculate.map((planetId) => calculatePlanetPosition(julianDay, planetId));
}

/**
 * Evleri (Houses) hesapla
 */
export function calculateHouses(
  julianDay: number,
  latitude: number,
  longitude: number,
  houseSystem: string = HOUSE_SYSTEMS.PLACIDUS
): { houses: HousePosition[]; ascendant: number; midheaven: number } {
  try {
    const result = sweph.houses(julianDay, latitude, longitude, houseSystem);

    if (result.error) {
      throw new Error(`Houses calculation error: ${result.error}`);
    }

    // result.data.houses: 13 elemanlı array (index 0 boş, 1-12 evler)
    // result.data.points: [Ascendant, MC, ARMC, Vertex, ...]
    const houses: HousePosition[] = [];

    for (let i = 1; i <= 12; i++) {
      const cusp = result.data.houses[i];
      const { sign, degree } = longitudeToZodiac(cusp);

      houses.push({
        houseNumber: i,
        cusp,
        zodiacSign: sign,
        zodiacDegree: degree,
      });
    }

    const ascendant = result.data.points[0]; // Ascendant (Yükselen)
    const midheaven = result.data.points[1]; // MC (Midheaven)

    return {
      houses,
      ascendant,
      midheaven,
    };
  } catch (error) {
    console.error('[SwissEph] Error calculating houses:', error);
    throw error;
  }
}

/**
 * İki gezegen arasındaki açıyı hesapla
 */
function calculateAngleBetween(long1: number, long2: number): number {
  let angle = Math.abs(long1 - long2);
  if (angle > 180) {
    angle = 360 - angle;
  }
  return angle;
}

/**
 * Aspect'leri hesapla
 */
export function calculateAspects(planets: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = [];

  // Her gezegen çifti için aspect kontrolü
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i];
      const planet2 = planets[j];

      const angle = calculateAngleBetween(planet1.longitude, planet2.longitude);

      // Her aspect türü için kontrol
      for (const aspectType of Object.values(ASPECTS)) {
        const diff = Math.abs(angle - aspectType.angle);

        if (diff <= aspectType.orb) {
          // Aspect bulundu
          const applying = planet1.longitudeSpeed > planet2.longitudeSpeed;

          aspects.push({
            planet1: planet1.planetName,
            planet2: planet2.planetName,
            aspectType: aspectType.name,
            angle: aspectType.angle,
            orb: diff,
            applying,
          });
        }
      }
    }
  }

  return aspects;
}

/**
 * Doğum haritası (natal chart) hesapla
 */
export function calculateNatalChart(
  birthDate: Date,
  latitude: number,
  longitude: number,
  houseSystem: string = HOUSE_SYSTEMS.PLACIDUS
): NatalChart {
  // Ephemeris path'i ayarla
  initializeSwissEph();

  // Julian Day hesapla
  const julianDay = dateToJulianDay(birthDate);

  // Gezegenleri hesapla
  const planets = calculateAllPlanets(julianDay);

  // Evleri hesapla
  const { houses, ascendant, midheaven } = calculateHouses(
    julianDay,
    latitude,
    longitude,
    houseSystem
  );

  // Aspect'leri hesapla
  const aspects = calculateAspects(planets);

  // Ascendant ve Midheaven burç bilgileri
  const ascendantZodiac = longitudeToZodiac(ascendant);
  const midheavenZodiac = longitudeToZodiac(midheaven);

  return {
    birthDate,
    latitude,
    longitude,
    planets,
    houses,
    ascendant: {
      longitude: ascendant,
      zodiacSign: ascendantZodiac.sign,
      zodiacDegree: ascendantZodiac.degree,
    },
    midheaven: {
      longitude: midheaven,
      zodiacSign: midheavenZodiac.sign,
      zodiacDegree: midheavenZodiac.degree,
    },
    aspects,
  };
}

/**
 * Transit hesapla (bugünkü gezegen pozisyonları)
 */
export function calculateTransits(date: Date = new Date()): PlanetPosition[] {
  initializeSwissEph();
  const julianDay = dateToJulianDay(date);
  return calculateAllPlanets(julianDay);
}

/**
 * Cleanup - Swiss Ephemeris'i kapat
 */
export function closeSwissEph(): void {
  try {
    sweph.close();
    console.log('[SwissEph] Closed');
  } catch (error) {
    console.error('[SwissEph] Error closing:', error);
  }
}
