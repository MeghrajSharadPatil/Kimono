import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { KIMONO_ANATOMY, KIMONO_PATTERNS } from '../data/kimonoData';
import { PatternId } from '../types/kimono';
import { soundFX } from '../utils/soundEffects';

interface KimonoHeritageSectionProps {
  activePatternId: PatternId;
  onSelectPatternFromGuide: (patternId: PatternId) => void;
}

export const KimonoHeritageSection: React.FC<KimonoHeritageSectionProps> = ({
  activePatternId,
  onSelectPatternFromGuide,
}) => {
  const [selectedAnatomyId, setSelectedAnatomyId] = useState<string>('eri');
  const activeAnatomy =
    KIMONO_ANATOMY.find((a) => a.id === selectedAnatomyId) || KIMONO_ANATOMY[0];

  const posterMotifs = KIMONO_PATTERNS.filter((p) =>
    ['sakura', 'tsuru', 'nami', 'sakura_nami_ribbon'].includes(p.id)
  );

  return (
    <section id="kimono-heritage" className="py-12 border-t border-[#EBCAD7] bg-[#FFF6F9]">
      <div className="max-w-[1200px] mx-auto px-6 space-y-10">
        {/* Simple Section Title */}
        <div className="max-w-2xl">
          <h2 className="text-3xl font-serif font-semibold text-[#23181C]">
            About the Kimono &amp; Beautiful Patterns
          </h2>
          <p className="text-sm text-[#5C3A47] mt-1.5 leading-relaxed">
            A <strong>Kimono</strong> is Japan’s traditional dress. Each pattern on a kimono tells a
            special story about nature, seasons, and good luck. Click any pattern below to put it
            right onto Marin’s kimono!
          </p>
        </div>

        {/* Part 1: The Uploaded "Beautiful Kimono Patterns" Poster + Simple Pattern Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 rounded-2xl border-2 border-[#E66C96] washi-poster-frame p-4 flex flex-col justify-between">
            <div className="rounded-xl overflow-hidden border border-[#F0B8CC] bg-white">
              <img
                src="/assets/aistudio/Beautiful_Kimono_Patterns_Poster_384006d1.png"
                alt="Beautiful Kimono Patterns Poster: Sakura (Cherry blossom), Tsuru (Crane), Nami (Waves)"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain block"
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-xs text-[#5C3A47]">
                Patterns represent nature, good fortune, and seasonal themes.
              </span>
              <button
                type="button"
                onClick={() => {
                  soundFX.playSakuraFanfare();
                  onSelectPatternFromGuide('sakura_nami_ribbon');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#C82846] hover:bg-[#A61C36] text-white text-xs font-medium transition-colors whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Wear Poster Ribbon Pattern</span>
              </button>
            </div>
          </div>

          {/* Simple Pattern Meaning Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            {posterMotifs.map((motif) => {
              const isSelected = activePatternId === motif.id;
              return (
                <div
                  key={motif.id}
                  className={`rounded-xl border p-4 transition-colors ${
                    isSelected
                      ? 'border-[#C82846] bg-white'
                      : 'border-[#E8C5D2] bg-white/90 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-[#23181C]">
                        <span className="text-[#C82846]">{motif.japaneseKana}</span> —{' '}
                        {motif.romaji} ({motif.englishTitle})
                      </div>
                      <p className="text-xs font-medium text-[#8E244D] mt-0.5">
                        Meaning: {motif.meaning}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playKotoPluck(2);
                        onSelectPatternFromGuide(motif.id);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        isSelected
                          ? 'bg-[#C82846] text-white'
                          : 'bg-[#FCECF0] text-[#5C3A47] hover:bg-[#F5D0DD]'
                      }`}
                    >
                      {isSelected ? 'Wearing Now' : 'Wear Pattern'}
                    </button>
                  </div>

                  <p className="text-xs text-[#4D303A] mt-2 leading-relaxed">
                    {motif.culturalHistory}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Part 2: Simple 4-Part Guide to How a Kimono Works */}
        <div className="rounded-2xl border border-[#E8C5D2] bg-white p-6">
          <div className="mb-4">
            <h3 className="text-xl font-serif font-semibold text-[#23181C]">
              4 Main Parts of a Kimono (Click to Learn)
            </h3>
            <p className="text-xs text-[#6B4A56]">
              A kimono is made from straight pieces of silk and tied with a wide belt—no buttons or
              zippers needed!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {KIMONO_ANATOMY.map((part, idx) => {
              const isSelected = selectedAnatomyId === part.id;
              return (
                <button
                  key={part.id}
                  type="button"
                  onClick={() => {
                    soundFX.playKotoPluck(idx);
                    setSelectedAnatomyId(part.id);
                  }}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    isSelected
                      ? 'border-[#C82846] bg-[#FFF5F8]'
                      : 'border-[#E8C5D2] bg-[#FFFBFD] hover:bg-white'
                  }`}
                >
                  <div className="text-sm font-semibold text-[#23181C]">
                    {idx + 1}. {part.name}
                  </div>
                  <p className="text-xs text-[#5C3A47] mt-1.5 leading-relaxed">{part.summary}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl bg-[#FFF5F8] border border-[#EDD2DC] p-3.5 text-xs text-[#3D262E]">
            <strong>Fun Tip ({activeAnatomy.name}): </strong>
            {activeAnatomy.etiquetteTip}
          </div>
        </div>
      </div>
    </section>
  );
};
