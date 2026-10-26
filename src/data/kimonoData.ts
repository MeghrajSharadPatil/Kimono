import {
  FabricTextureId,
  KimonoConfig,
  ObiStyleId,
  PatternId,
  SeasonalChallenge,
  SilhouetteId,
} from '../types/kimono';

export interface PatternMeta {
  id: PatternId;
  japaneseKana: string;
  romaji: string;
  englishTitle: string;
  season: string;
  meaning: string;
  culturalHistory: string;
  badgeColor: string;
}

export const KIMONO_PATTERNS: PatternMeta[] = [
  {
    id: 'sakura',
    japaneseKana: 'さくら',
    romaji: 'Sakura',
    englishTitle: 'Cherry Blossom',
    season: 'Spring Theme',
    meaning: 'New beginnings, beauty, and spring joy',
    culturalHistory:
      'Pink cherry blossoms are the most famous flower in Japan. Wearing sakura patterns brings fresh luck and celebrates the beauty of spring.',
    badgeColor: '#F8C8D8',
  },
  {
    id: 'tsuru',
    japaneseKana: 'つる',
    romaji: 'Tsuru',
    englishTitle: 'Lucky Crane',
    season: 'Good Fortune Theme',
    meaning: 'Long life, happiness, and big dreams',
    culturalHistory:
      'In Japanese stories, the red-crowned crane lives for 1,000 years. It is a favorite pattern for celebrations and special events.',
    badgeColor: '#BDE0FE',
  },
  {
    id: 'nami',
    japaneseKana: 'なみ',
    romaji: 'Nami',
    englishTitle: 'Ocean Waves',
    season: 'Summer & Peace Theme',
    meaning: 'Calm seas, peace, and endless good luck',
    culturalHistory:
      'Gentle rolling blue waves represent a peaceful life and strength that keeps going forever.',
    badgeColor: '#A8E6CF',
  },
  {
    id: 'sakura_nami_ribbon',
    japaneseKana: 'さくら・なみ',
    romaji: 'Sakura & Waves',
    englishTitle: 'Poster Ribbon (Flowers + Waves)',
    season: 'Festival Special',
    meaning: 'Nature and good luck combined',
    culturalHistory:
      'Matches the colorful ribbon on the right side of our pattern poster, mixing pink cherry blossoms with blue ocean waves and gold trim.',
    badgeColor: '#F5B7B1',
  },
  {
    id: 'custom',
    japaneseKana: 'じさく',
    romaji: 'Custom',
    englishTitle: 'My Custom Pattern',
    season: 'Your Own Style',
    meaning: 'Drawn or uploaded by you',
    culturalHistory:
      'Use our easy stamp and brush pad—or upload any picture from your device—to put your own pattern right on the kimono.',
    badgeColor: '#FADBD8',
  },
];

export interface FabricMeta {
  id: FabricTextureId;
  name: string;
  japaneseName: string;
  sheenLevel: string;
  textureDescription: string;
}

export const FABRIC_TEXTURES: FabricMeta[] = [
  {
    id: 'chirimen',
    name: 'Soft Crepe Silk',
    japaneseName: 'Soft & Textured',
    sheenLevel: 'Matte Finish',
    textureDescription: 'Classic soft kimono silk with a gentle woven texture that makes pink colors pop.',
  },
  {
    id: 'nishijin',
    name: 'Gold Thread Brocade',
    japaneseName: 'Royal Gold Shine',
    sheenLevel: 'Sparkling Gold',
    textureDescription: 'Rich woven fabric with shiny golden threads for a bright party look.',
  },
  {
    id: 'rinzu',
    name: 'Smooth Glossy Satin',
    japaneseName: 'Silky & Shiny',
    sheenLevel: 'High Shine',
    textureDescription: 'Smooth, glossy silk that reflects light cleanly like ribbons.',
  },
  {
    id: 'shibori',
    name: 'Dotted Tie-Dye Silk',
    japaneseName: 'Cute Pattern Dots',
    sheenLevel: 'Soft Patterned',
    textureDescription: 'Traditional Japanese tie-dye texture with tiny decorative rings.',
  },
];

export interface SilhouetteMeta {
  id: SilhouetteId;
  name: string;
  japanese: string;
  sleeveLength: string;
  occasion: string;
}

export const SILHOUETTES: SilhouetteMeta[] = [
  {
    id: 'furisode',
    name: 'Long Sleeve Kimono (Furisode)',
    japanese: 'Long Flowing Sleeves',
    sleeveLength: 'Extra-long sleeves',
    occasion: 'Festivals, parties, and cosplay photoshoots',
  },
  {
    id: 'yukata',
    name: 'Summer Festival Kimono (Yukata)',
    japanese: 'Light & Breezy Sleeves',
    sleeveLength: 'Standard sleeves',
    occasion: 'Summer fireworks and cherry blossom walks',
  },
];

export interface ObiStyleMeta {
  id: ObiStyleId;
  name: string;
  japanese: string;
  description: string;
}

export const OBI_STYLES: ObiStyleMeta[] = [
  {
    id: 'bunko',
    name: 'Butterfly Ribbon Bow',
    japanese: 'Cute Winged Bow',
    description: 'A big, cheerful butterfly bow on the back.',
  },
  {
    id: 'taiko',
    name: 'Classic Folded Sash',
    japanese: 'Neat & Traditional',
    description: 'A clean, classic waist belt with a central cord.',
  },
  {
    id: 'darari',
    name: 'Long Hanging Ribbons',
    japanese: 'Flowing Sash Tails',
    description: 'Long decorative belt ribbons that sway when walking.',
  },
];

export interface TraditionalColorSwatch {
  name: string;
  japanese: string;
  hex: string;
}

export const TRADITIONAL_SWATCHES: TraditionalColorSwatch[] = [
  { name: 'Sakura Pink', japanese: 'Soft Pink', hex: '#FADADD' },
  { name: 'Berry Rose', japanese: 'Bright Pink', hex: '#F48FB1' },
  { name: 'Ruby Red', japanese: 'Deep Red', hex: '#C82846' },
  { name: 'Ocean Blue', japanese: 'Wave Blue', hex: '#1D4E89' },
  { name: 'Sky Blue', japanese: 'Light Blue', hex: '#7EC8E3' },
  { name: 'Sunny Gold', japanese: 'Gold', hex: '#D4AF37' },
  { name: 'Snow White', japanese: 'Pure White', hex: '#FFF8FA' },
  { name: 'Lavender', japanese: 'Soft Purple', hex: '#B39DDB' },
  { name: 'Mint Green', japanese: 'Fresh Green', hex: '#5E9A78' },
  { name: 'Night Black', japanese: 'Dark Ink', hex: '#23181C' },
];

export interface AnatomyTerm {
  id: string;
  name: string;
  kanji: string;
  zoneLabel: string;
  coords: { x: number; y: number };
  summary: string;
  etiquetteTip: string;
}

export const KIMONO_ANATOMY: AnatomyTerm[] = [
  {
    id: 'eri',
    name: 'Collar (Eri)',
    kanji: 'Neckline',
    zoneLabel: 'Top Collar',
    coords: { x: 50, y: 24 },
    summary:
      'The white and colored collar that frames the neck and face.',
    etiquetteTip:
      'Fun fact: When wearing a kimono, always wrap the left side over the right side!',
  },
  {
    id: 'sode',
    name: 'Sleeves (Sode)',
    kanji: 'Long Sleeves',
    zoneLabel: 'Wide Sleeves',
    coords: { x: 22, y: 46 },
    summary:
      'Long, flowing rectangular sleeves that show off your favorite flower, crane, or wave patterns.',
    etiquetteTip:
      'Long sleeves (called Furisode) are worn for special celebrations and festivals.',
  },
  {
    id: 'obi',
    name: 'Wide Belt (Obi)',
    kanji: 'Waist Sash',
    zoneLabel: 'Center Belt & Bow',
    coords: { x: 50, y: 49 },
    summary:
      'A wide, colorful belt tied around the waist with a cute butterfly bow in the back. Kimonos do not use buttons or zippers!',
    etiquetteTip:
      'Picking a belt color that contrasts with your dress makes the whole outfit stand out.',
  },
  {
    id: 'migoro',
    name: 'Main Dress (Body)',
    kanji: 'Main Robe',
    zoneLabel: 'Main Kimono Dress',
    coords: { x: 52, y: 74 },
    summary:
      'The main robe from shoulder to ankle, dyed with a gentle color fade at the bottom hem.',
    etiquetteTip:
      'A traditional kimono is made from a single long roll of silk without wasting any fabric.',
  },
];

export const SEASONAL_CHALLENGES: SeasonalChallenge[] = [
  {
    id: 'challenge-sakura-hanami',
    title: 'Quest 1: Pink Cherry Blossom Festival',
    japaneseSubtitle: 'Spring Dress-Up Quest',
    patronName: 'Marin’s Spring Shoot',
    patronRole: 'Sakura Park',
    brief:
      'Pick the Cherry Blossom (Sakura) pattern with Soft Crepe Silk and pink or red colors for a spring photo under the sakura trees!',
    targetPattern: 'sakura',
    targetFabric: 'chirimen',
    recommendedColors: ['#FADADD', '#F48FB1', '#1D4E89', '#C82846'],
    symbolismHint: 'Cherry blossoms represent spring joy and fresh starts.',
    rewardTitle: 'Sakura Style Star',
  },
  {
    id: 'challenge-tsuru-wedding',
    title: 'Quest 2: Lucky Golden Crane Outfit',
    japaneseSubtitle: 'Good Fortune Quest',
    patronName: 'Festival Stage',
    patronRole: 'Special Event',
    brief:
      'Choose the Lucky Crane (Tsuru) pattern with Gold Thread Brocade fabric for a dazzling celebration outfit!',
    targetPattern: 'tsuru',
    targetFabric: 'nishijin',
    recommendedColors: ['#C82846', '#D4AF37', '#FFF8FA'],
    symbolismHint: 'Cranes stand for 1,000 years of good luck and happiness.',
    rewardTitle: 'Golden Crane Designer',
  },
  {
    id: 'challenge-nami-moonlight',
    title: 'Quest 3: Summer Ocean Wave Walk',
    japaneseSubtitle: 'Cool Breeze Quest',
    patronName: 'Seaside Lantern Walk',
    patronRole: 'Summer Evening',
    brief:
      'Design a cool kimono using the Ocean Waves (Nami) pattern with blue and pink colors!',
    targetPattern: 'nami',
    targetFabric: 'shibori',
    recommendedColors: ['#1D4E89', '#7EC8E3', '#FADADD'],
    symbolismHint: 'Waves bring peaceful seas and steady good luck.',
    rewardTitle: 'Ocean Wave Artist',
  },
];

export const DEFAULT_KIMONO_CONFIG: KimonoConfig = {
  silhouette: 'furisode',
  baseColor: '#FADADD',
  hemGradientColor: '#C82846',
  sleeveColor: '#F48FB1',
  eriCollarColor: '#FFF8FA',
  obiStyle: 'bunko',
  obiColor: '#1D4E89',
  obijimeColor: '#D4AF37',
  patternId: 'sakura_nami_ribbon',
  patternPrimaryColor: '#C82846',
  patternSecondaryColor: '#1D4E89',
  patternScale: 1.05,
  patternDensity: 1.0,
  customPatternDataUrl: null,
  fabricTexture: 'chirimen',
  fabricIntensity: 0.75,
  goldLeafAccents: true,
  faceMapping: {
    enabled: false,
    imageDataUrl: null,
    scale: 1.0,
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
    warmthLighting: 4,
    petalGlow: 40,
    showLandmarks: false,
    kanzashiStyle: 'sakura_shidare',
  },
};
