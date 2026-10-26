import React, { useState } from 'react';
import { Heart, Repeat, Share2, Sparkles } from 'lucide-react';
import { FABRIC_TEXTURES, KIMONO_PATTERNS } from '../data/kimonoData';
import { GalleryCreation, KimonoConfig } from '../types/kimono';
import { soundFX } from '../utils/soundEffects';

interface SocialGallerySectionProps {
  items: GalleryCreation[];
  onLike: (id: string) => void;
  onRemix: (creation: GalleryCreation) => void;
  onOpenPublishModal: () => void;
}

export const SocialGallerySection: React.FC<SocialGallerySectionProps> = ({
  items,
  onLike,
  onRemix,
  onOpenPublishModal,
}) => {
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getPatternLabel = (config: KimonoConfig) =>
    KIMONO_PATTERNS.find((p) => p.id === config.patternId)?.englishTitle || 'Cherry Blossom';

  const getFabricLabel = (config: KimonoConfig) =>
    FABRIC_TEXTURES.find((f) => f.id === config.fabricTexture)?.name || 'Soft Silk';

  const handleShareLink = (item: GalleryCreation) => {
    const shareText = `${item.title} by ${item.designerName} — Sakura Kimono Dress-Up (${window.location.href})`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).catch(() => {});
    }
    setCopiedId(item.id);
    soundFX.playKotoPluck(5);
    setTimeout(() => setCopiedId(null), 2200);
  };

  return (
    <section id="social-gallery" className="py-12 border-t border-[#EBCAD7]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-serif font-semibold text-[#23181C]">
              Social Fashion Gallery
            </h2>
            <p className="text-sm text-[#5C3A47] mt-1">
              See kimono outfits shared by other players! Click <strong>Try Outfit</strong> on any
              card to wear it on Marin.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenPublishModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C82846] hover:bg-[#A61C36] text-white text-xs font-medium transition-colors whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Share My Kimono Online</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => {
            const isLiked = Boolean(likedIds[item.id]);
            return (
              <article
                key={item.id}
                className="rounded-2xl border border-[#E8C5D2] bg-white overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5"
              >
                <div>
                  <div className="relative h-60 bg-gradient-to-b from-[#FFF5F8] to-[#FAD8E4] flex items-center justify-center p-4 border-b border-[#F2DCE4]">
                    {item.previewDataUrl ? (
                      <img
                        src={item.previewDataUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-auto object-contain rounded-lg"
                      />
                    ) : (
                      <svg
                        viewBox="0 0 200 240"
                        className="w-40 h-48 drop-shadow-xs"
                        aria-label={item.title}
                      >
                        <circle cx="100" cy="115" r="78" fill="#FFF9FB" opacity="0.75" />
                        <path
                          d="M66 58 L24 72 L28 168 Q32 178 46 176 L70 158 Z"
                          fill={item.config.sleeveColor}
                          stroke="#4A2C35"
                          strokeWidth="1.2"
                        />
                        <path
                          d="M134 58 L176 72 L172 168 Q168 178 154 176 L130 158 Z"
                          fill={item.config.sleeveColor}
                          stroke="#4A2C35"
                          strokeWidth="1.2"
                        />
                        <path
                          d="M66 58 L86 50 L114 50 L134 58 L138 218 Q100 226 62 218 Z"
                          fill={item.config.baseColor}
                          stroke="#4A2C35"
                          strokeWidth="1.2"
                        />
                        <path
                          d="M64 155 L136 155 L138 218 Q100 226 62 218 Z"
                          fill={item.config.hemGradientColor}
                          opacity="0.72"
                        />
                        <path
                          d="M84 50 L100 88 L116 50"
                          fill="none"
                          stroke={item.config.eriCollarColor}
                          strokeWidth="5"
                        />
                        <circle
                          cx="48"
                          cy="118"
                          r="9"
                          fill={item.config.patternPrimaryColor}
                          opacity="0.85"
                        />
                        <circle
                          cx="152"
                          cy="118"
                          r="9"
                          fill={item.config.patternPrimaryColor}
                          opacity="0.85"
                        />
                        <circle
                          cx="92"
                          cy="168"
                          r="11"
                          fill={item.config.patternPrimaryColor}
                          opacity="0.85"
                        />
                        <rect
                          x="65"
                          y="98"
                          width="70"
                          height="28"
                          rx="3"
                          fill={item.config.obiColor}
                          stroke="#D4AF37"
                          strokeWidth="1.2"
                        />
                        <line
                          x1="65"
                          y1="112"
                          x2="135"
                          y2="112"
                          stroke={item.config.obijimeColor}
                          strokeWidth="3.5"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h3 className="text-base font-serif font-semibold text-[#23181C] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#5C3A47] line-clamp-2">{item.inspirationNote}</p>
                    <div className="text-xs text-[#7A5462] pt-1">
                      <span>{getPatternLabel(item.config)}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{getFabricLabel(item.config)}</span>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 bg-[#FFF9FB] border-t border-[#F2DCE4] flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-[#3D262E] truncate">
                    {item.designerName}
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        if (!isLiked) {
                          setLikedIds((prev) => ({ ...prev, [item.id]: true }));
                          soundFX.playKotoPluck(2);
                          onLike(item.id);
                        }
                      }}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        isLiked
                          ? 'bg-[#FCECF0] text-[#C82846]'
                          : 'bg-white border border-[#E2BDCB] text-[#5C3A47] hover:text-[#C82846]'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#C82846]' : ''}`} />
                      <span className="font-mono tabular-nums">{item.likes}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playKotoPluck(4);
                        onRemix(item);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#23181C] hover:bg-[#3B2830] text-white text-xs font-medium transition-colors whitespace-nowrap shrink-0"
                    >
                      <Repeat className="w-3 h-3" />
                      <span>Try Outfit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShareLink(item)}
                      title="Copy link"
                      className="inline-flex items-center justify-center p-1.5 rounded-md border border-[#E2BDCB] bg-white hover:bg-[#FCECF0] text-[#5C3A47] text-xs transition-colors shrink-0"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {copiedId === item.id && (
                  <div className="bg-[#23181C] text-white text-[11px] text-center py-1">
                    Link copied!
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
