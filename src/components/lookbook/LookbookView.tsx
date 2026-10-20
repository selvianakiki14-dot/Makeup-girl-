import React, { useState } from 'react';
import { MakeupLook, MakeupState } from '../../types/makeup';
import { CURATED_LOOKS } from '../../data/makeupData';
import { Sparkles, ArrowRight, Heart, Check, Filter, Layers, Flame } from 'lucide-react';

interface LookbookViewProps {
  onApplyLook: (look: MakeupLook) => void;
  lang: 'id' | 'en';
}

export const LookbookView: React.FC<LookbookViewProps> = ({ onApplyLook, lang }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedLook, setSelectedLook] = useState<MakeupLook | null>(null);

  const categories = [
    { id: 'all', label: lang === 'id' ? 'Semua Tren' : 'All Looks' },
    { id: 'natural', label: lang === 'id' ? 'Natural / No-Makeup' : 'Natural' },
    { id: 'korean', label: lang === 'id' ? 'K-Beauty / Douyin' : 'K-Beauty' },
    { id: 'glam', label: lang === 'id' ? 'Glamour & Sunset' : 'Glamour' },
    { id: 'vintage', label: lang === 'id' ? 'Vintage Klasik' : 'Vintage' },
    { id: 'wedding', label: lang === 'id' ? 'Kondangan & Bridal' : 'Bridal / Party' },
  ];

  const filteredLooks =
    activeCategory === 'all'
      ? CURATED_LOOKS
      : CURATED_LOOKS.filter((l) => l.category === activeCategory);

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-4">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden bg-gradient-to-r from-rose-950/60 via-purple-950/40 to-stone-900 border border-rose-900/30 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'id' ? 'Koleksi Lookbook Eksklusif' : 'Exclusive Curated Lookbook'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-white mb-2 leading-tight">
            {lang === 'id' ? 'Inspirasi Gaya Riasan Tren Terkini' : 'Trending Makeup Inspirations'}
          </h2>
          <p className="text-sm sm:text-base text-zinc-300">
            {lang === 'id'
              ? 'Temukan berbagai formula riasan yang dikurasi oleh pakar kecantikan. Klik sekali untuk langsung mencoba tampilan di Studio Virtual dan sesuaikan dengan warna kulit Anda.'
              : 'Discover curated beauty aesthetics. Apply any signature style directly to the Virtual Studio with one click.'}
          </p>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeCategory === c.id
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-950/50'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Looks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLooks.map((look) => (
          <div
            key={look.id}
            className="group flex flex-col rounded-2xl bg-[#1a131c] border border-rose-950/40 overflow-hidden shadow-xl hover:border-rose-500/50 transition duration-300"
          >
            {/* Aesthetic Top Palette Banner */}
            <div className={`h-24 p-4 flex flex-col justify-between bg-gradient-to-r ${look.bannerGradient} relative overflow-hidden`}>
              <div className="flex items-center justify-between z-10">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur">
                  {look.badge}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/70 text-stone-900 backdrop-blur capitalize">
                  {look.category}
                </span>
              </div>

              {/* Color Swatch Dots previewing the look */}
              <div className="flex items-center gap-1.5 z-10 bg-black/50 p-1.5 rounded-full w-fit backdrop-blur border border-white/20">
                <div
                  className="w-4 h-4 rounded-full border border-white/50"
                  style={{ backgroundColor: look.state.lips.color }}
                  title="Lips"
                />
                <div
                  className="w-4 h-4 rounded-full border border-white/50"
                  style={{ backgroundColor: look.state.blush.color }}
                  title="Blush"
                />
                <div
                  className="w-4 h-4 rounded-full border border-white/50"
                  style={{ backgroundColor: look.state.eyes.primaryColor }}
                  title="Eyeshadow"
                />
                <div
                  className="w-4 h-4 rounded-full border border-white/50"
                  style={{ backgroundColor: look.state.face.highlighterColor }}
                  title="Highlighter"
                />
              </div>
            </div>

            {/* Look Information */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-lg font-bold font-display text-white group-hover:text-rose-300 transition">
                  {lang === 'id' ? look.titleId : look.title}
                </h3>
                <p className="text-xs text-rose-400 font-medium mt-0.5">{look.tagline}</p>
                <p className="text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                  {lang === 'id' ? look.descriptionId : look.description}
                </p>
              </div>

              {/* Technique Breakdown Tags */}
              <div className="flex flex-wrap gap-1.5">
                {look.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 text-zinc-300 border border-white/10"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-rose-950/40 flex items-center justify-between gap-2">
                <button
                  onClick={() => onApplyLook(look)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white shadow-lg shadow-rose-950/60 hover:brightness-110 active:scale-95 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'id' ? 'Coba Riasan Ini' : 'Apply This Look'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
