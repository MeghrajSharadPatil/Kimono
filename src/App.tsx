/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Award,
  BookOpen,
  Brush,
  Download,
  Heart,
  Palette,
  RotateCcw,
  Share2,
  Sparkles,
  UserCheck,
  Volume2,
  VolumeX,
  Wand2,
  X,
} from 'lucide-react';
import { AIFaceMapperPanel } from './components/AIFaceMapperPanel';
import { CustomPatternStudio } from './components/CustomPatternStudio';
import { KimonoHeritageSection } from './components/KimonoHeritageSection';
import { KimonoModelCanvas } from './components/KimonoModelCanvas';
import { SakuraTreeCanvas } from './components/SakuraTreeCanvas';
import { SocialGallerySection } from './components/SocialGallerySection';
import {
  DEFAULT_KIMONO_CONFIG,
  FABRIC_TEXTURES,
  KIMONO_PATTERNS,
  TRADITIONAL_SWATCHES,
} from './data/kimonoData';
import { MARIN_HEADSHOT_URL, SAKURA_BACKDROP_URL } from './assets/marinImages';
import {
  FaceMappingConfig,
  GalleryCreation,
  GarmentZone,
  KimonoConfig,
  PatternId,
} from './types/kimono';
import { soundFX } from './utils/soundEffects';

const FALLBACK_GALLERY_ITEMS: GalleryCreation[] = [
  {
    id: 'creation-sakura-dawn',
    title: 'Marin’s Pink Sakura Festival Furisode',
    designerName: 'Aoi · Tokyo',
    inspirationNote: 'Soft pink cherry blossoms with a bright crimson butterfly bow under the sakura trees.',
    seasonTag: 'Spring Hanami',
    createdAt: '2 hours ago',
    likes: 148,
    remixes: 29,
    config: {
      ...DEFAULT_KIMONO_CONFIG,
      baseColor: '#FADADD',
      sleeveColor: '#F48FB1',
      hemGradientColor: '#C82846',
      obiColor: '#1D4E89',
      patternId: 'sakura',
    },
  },
  {
    id: 'creation-tsuru-eternity',
    title: 'Golden Crane Celebration Kimono',
    designerName: 'Haruka · Kyoto',
    inspirationNote: 'Lucky cranes soaring over ruby red silk and gold thread brocade.',
    seasonTag: 'Winter Crane',
    createdAt: '5 hours ago',
    likes: 214,
    remixes: 42,
    config: {
      ...DEFAULT_KIMONO_CONFIG,
      baseColor: '#C82846',
      sleeveColor: '#C82846',
      hemGradientColor: '#901A3E',
      obiColor: '#D4AF37',
      patternId: 'tsuru',
      fabricTexture: 'nishijin',
    },
  },
  {
    id: 'creation-nami-poster-tribute',
    title: 'Sakura & Ocean Wave Ribbon Homage',
    designerName: 'Kenji · Osaka',
    inspirationNote: 'Inspired by our Beautiful Kimono Patterns poster—combining pink cherry blossoms and blue waves!',
    seasonTag: 'Summer Breeze',
    createdAt: '1 day ago',
    likes: 186,
    remixes: 37,
    config: {
      ...DEFAULT_KIMONO_CONFIG,
      baseColor: '#FFF8FA',
      sleeveColor: '#FADADD',
      hemGradientColor: '#1D4E89',
      obiColor: '#C82846',
      patternId: 'sakura_nami_ribbon',
    },
  },
  {
    id: 'creation-azure-waves',
    title: 'Summer Sky Ocean Wave Yukata',
    designerName: 'Mio · Kamakura',
    inspirationNote: 'Cool ocean blue waves paired with a sweet berry rose waist belt.',
    seasonTag: 'Summer Breeze',
    createdAt: '2 days ago',
    likes: 132,
    remixes: 19,
    config: {
      ...DEFAULT_KIMONO_CONFIG,
      baseColor: '#7EC8E3',
      sleeveColor: '#7EC8E3',
      hemGradientColor: '#1D4E89',
      obiColor: '#F48FB1',
      patternId: 'nami',
    },
  },
];

type StudioTab = 'design_colors' | 'draw_upload' | 'ai_face';

interface QuickStylePreset {
  id: string;
  label: string;
  subtitle: string;
  baseColor: string;
  sleeveColor: string;
  hemGradientColor: string;
  obiColor: string;
  patternId: PatternId;
  patternPrimaryColor: string;
  patternSecondaryColor: string;
}

const QUICK_STYLE_PRESETS: QuickStylePreset[] = [
  {
    id: 'preset-sakura-princess',
    label: 'Sakura Princess',
    subtitle: 'Soft Pink + Crimson Bow',
    baseColor: '#FADADD',
    sleeveColor: '#F48FB1',
    hemGradientColor: '#C82846',
    obiColor: '#C82846',
    patternId: 'sakura',
    patternPrimaryColor: '#E13D73',
    patternSecondaryColor: '#FFF8FA',
  },
  {
    id: 'preset-poster-ribbon',
    label: 'Poster Ribbon Look',
    subtitle: 'Flowers + Ocean Waves',
    baseColor: '#FFF8FA',
    sleeveColor: '#FADADD',
    hemGradientColor: '#1D4E89',
    obiColor: '#1D4E89',
    patternId: 'sakura_nami_ribbon',
    patternPrimaryColor: '#C82846',
    patternSecondaryColor: '#1D4E89',
  },
  {
    id: 'preset-golden-crane',
    label: 'Lucky Golden Crane',
    subtitle: 'Ruby Red + Gold Shine',
    baseColor: '#C82846',
    sleeveColor: '#C82846',
    hemGradientColor: '#901A3E',
    obiColor: '#D4AF37',
    patternId: 'tsuru',
    patternPrimaryColor: '#FFF8FA',
    patternSecondaryColor: '#D4AF37',
  },
  {
    id: 'preset-ocean-breeze',
    label: 'Summer Ocean Wave',
    subtitle: 'Sky Blue + Berry Belt',
    baseColor: '#7EC8E3',
    sleeveColor: '#7EC8E3',
    hemGradientColor: '#1D4E89',
    obiColor: '#F48FB1',
    patternId: 'nami',
    patternPrimaryColor: '#1D4E89',
    patternSecondaryColor: '#FFF8FA',
  },
];

export default function App() {
  const [config, setConfig] = useState<KimonoConfig>(DEFAULT_KIMONO_CONFIG);
  const [activeZone, setActiveZone] = useState<GarmentZone>('migoro');
  const [studioTab, setStudioTab] = useState<StudioTab>('design_colors');
  const [soundMuted, setSoundMuted] = useState<boolean>(false);

  // Social Gallery state initialized with fallback items so static Vercel deployments always show the gallery
  const [galleryItems, setGalleryItems] = useState<GalleryCreation[]>(FALLBACK_GALLERY_ITEMS);
  const [publishModalOpen, setPublishModalOpen] = useState<boolean>(false);
  const [publishTitle, setPublishTitle] = useState<string>('');
  const [publishDesigner, setPublishDesigner] = useState<string>('');
  const [publishNote, setPublishNote] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Outfit Rating state
  const [artisanCritique, setArtisanCritique] = useState<{
    artisanTitle: string;
    harmonyScore: number;
    critique: string;
    haiku: string;
  } | null>(null);
  const [isEvaluatingCritique, setIsEvaluatingCritique] = useState<boolean>(false);

  const kimonoCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.items) && data.items.length > 0) {
          setGalleryItems(data.items);
        }
      })
      .catch(() => {
        // Static deployment fallback (e.g. Vercel): keep FALLBACK_GALLERY_ITEMS
      });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApplyQuickPreset = (preset: QuickStylePreset) => {
    soundFX.playSakuraFanfare();
    setConfig((prev) => ({
      ...prev,
      baseColor: preset.baseColor,
      sleeveColor: preset.sleeveColor,
      hemGradientColor: preset.hemGradientColor,
      obiColor: preset.obiColor,
      patternId: preset.patternId,
      patternPrimaryColor: preset.patternPrimaryColor,
      patternSecondaryColor: preset.patternSecondaryColor,
    }));
    showToast(`Applied "${preset.label}" style!`);
  };

  const handleRandomizeStyle = () => {
    soundFX.playKotoPluck(4);
    const randomSwatch1 =
      TRADITIONAL_SWATCHES[Math.floor(Math.random() * TRADITIONAL_SWATCHES.length)];
    const randomSwatch2 =
      TRADITIONAL_SWATCHES[Math.floor(Math.random() * TRADITIONAL_SWATCHES.length)];
    const randomSwatch3 =
      TRADITIONAL_SWATCHES[Math.floor(Math.random() * TRADITIONAL_SWATCHES.length)];
    const patterns: PatternId[] = ['sakura', 'tsuru', 'nami', 'sakura_nami_ribbon'];
    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];

    setConfig((prev) => ({
      ...prev,
      baseColor: randomSwatch1.hex,
      sleeveColor: randomSwatch1.hex,
      hemGradientColor: randomSwatch2.hex,
      obiColor: randomSwatch3.hex,
      patternId: randomPattern,
      patternPrimaryColor: randomSwatch2.hex,
    }));
    showToast('Created a surprise Kimono look for Marin!');
  };

  const handleRequestArtisanCritique = async () => {
    setIsEvaluatingCritique(true);
    soundFX.playKotoPluck(3);
    try {
      const response = await fetch('/api/ai/critique-kimono', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config,
          challengeTitle: 'Marin Sakura Kimono Photoshoot',
        }),
      });
      const data = await response.json();
      setArtisanCritique(data);
      soundFX.playSakuraFanfare();
    } catch {
      setArtisanCritique({
        artisanTitle: 'Sakura Fashion Star',
        harmonyScore: 98,
        critique:
          'Marin looks dazzling in this kimono! The pattern and belt colors match the pink cherry blossom trees beautifully.',
        haiku: 'Pink petals drift down / Silk threads catch the morning sun / Cranes dance in the sky',
      });
    } finally {
      setIsEvaluatingCritique(false);
    }
  };

  const handleUpdateFaceMapping = (
    updater: (prev: FaceMappingConfig) => FaceMappingConfig
  ) => {
    setConfig((prev) => ({
      ...prev,
      faceMapping: updater(prev.faceMapping),
    }));
  };

  const handleDownloadPosterSnapshot = () => {
    if (!kimonoCanvasRef.current) return;
    const dataUrl = kimonoCanvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `marin-kimono-${config.patternId}.png`;
    a.click();
    soundFX.playSakuraFanfare();
    showToast('Saved your Marin Kimono picture!');
  };

  const handlePublishCreation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publishTitle.trim()) return;
    setIsPublishing(true);

    const previewDataUrl = kimonoCanvasRef.current
      ? kimonoCanvasRef.current.toDataURL('image/png')
      : undefined;

    const localItem: GalleryCreation = {
      id: `creation-${Date.now()}`,
      title: publishTitle.trim(),
      designerName: publishDesigner.trim() || 'Guest Designer',
      inspirationNote:
        publishNote.trim() || 'Designed for Marin under the pink sakura trees!',
      seasonTag: 'Spring Hanami',
      createdAt: 'Just now',
      likes: 1,
      remixes: 0,
      previewDataUrl,
      config,
    };

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localItem),
      });
      const data = await res.json();
      setGalleryItems((prev) => [data.item || localItem, ...prev]);
    } catch {
      setGalleryItems((prev) => [localItem, ...prev]);
    } finally {
      soundFX.playSakuraFanfare();
      setPublishModalOpen(false);
      setPublishTitle('');
      setPublishNote('');
      setIsPublishing(false);
      showToast('Shared your kimono to the Social Gallery!');
      document.getElementById('social-gallery')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLikeGalleryItem = async (id: string) => {
    setGalleryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, likes: item.likes + 1 } : item))
    );
    fetch(`/api/gallery/${id}/like`, { method: 'POST' }).catch(() => {});
  };

  const handleRemixGalleryItem = (creation: GalleryCreation) => {
    setConfig({
      ...creation.config,
      faceMapping: {
        ...DEFAULT_KIMONO_CONFIG.faceMapping,
        ...creation.config.faceMapping,
      },
    });
    showToast(`Now wearing "${creation.title}"!`);
    document.getElementById('design-studio')?.scrollIntoView({ behavior: 'smooth' });
  };

  const getActiveZoneColor = (): string => {
    if (activeZone === 'sode') return config.sleeveColor;
    if (activeZone === 'obi') return config.obiColor;
    return config.baseColor;
  };

  const setActiveZoneColor = (hex: string) => {
    soundFX.playKotoPluck(1);
    setConfig((prev) => {
      if (activeZone === 'sode') return { ...prev, sleeveColor: hex };
      if (activeZone === 'obi') return { ...prev, obiColor: hex };
      return {
        ...prev,
        baseColor: hex,
        sleeveColor: hex,
        hemGradientColor: hex,
      };
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8FA] text-[#23181C] relative overflow-x-hidden pb-20 md:pb-0">
      {/* Animated Pink Sakura Petals */}
      <SakuraTreeCanvas breezeActive={true} />

      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5 border-b border-[#EBCAD7] bg-white/90 backdrop-blur-md">
        <a
          href="#design-studio"
          className="text-lg sm:text-xl font-serif font-bold tracking-tight text-[#23181C] whitespace-nowrap shrink-0"
        >
          Marin Sakura Kimono
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5C3A47]">
          <a
            href="#design-studio"
            onClick={() => setStudioTab('design_colors')}
            className="hover:text-[#C82846] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Dress-Up Studio
          </a>
          <a
            href="#design-studio"
            onClick={() => setStudioTab('draw_upload')}
            className="hover:text-[#C82846] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Draw Pattern
          </a>
          <a
            href="#design-studio"
            onClick={() => setStudioTab('ai_face')}
            className="hover:text-[#C82846] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            AI Face Swap
          </a>
          <a
            href="#social-gallery"
            className="hover:text-[#C82846] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Social Gallery
          </a>
          <a
            href="#kimono-heritage"
            className="hover:text-[#C82846] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Kimono Guide
          </a>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setPublishModalOpen(true)}
            className="min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-[#C82846] rounded-xl hover:bg-[#A61C36] active:scale-95 transition-all whitespace-nowrap shrink-0 shadow-xs"
          >
            Share My Kimono
          </button>
        </div>
      </header>

      {/* Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 rounded-2xl bg-[#23181C] text-white px-4 py-3 text-xs font-medium shadow-lg flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FFB7C8]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="relative z-10 flex-1">
        {/* Vibrant Anime Sakura Festival Hero Banner */}
        <section id="design-studio" className="pt-4 sm:pt-6 pb-10">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-6">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#F0B8CC] shadow-sm">
              <img
                src={SAKURA_BACKDROP_URL}
                alt="Pink Sakura Blossom Festival Street"
                referrerPolicy="no-referrer"
                className="w-full h-44 sm:h-52 object-cover"
              />
              {/* Measured Contrast Scrim */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#23121A]/85 via-[#23121A]/55 to-transparent flex items-center p-5 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
                  <div className="flex items-center gap-4 max-w-xl">
                    <img
                      src={MARIN_HEADSHOT_URL}
                      alt="Marin Kitagawa"
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#FFB7C8] shadow-md shrink-0"
                    />
                    <div className="text-white">
                      <h1
                        className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold leading-tight"
                        style={{ textWrap: 'balance' }}
                      >
                        Marin’s Pink Sakura Kimono Dress-Up
                      </h1>
                      <p className="text-xs sm:text-sm text-[#FFE4EE] mt-1">
                        Tap any color or pattern below to style Marin Kitagawa’s kimono, draw your
                        own pattern, or try on the outfit with AI Face Swap!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleRequestArtisanCritique}
                      disabled={isEvaluatingCritique}
                      className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#C82846] hover:bg-[#A61C36] active:scale-95 text-white text-xs font-semibold transition-all whitespace-nowrap shrink-0 shadow-md"
                    >
                      <Award className="w-4 h-4" />
                      <span>{isEvaluatingCritique ? 'Scoring...' : 'Rate My Outfit'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundFX.muted = !soundMuted;
                        setSoundMuted(!soundMuted);
                      }}
                      aria-label="Toggle Sound"
                      className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-2xl bg-white/90 hover:bg-white text-[#23181C] transition-all shrink-0"
                    >
                      {soundMuted ? (
                        <VolumeX className="w-4 h-4 text-[#7A5462]" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-[#C82846]" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Outfit Score Popup Card */}
            {artisanCritique && (
              <div className="rounded-2xl border-2 border-[#D4AF37] bg-[#FFFDF7] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#23181C]">
                    Outfit Rank:{' '}
                    <span className="text-[#C82846]">{artisanCritique.artisanTitle}</span> · Score:{' '}
                    <span className="font-mono tabular-nums text-[#C82846]">
                      {artisanCritique.harmonyScore}/100
                    </span>
                  </div>
                  <p className="text-xs text-[#3D262E]">{artisanCritique.critique}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setArtisanCritique(null)}
                  className="min-h-[38px] px-3 py-1.5 rounded-xl border border-[#E2BDCB] text-xs font-medium text-[#5C3A47] hover:bg-[#FCECF0] whitespace-nowrap shrink-0"
                >
                  Close
                </button>
              </div>
            )}

            {/* Main 2-Column Responsive Layout (Stacks cleanly on mobile, side-by-side on desktop) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left Column (5 cols): Exact Marin Kitagawa Interactive Kimono Stage */}
              <div className="lg:col-span-5 space-y-3">
                <KimonoModelCanvas
                  config={config}
                  activeZone={activeZone}
                  onSelectZone={(z) => {
                    setActiveZone(z);
                    if (z === 'face') {
                      setStudioTab('ai_face');
                    } else {
                      setStudioTab('design_colors');
                    }
                    soundFX.playKotoPluck(1);
                  }}
                  onOpenFaceModal={() => setStudioTab('ai_face')}
                  canvasRef={kimonoCanvasRef}
                />

                {/* Mobile & Desktop Quick Action Row under Marin */}
                <div className="grid grid-cols-3 gap-2 rounded-2xl border border-[#E8C5D2] bg-white p-2.5 shadow-xs">
                  <button
                    type="button"
                    onClick={handleRandomizeStyle}
                    className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#FCECF0] hover:bg-[#F7D4E0] active:scale-95 text-xs font-semibold text-[#8E244D] transition-all whitespace-nowrap shrink-0"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-[#C82846]" />
                    <span>Surprise Me</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPosterSnapshot}
                    className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-[#E2BDCB] bg-white hover:bg-[#FCECF0] active:scale-95 text-xs font-semibold text-[#23181C] transition-all whitespace-nowrap shrink-0"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C82846]" />
                    <span>Save Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPublishModalOpen(true)}
                    className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#C82846] hover:bg-[#A61C36] active:scale-95 text-white text-xs font-semibold transition-all whitespace-nowrap shrink-0"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Online</span>
                  </button>
                </div>
              </div>

              {/* Right Column (7 cols): Super Easy Design & Color Studio */}
              <div className="lg:col-span-7 space-y-4">
                {/* 1-Tap Quick Look Presets */}
                <div className="rounded-3xl border border-[#E8C5D2] bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8E244D]">
                      1-Tap Quick Looks for Marin
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playKotoPluck(0);
                        setConfig(DEFAULT_KIMONO_CONFIG);
                        showToast('Reset to original kimono');
                      }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#6B4A56] hover:text-[#C82846]"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {QUICK_STYLE_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyQuickPreset(preset)}
                        className="min-h-[54px] p-2.5 rounded-2xl border border-[#EBCAD7] bg-[#FFF9FB] hover:bg-[#FCECF0] active:scale-95 text-left transition-all flex items-center gap-2"
                      >
                        <div className="flex -space-x-1.5 shrink-0">
                          <span
                            className="w-5 h-5 rounded-full border border-white shadow-2xs"
                            style={{ backgroundColor: preset.baseColor }}
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-white shadow-2xs"
                            style={{ backgroundColor: preset.obiColor }}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#23181C] truncate">
                            {preset.label}
                          </div>
                          <div className="text-[10px] text-[#7A5462] truncate">
                            {preset.subtitle}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Big 3-Button Mode Switcher (48px Touch Targets) */}
                <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#FCE8EF] border border-[#E8C5D2]">
                  <button
                    type="button"
                    onClick={() => {
                      setStudioTab('design_colors');
                      soundFX.playKotoPluck(1);
                    }}
                    className={`min-h-[46px] flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 whitespace-nowrap shrink-0 ${
                      studioTab === 'design_colors'
                        ? 'bg-white text-[#C82846] shadow-xs'
                        : 'text-[#5C3A47] hover:text-[#23181C]'
                    }`}
                  >
                    <Palette className="w-4 h-4 shrink-0" />
                    <span>Colors &amp; Patterns</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStudioTab('draw_upload');
                      soundFX.playKotoPluck(2);
                    }}
                    className={`min-h-[46px] flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 whitespace-nowrap shrink-0 ${
                      studioTab === 'draw_upload'
                        ? 'bg-white text-[#C82846] shadow-xs'
                        : 'text-[#5C3A47] hover:text-[#23181C]'
                    }`}
                  >
                    <Brush className="w-4 h-4 shrink-0" />
                    <span>Draw Pattern</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStudioTab('ai_face');
                      soundFX.playKotoPluck(3);
                    }}
                    className={`min-h-[46px] flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 whitespace-nowrap shrink-0 ${
                      studioTab === 'ai_face'
                        ? 'bg-white text-[#C82846] shadow-xs'
                        : 'text-[#5C3A47] hover:text-[#23181C]'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 shrink-0" />
                    <span>AI Face Swap</span>
                  </button>
                </div>

                {/* TAB 1: Unified Easy Color & Pattern Selection (All in one place!) */}
                {studioTab === 'design_colors' && (
                  <div className="rounded-3xl border border-[#E8C5D2] bg-white p-4 sm:p-5 space-y-6 shadow-xs">
                    {/* STEP A: Easy Color Picker with Big Touch Circles */}
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-sm font-bold text-[#23181C]">
                          Step 1: Pick a Part &amp; Tap a Color
                        </h3>

                        <div className="flex items-center gap-1.5 bg-[#FFF5F8] p-1 rounded-xl border border-[#EBCAD7]">
                          {(
                            [
                              { id: 'migoro', label: 'Whole Dress' },
                              { id: 'sode', label: 'Sleeves' },
                              { id: 'obi', label: 'Bow Belt' },
                            ] as { id: GarmentZone; label: string }[]
                          ).map((z) => (
                            <button
                              key={z.id}
                              type="button"
                              onClick={() => setActiveZone(z.id)}
                              className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                                activeZone === z.id
                                  ? 'bg-[#C82846] text-white shadow-2xs'
                                  : 'text-[#5C3A47] hover:text-[#23181C]'
                              }`}
                            >
                              {z.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Big 48px Touch-Friendly Color Bubbles */}
                      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-1">
                        {TRADITIONAL_SWATCHES.map((sw) => {
                          const isCurrent =
                            getActiveZoneColor().toLowerCase() === sw.hex.toLowerCase();
                          return (
                            <button
                              key={sw.hex}
                              type="button"
                              onClick={() => setActiveZoneColor(sw.hex)}
                              className="flex flex-col items-center group focus:outline-none"
                            >
                              <span
                                style={{ backgroundColor: sw.hex }}
                                className={`w-11 h-11 rounded-2xl border-2 transition-transform active:scale-90 flex items-center justify-center ${
                                  isCurrent
                                    ? 'border-[#C82846] scale-110 ring-2 ring-[#C82846]/30 shadow-sm'
                                    : 'border-black/15 group-hover:scale-105'
                                }`}
                              />
                              <span className="text-[11px] font-medium text-[#3D262E] mt-1 truncate w-full text-center">
                                {sw.name.split(' ')[0]}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* STEP B: Easy Pattern Cards */}
                    <div className="space-y-3 pt-4 border-t border-[#F2DCE4]">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-[#23181C]">
                          Step 2: Choose a Kimono Pattern
                        </h3>
                        <button
                          type="button"
                          onClick={() => setStudioTab('draw_upload')}
                          className="text-xs font-semibold text-[#C82846] hover:underline"
                        >
                          + Draw Custom Pattern →
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {KIMONO_PATTERNS.map((pat, idx) => {
                          const isSelected = config.patternId === pat.id;
                          return (
                            <button
                              key={pat.id}
                              type="button"
                              onClick={() => {
                                soundFX.playKotoPluck(idx);
                                if (pat.id === 'custom') {
                                  setStudioTab('draw_upload');
                                }
                                setConfig((prev) => ({ ...prev, patternId: pat.id }));
                              }}
                              className={`min-h-[64px] p-3.5 rounded-2xl border-2 text-left transition-all active:scale-98 flex items-center justify-between gap-3 ${
                                isSelected
                                  ? 'border-[#C82846] bg-[#FFF5F8] shadow-xs'
                                  : 'border-[#EBCAD7] bg-white hover:bg-[#FFF9FB]'
                              }`}
                            >
                              <div>
                                <div className="text-sm font-bold text-[#23181C]">
                                  {pat.englishTitle}
                                </div>
                                <div className="text-xs text-[#6B4A56] mt-0.5">{pat.meaning}</div>
                              </div>
                              <span className="text-xs font-bold text-[#C82846] shrink-0">
                                {pat.japaneseKana}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* STEP C: Simple Fabric Shine Selector */}
                    <div className="space-y-2.5 pt-4 border-t border-[#F2DCE4]">
                      <h3 className="text-sm font-bold text-[#23181C]">
                        Step 3: Pick Fabric Style
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {FABRIC_TEXTURES.map((fab, idx) => {
                          const isSelected = config.fabricTexture === fab.id;
                          return (
                            <button
                              key={fab.id}
                              type="button"
                              onClick={() => {
                                soundFX.playKotoPluck(idx);
                                setConfig((prev) => ({ ...prev, fabricTexture: fab.id }));
                              }}
                              className={`min-h-[52px] p-2.5 rounded-xl border text-center transition-all active:scale-95 ${
                                isSelected
                                  ? 'border-[#C82846] bg-[#C82846] text-white font-semibold shadow-xs'
                                  : 'border-[#E8C5D2] bg-[#FFF9FB] text-[#3D262E] hover:bg-[#FCECF0]'
                              }`}
                            >
                              <div className="text-xs font-bold">{fab.name}</div>
                              <div
                                className={`text-[10px] mt-0.5 ${
                                  isSelected ? 'text-[#FFE4EE]' : 'text-[#7A5462]'
                                }`}
                              >
                                {fab.japaneseName}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: Draw or Upload Your Own Pattern */}
                {studioTab === 'draw_upload' && (
                  <CustomPatternStudio
                    currentCustomPatternUrl={config.customPatternDataUrl}
                    onApplyPattern={(dataUrl) => {
                      setConfig((prev) => ({
                        ...prev,
                        patternId: 'custom',
                        customPatternDataUrl: dataUrl,
                      }));
                      showToast('Put your custom pattern on Marin’s kimono!');
                    }}
                  />
                )}

                {/* TAB 3: AI Face Swap */}
                {studioTab === 'ai_face' && (
                  <AIFaceMapperPanel
                    config={config}
                    onUpdateFaceMapping={handleUpdateFaceMapping}
                    onApplyRecommendedPalette={(silkHex, obiHex) => {
                      setConfig((prev) => ({
                        ...prev,
                        baseColor: silkHex,
                        sleeveColor: silkHex,
                        obiColor: obiHex,
                      }));
                      showToast('Applied AI matched colors!');
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Social Fashion Gallery */}
        <SocialGallerySection
          items={galleryItems}
          onLike={handleLikeGalleryItem}
          onRemix={handleRemixGalleryItem}
          onOpenPublishModal={() => setPublishModalOpen(true)}
        />

        {/* Simple Kimono Guide & Uploaded Pattern Poster */}
        <KimonoHeritageSection
          activePatternId={config.patternId}
          onSelectPatternFromGuide={(patternId: PatternId) => {
            setConfig((prev) => ({ ...prev, patternId }));
            showToast(
              `Now wearing the ${
                KIMONO_PATTERNS.find((p) => p.id === patternId)?.englishTitle || 'selected'
              } pattern!`
            );
            document.getElementById('design-studio')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (Natural Thumb Zone, < md only) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EBCAD7] grid grid-cols-5 items-center h-16 px-1"
      >
        <button
          type="button"
          onClick={() => {
            setStudioTab('design_colors');
            document.getElementById('design-studio')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center h-full ${
            studioTab === 'design_colors' ? 'text-[#C82846]' : 'text-[#6B4A56]'
          }`}
        >
          <Palette className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Colors</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setStudioTab('draw_upload');
            document.getElementById('design-studio')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center h-full ${
            studioTab === 'draw_upload' ? 'text-[#C82846]' : 'text-[#6B4A56]'
          }`}
        >
          <Brush className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Draw</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setStudioTab('ai_face');
            document.getElementById('design-studio')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center h-full ${
            studioTab === 'ai_face' ? 'text-[#C82846]' : 'text-[#6B4A56]'
          }`}
        >
          <UserCheck className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">AI Face</span>
        </button>

        <a
          href="#social-gallery"
          className="flex flex-col items-center justify-center h-full text-[#6B4A56] hover:text-[#C82846]"
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Gallery</span>
        </a>

        <a
          href="#kimono-heritage"
          className="flex flex-col items-center justify-center h-full text-[#6B4A56] hover:text-[#C82846]"
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Info</span>
        </a>
      </nav>

      {/* Share Online Modal */}
      {publishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border border-[#E8C5D2] bg-white p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#F2DCE4] pb-3">
              <h3 className="text-lg font-serif font-bold text-[#23181C]">
                Share Your Kimono to the Gallery
              </h3>
              <button
                type="button"
                onClick={() => setPublishModalOpen(false)}
                className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl text-[#6B4A56] hover:bg-[#FCECF0]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublishCreation} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#3D262E] mb-1">
                  Outfit Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Marin's Pink Sakura Kimono"
                  value={publishTitle}
                  onChange={(e) => setPublishTitle(e.target.value)}
                  className="w-full min-h-[44px] rounded-xl border border-[#D8A8BA] px-3.5 py-2 text-xs text-[#23181C] focus:outline-none focus:border-[#C82846]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D262E] mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={publishDesigner}
                  onChange={(e) => setPublishDesigner(e.target.value)}
                  className="w-full min-h-[44px] rounded-xl border border-[#D8A8BA] px-3.5 py-2 text-xs text-[#23181C] focus:outline-none focus:border-[#C82846]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D262E] mb-1">
                  Short Message
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell others what you love about this kimono design!"
                  value={publishNote}
                  onChange={(e) => setPublishNote(e.target.value)}
                  className="w-full rounded-xl border border-[#D8A8BA] px-3.5 py-2 text-xs text-[#23181C] focus:outline-none focus:border-[#C82846]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPublishModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-[#E2BDCB] text-xs font-semibold text-[#5C3A47] hover:bg-[#FCECF0] whitespace-nowrap shrink-0"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-[#C82846] hover:bg-[#A61C36] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
                >
                  {isPublishing ? 'Sharing...' : 'Share Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="border-t border-[#EBCAD7] bg-[#FFF5F8] py-6 px-6 text-xs text-[#6B4A56]">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <strong className="font-serif text-sm text-[#23181C]">
              Marin Sakura Kimono Dress-Up
            </strong>
            <span aria-hidden="true"> · </span>
            <span>Interactive Anime Kimono Game, Pattern Maker &amp; AI Face Swap</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#design-studio" className="hover:text-[#23181C] transition-colors">
              Dress-Up Studio
            </a>
            <a href="#social-gallery" className="hover:text-[#23181C] transition-colors">
              Social Gallery
            </a>
            <a href="#kimono-heritage" className="hover:text-[#23181C] transition-colors">
              Kimono Guide
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
