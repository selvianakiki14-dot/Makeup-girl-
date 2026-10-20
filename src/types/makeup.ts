export type LipFinish = 'matte' | 'glossy' | 'ombre' | 'satin' | 'metallic';

export interface LipMakeup {
  color: string;
  finish: LipFinish;
  intensity: number; // 0 - 100
  lipLiner: boolean;
  linerColor: string;
  glossHighlight: number; // 0 - 100
  ombreInnerColor?: string;
}

export type BlushStyle = 'apples' | 'draped' | 'sunkissed' | 'undereye' | 'temple';

export interface BlushMakeup {
  color: string;
  style: BlushStyle;
  intensity: number; // 0 - 100
  shimmer: number; // 0 - 100
}

export type EyeshadowStyle = 'single' | 'duo' | 'smokey' | 'halo' | 'cutcrease';
export type EyelinerStyle = 'none' | 'cat' | 'winged' | 'puppy' | 'tightline' | 'graphic';
export type MascaraStyle = 'natural' | 'volume' | 'wispy' | 'doll';
export type BrowStyle = 'natural' | 'defined' | 'feathered' | 'straight';

export interface EyeMakeup {
  eyeshadowStyle: EyeshadowStyle;
  primaryColor: string;
  secondaryColor: string;
  shimmerColor: string;
  intensity: number; // 0 - 100
  eyelinerStyle: EyelinerStyle;
  eyelinerColor: string;
  eyelinerThickness: number; // 1 - 5
  mascaraStyle: MascaraStyle;
  mascaraIntensity: number; // 0 - 100
  browStyle: BrowStyle;
  browColor: string;
  browIntensity: number; // 0 - 100
}

export type CoverageLevel = 'sheer' | 'medium' | 'full';
export type SkinFinish = 'dewy' | 'satin' | 'matte';

export interface FaceBase {
  foundationTone: string;
  foundationOpacity: number; // 0 - 100
  coverage: CoverageLevel;
  finish: SkinFinish;
  glow: number; // 0 - 100
  contourColor: string;
  contourIntensity: number; // 0 - 100
  highlighterColor: string;
  highlighterIntensity: number; // 0 - 100
  freckles: number; // 0 - 100
}

export interface MakeupState {
  lips: LipMakeup;
  blush: BlushMakeup;
  eyes: EyeMakeup;
  face: FaceBase;
}

export interface FaceModel {
  id: string;
  name: string;
  skinToneName: string;
  skinHex: string;
  undertone: 'warm' | 'cool' | 'neutral';
  description: string;
  avatarSeed: string;
}

export interface MakeupLook {
  id: string;
  title: string;
  titleId: string;
  tagline: string;
  category: 'natural' | 'glam' | 'korean' | 'vintage' | 'trendy' | 'wedding';
  description: string;
  descriptionId: string;
  state: MakeupState;
  tags: string[];
  bannerGradient: string;
  badge: string;
}

export interface PersonalColorResult {
  season: 'spring_warm' | 'summer_cool' | 'autumn_warm' | 'winter_cool';
  seasonNameId: string;
  seasonNameEn: string;
  undertone: 'warm' | 'cool' | 'neutral';
  summary: string;
  paletteHexes: string[];
  recommendedLipShades: { name: string; hex: string }[];
  recommendedBlushShades: { name: string; hex: string }[];
  recommendedEyePalettes: { name: string; colors: string[] }[];
  doAndDonts: { do: string[]; dont: string[] };
  jewelryAdvice: string;
}

export interface SavedLook {
  id: string;
  name: string;
  date: string;
  notes?: string;
  modelName: string;
  state: MakeupState;
  previewThumbnail?: string;
}

export interface VanityProduct {
  id: string;
  name: string;
  brand: string;
  category: 'Lip' | 'Eye' | 'Face' | 'Skincare';
  shadeName: string;
  shadeHex?: string;
  purchaseDate: string;
  shelfLifeMonths: number;
  notes?: string;
}
