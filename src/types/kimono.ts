export type PatternId =
  | 'sakura'
  | 'tsuru'
  | 'nami'
  | 'sakura_nami_ribbon'
  | 'kikko'
  | 'asanoha'
  | 'custom';

export type FabricTextureId =
  | 'chirimen'
  | 'nishijin'
  | 'rinzu'
  | 'tsumugi'
  | 'shibori';

export type SilhouetteId =
  | 'furisode'
  | 'uchikake'
  | 'houmongi'
  | 'yukata';

export type ObiStyleId =
  | 'taiko'
  | 'bunko'
  | 'darari';

export type KanzashiStyleId =
  | 'sakura_shidare'
  | 'golden_crane'
  | 'pearl_comb'
  | 'minimal';

export type GarmentZone =
  | 'migoro'
  | 'sode'
  | 'obi'
  | 'eri'
  | 'face';

export interface FaceMappingConfig {
  enabled: boolean;
  imageDataUrl: string | null;
  presetName?: string;
  scale: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  warmthLighting: number; // -20 to +20
  petalGlow: number; // 0 to 100
  showLandmarks: boolean;
  kanzashiStyle: KanzashiStyleId;
  aiAnalysis?: {
    undertone: string;
    lightingHarmonyScore: number;
    recommendedSilkHex: string;
    recommendedObiHex: string;
    stylistNote: string;
    detectedLandmarksConfidence: number;
  };
}

export interface KimonoConfig {
  silhouette: SilhouetteId;
  baseColor: string;
  hemGradientColor: string;
  sleeveColor: string;
  eriCollarColor: string;
  obiStyle: ObiStyleId;
  obiColor: string;
  obijimeColor: string;
  patternId: PatternId;
  patternPrimaryColor: string;
  patternSecondaryColor: string;
  patternScale: number; // 0.6 to 1.6
  patternDensity: number; // 0.5 to 1.5
  customPatternDataUrl: string | null;
  fabricTexture: FabricTextureId;
  fabricIntensity: number; // 0.2 to 1.0
  goldLeafAccents: boolean;
  faceMapping: FaceMappingConfig;
}

export interface GalleryCreation {
  id: string;
  title: string;
  designerName: string;
  inspirationNote: string;
  seasonTag: 'Spring Hanami' | 'Summer Breeze' | 'Autumn Maple' | 'Winter Crane';
  createdAt: string;
  likes: number;
  remixes: number;
  previewDataUrl?: string;
  config: KimonoConfig;
}

export interface SeasonalChallenge {
  id: string;
  title: string;
  japaneseSubtitle: string;
  patronName: string;
  patronRole: string;
  brief: string;
  targetPattern: PatternId;
  targetFabric: FabricTextureId;
  recommendedColors: string[];
  symbolismHint: string;
  rewardTitle: string;
}
