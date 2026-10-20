import React, { useState } from 'react';
import {
  FaceModel,
  MakeupState,
  LipFinish,
  BlushStyle,
  EyeshadowStyle,
  EyelinerStyle,
  MascaraStyle,
  BrowStyle,
  SkinFinish,
  CoverageLevel,
} from '../../types/makeup';
import {
  FACE_MODELS,
  LIP_SWATCHES,
  BLUSH_SWATCHES,
  EYESHADOW_PALETTES,
  EYELINER_SWATCHES,
  BROW_SWATCHES,
  HIGHLIGHTER_SWATCHES,
  FOUNDATION_SHADES,
} from '../../data/makeupData';
import {
  Sparkles,
  Palette,
  Eye,
  Smile,
  Users,
  Dices,
  RotateCcw,
  Check,
  Flame,
  Layers,
} from 'lucide-react';

interface MakeupControlsProps {
  model: FaceModel;
  onSelectModel: (m: FaceModel) => void;
  makeup: MakeupState;
  onChangeMakeup: (updater: (prev: MakeupState) => MakeupState) => void;
  onRandomize: () => void;
  onReset: () => void;
  lang: 'id' | 'en';
}

export const MakeupControls: React.FC<MakeupControlsProps> = ({
  model,
  onSelectModel,
  makeup,
  onChangeMakeup,
  onRandomize,
  onReset,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'lips' | 'eyes' | 'face' | 'models'>('lips');

  return (
    <div className="flex flex-col h-full bg-[#18121a] rounded-2xl border border-rose-950/40 overflow-hidden shadow-xl">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between p-2 bg-[#120d14] border-b border-rose-950/40 gap-1 overflow-x-auto">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('lips')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'lips'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <span className="text-sm">💄</span>
            <span>{lang === 'id' ? 'Bibir' : 'Lips'}</span>
          </button>

          <button
            onClick={() => setActiveTab('eyes')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'eyes'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{lang === 'id' ? 'Mata' : 'Eyes'}</span>
          </button>

          <button
            onClick={() => setActiveTab('face')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'face'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            <span>{lang === 'id' ? 'Wajah & Pipi' : 'Face & Cheeks'}</span>
          </button>

          <button
            onClick={() => setActiveTab('models')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'models'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{lang === 'id' ? 'Model' : 'Models'}</span>
          </button>
        </div>

        {/* Quick Fun Actions */}
        <div className="flex items-center gap-1 pl-2 border-l border-zinc-800">
          <button
            onClick={onRandomize}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 active:scale-95 transition"
            title={lang === 'id' ? 'Acak Kombinasi Riasan' : 'Randomize makeup'}
          >
            <Dices className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'id' ? 'Acak' : 'Random'}</span>
          </button>
        </div>
      </div>

      {/* Tab Contents Scrollable Panel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-zinc-300 custom-scrollbar">
        {/* ===================== TAB 1: LIPS ===================== */}
        {activeTab === 'lips' && (
          <div className="space-y-6">
            {/* Finish Style Selector */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-rose-300 mb-2.5 block">
                {lang === 'id' ? 'Tipe Tekstur / Finish' : 'Lip Finish'}
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { id: 'matte', label: 'Matte', emoji: '☁️' },
                  { id: 'glossy', label: 'Glass Gloss', emoji: '✨' },
                  { id: 'ombre', label: 'Ombre K-Lip', emoji: '🌸' },
                  { id: 'satin', label: 'Satin', emoji: '💎' },
                  { id: 'metallic', label: 'Metallic', emoji: '🌟' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      onChangeMakeup((prev) => ({
                        ...prev,
                        lips: { ...prev.lips, finish: item.id as LipFinish },
                      }))
                    }
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-medium border transition ${
                      makeup.lips.finish === item.id
                        ? 'bg-rose-600/30 border-rose-500 text-rose-200 font-bold shadow-sm'
                        : 'bg-black/20 border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-base mb-0.5">{item.emoji}</span>
                    <span className="truncate w-full text-center">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Swatches Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-rose-300">
                  {lang === 'id' ? 'Warna Lipstik' : 'Lipstick Shade'}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={makeup.lips.color}
                    onChange={(e) =>
                      onChangeMakeup((prev) => ({
                        ...prev,
                        lips: { ...prev.lips, color: e.target.value },
                      }))
                    }
                    className="w-5 h-5 rounded-md cursor-pointer border border-white/20 bg-transparent p-0"
                  />
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">
                    {makeup.lips.color}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {LIP_SWATCHES.map((swatch) => {
                  const isSelected = makeup.lips.color.toLowerCase() === swatch.hex.toLowerCase();
                  return (
                    <button
                      key={swatch.name}
                      onClick={() =>
                        onChangeMakeup((prev) => ({
                          ...prev,
                          lips: {
                            ...prev.lips,
                            color: swatch.hex,
                            ombreInnerColor:
                              prev.lips.finish === 'ombre' ? swatch.hex : prev.lips.ombreInnerColor,
                          },
                        }))
                      }
                      className={`group relative flex flex-col items-center p-1.5 rounded-xl border transition ${
                        isSelected
                          ? 'border-rose-400 bg-rose-950/40 ring-2 ring-rose-400/30'
                          : 'border-white/5 bg-black/20 hover:border-white/20'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-full shadow-inner flex items-center justify-center transition group-hover:scale-105"
                        style={{ backgroundColor: swatch.hex }}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                      </div>
                      <span className="text-[10px] mt-1 text-center font-medium truncate w-full text-zinc-300">
                        {swatch.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ombre Inner Color Swatch (If finish is ombre) */}
            {makeup.lips.finish === 'ombre' && (
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-rose-200">
                    {lang === 'id' ? 'Warna Gradasi Bagian Dalam (Inner Lip)' : 'Inner Ombre Tone'}
                  </span>
                  <input
                    type="color"
                    value={makeup.lips.ombreInnerColor || '#8c0f26'}
                    onChange={(e) =>
                      onChangeMakeup((prev) => ({
                        ...prev,
                        lips: { ...prev.lips, ombreInnerColor: e.target.value },
                      }))
                    }
                    className="w-5 h-5 rounded-md cursor-pointer border border-white/20 bg-transparent p-0"
                  />
                </div>
                <p className="text-[11px] text-rose-300/80">
                  {lang === 'id'
                    ? 'Warna lebih pekat di bagian dalam bibir untuk efek gradient khas K-Beauty'
                    : 'Deeper tone focused in the inner center of the lips'}
                </p>
              </div>
            )}

            {/* Sliders: Intensity & Gloss */}
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-zinc-300">{lang === 'id' ? 'Ketebalan / Intensitas Warna' : 'Opacity & Intensity'}</span>
                  <span className="text-rose-400 font-mono">{makeup.lips.intensity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={makeup.lips.intensity}
                  onChange={(e) =>
                    onChangeMakeup((prev) => ({
                      ...prev,
                      lips: { ...prev.lips, intensity: Number(e.target.value) },
                    }))
                  }
                  className="w-full h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-zinc-300">{lang === 'id' ? 'Kilau Kaca / Gloss Highlight' : 'Gloss & Shine Specular'}</span>
                  <span className="text-rose-400 font-mono">{makeup.lips.glossHighlight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={makeup.lips.glossHighlight}
                  onChange={(e) =>
                    onChangeMakeup((prev) => ({
                      ...prev,
                      lips: { ...prev.lips, glossHighlight: Number(e.target.value) },
                    }))
                  }
                  className="w-full h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Lip Liner Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="lipLinerToggle"
                    checked={makeup.lips.lipLiner}
                    onChange={(e) =>
                      onChangeMakeup((prev) => ({
                        ...prev,
                        lips: { ...prev.lips, lipLiner: e.target.checked },
                      }))
                    }
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-zinc-800 border-zinc-700"
                  />
                  <label htmlFor="lipLinerToggle" className="text-xs font-semibold cursor-pointer text-zinc-200">
                    {lang === 'id' ? 'Garis Bibir (Lip Liner)' : 'Defined Lip Liner'}
                  </label>
                </div>
                {makeup.lips.lipLiner && (
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={makeup.lips.linerColor}
                      onChange={(e) =>
                        onChangeMakeup((prev) => ({
                          ...prev,
                          lips: { ...prev.lips, linerColor: e.target.value },
                        }))
                      }
                      className="w-5 h-5 rounded-md cursor-pointer border border-white/20 bg-transparent p-0"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: EYES ===================== */}
        {activeTab === 'eyes' && (
          <div className="space-y-6">
            {/* Eyeshadow Style */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-rose-300 mb-2 block">
                {lang === 'id' ? 'Gaya Eyeshadow' : 'Eyeshadow Technique'}
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { id: 'single', label: 'Single', desc: 'Sederhana' },
                  { id: 'duo', label: 'Duo', desc: 'Gradasi 2 warna' },
                  { id: 'smokey', label: 'Smokey', desc: 'Pekat dramatis' },
                  { id: 'halo', label: 'Halo Eye', desc: 'Kilau tengah' },
                  { id: 'cutcrease', label: 'Cut Crease', desc: 'Tegas tajam' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      onChangeMakeup((prev) => ({
                        ...prev,
                        eyes: { ...prev.eyes, eyeshadowStyle: item.id as EyeshadowStyle },
                      }))
                    }
                    className={`p-2 rounded-xl text-center border transition ${
                      makeup.eyes.eyeshadowStyle === item.id
                        ? 'bg-rose-600/30 border-rose-500 text-rose-200 font-bold'
                        : 'bg-black/20 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xs block font-semibold">{item.label}</span>
                    <span className="text-[9px] text-zinc-500 block truncate">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Eyeshadow Palette Swatches */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-rose-300 mb-2 block">
                {lang === 'id' ? 'Koleksi Palet Eyeshadow' : 'Eyeshadow Palettes'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {EYESHADOW_PALETTES.map((palette) => (
                  <button
                    key={palette.name}
                    onClick={() =>
                      onChangeMakeup((prev) => ({
                        ...prev,
                        eyes: {
                          ...prev.eyes,
                          primaryColor: palette.primary,
                          secondaryColor: palette.secondary,
                          shimmerColor: palette.shimmer,
                        },
                      }))
                    }
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1.5 ${
                      makeup.eyes.primaryColor === palette.primary
                        ? 'border-rose-400 bg-rose-950/40 ring-1 ring-rose-400/40'
                        : 'border-white/5 bg-black/20 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full shadow" style={{ backgroundColor: palette.primary }} />
                      <div className="w-5 h-5 rounded-full shadow" style={{ backgroundColor: palette.secondary }} />
                      <div className="w-5 h-5 rounded-full shadow" style={{ backgroundColor: palette.shimmer }} />
                    </div>
                    <span className="text-xs font-semibold text-zinc-200 truncate">{palette.name}</span>
                    <span className="text-[10px] text-zinc-400 line-clamp-1">{palette.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Eyeshadow Intensity Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-zinc-300">{lang === 'id' ? 'Intensitas Eyeshadow' : 'Eyeshadow Pigment'}</span>
                <span className="text-rose-400 font-mono">{makeup.eyes.intensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={makeup.eyes.intensity}
                onChange={(e) =>
                  onChangeMakeup((prev) => ({
                    ...prev,
                    eyes: { ...prev.eyes, intensity: Number(e.target.value) },
                  }))
                }
                className="w-full h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Eyeliner Style & Thickness */}
            <div className="space-y-3 pt-2 border-t border-zinc-800">
              <label className="text-xs font-semibold uppercase tracking-wider text-rose-300 block">
                {lang === 'id' ? 'Eyeliner' : 'Eyeliner Design'}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {[
                  { id: 'none', label: 'None' },
                  { id: 'winged', label: 'Winged' },
                  { id: 'cat', label: 'Cat Eye' },
                  { id: 'puppy', label: 'Puppy' },
                  { id: 'tightline', label: 'Tightline' },
                  { id: 'graphic', label: 'Graphic' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      onChangeMakeup((prev) => ({
                        ...prev,
                        eyes: { ...prev.eyes, eyelinerStyle: item.id as EyelinerStyle },
                      }))
                    }
                    className={`py-1.5 px-2 rounded-xl text-center text-xs border transition ${
                      makeup.eyes.eyelinerStyle === item.id
                        ? 'bg-rose-600/30 border-rose-500 text-rose-200 font-bold'
                        : 'bg-black/20 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {makeup.eyes.eyelinerStyle !== 'none' && (
                <div className="flex items-center justify-between gap-4 pt-1">
                  <div className="flex items-center gap-1.5">
                    {EYELINER_SWATCHES.map((swatch) => (
                      <button
                        key={swatch.name}
                        onClick={() =>
                          onChangeMakeup((prev) => ({
                            ...prev,
                            eyes: { ...prev.eyes, eyelinerColor: swatch.hex },
                          }))
                        }
                        className={`w-6 h-6 rounded-full border ${
                          makeup.eyes.eyelinerColor === swatch.hex ? 'ring-2 ring-rose-400' : 'border-white/20'
                        }`}
                        style={{ backgroundColor: swatch.hex }}
                        title={swatch.name}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-400">{lang === 'id' ? 'Ketebalan:' : 'Thickness:'}</span>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      value={makeup.eyes.eyelinerThickness}
                      onChange={(e) =>
                        onChangeMakeup((prev) => ({
                          ...prev,
                          eyes: { ...prev.eyes, eyelinerThickness: Number(e.target.value) },
                        }))
                      }
                      className="w-20 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Lashes & Mascara */}
            <div className="space-y-3 pt-2 border-t border-zinc-800">
              <label className="text-xs font-semibold uppercase tracking-wider text-rose-300 block">
                {lang === 'id' ? 'Bulu Mata (Lashes)' : 'Mascara & Lashes'}
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'natural', label: 'Natural Wispy' },
                  { id: 'volume', label: 'Dramatic Volume' },
                  { id: 'doll', label: 'Manga / Doll' },
                  { id: 'wispy', label: 'Cat Flutter' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      onChangeMakeup((prev) => ({
                        ...prev,
                        eyes: { ...prev.eyes, mascaraStyle: item.id as MascaraStyle },
                      }))
                    }
                    className={`py-1.5 px-2 rounded-xl text-center text-xs border transition ${
                      makeup.eyes.mascaraStyle === item.id
                        ? 'bg-rose-600/30 border-rose-500 text-rose-200 font-bold'
                        : 'bg-black/20 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Eyebrows */}
            <div className="space-y-3 pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-rose-300 block">
                  {lang === 'id' ? 'Bentuk & Warna Alis' : 'Eyebrows'}
                </label>
                <div className="flex items-center gap-1.5">
                  {BROW_SWATCHES.map((swatch) => (
                    <button
                      key={swatch.name}
                      onClick={() =>
                        onChangeMakeup((prev) => ({
                          ...prev,
                          eyes: { ...prev.eyes, browColor: swatch.hex },
                        }))
                      }
                      className={`w-4 h-4 rounded-full border ${
                        makeup.eyes.browColor === swatch.hex ? 'ring-2 ring-rose-400' : 'border-white/20'
                      }`}
                      style={{ backgroundColor: swatch.hex }}
                      title={swatch.name}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'feathered', label: 'Feathered' },
                  { id: 'defined', label: 'Defined Arch' },
                  { id: 'straight', label: 'Korean Straight' },
                  { id: 'natural', label: 'Natural Soft' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      onChangeMakeup((prev) => ({
                        ...prev,
                        eyes: { ...prev.eyes, browStyle: item.id as BrowStyle },
                      }))
                    }
                    className={`py-1.5 px-2 rounded-xl text-center text-xs border transition ${
                      makeup.eyes.browStyle === item.id
                        ? 'bg-rose-600/30 border-rose-500 text-rose-200 font-bold'
                        : 'bg-black/20 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: FACE & CHEEKS ===================== */}
        {activeTab === 'face' && (
          <div className="space-y-6">
            {/* Foundation / Complexion Tint */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-rose-300">
                  {lang === 'id' ? 'Complexion / Foundation' : 'Foundation Tone'}
                </label>
                <span className="text-[11px] text-zinc-400">
                  {makeup.face.finish.toUpperCase()} • {makeup.face.coverage.toUpperCase()}
                </span>
              </div>

              {/* Foundation Shade Swatches */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 mb-3">
                {FOUNDATION_SHADES.map((shade) => (
                  <button
                    key={shade.name}
                    onClick={() =>
                      onChangeMakeup((prev) => ({
                        ...prev,
                        face: { ...prev.face, foundationTone: shade.hex },
                      }))
                    }
                    className={`group flex flex-col items-center p-1.5 rounded-xl border transition ${
                      makeup.face.foundationTone === shade.hex
                        ? 'border-rose-400 bg-rose-950/40 ring-1 ring-rose-400'
                        : 'border-white/5 bg-black/20 hover:border-white/20'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full shadow" style={{ backgroundColor: shade.hex }} />
                    <span className="text-[8px] mt-1 text-center font-mono text-zinc-300 truncate w-full">
                      {shade.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Finish Toggles */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'dewy', label: 'Dewy Glow', icon: '💧' },
                  { id: 'satin', label: 'Satin Velvet', icon: '✨' },
                  { id: 'matte', label: 'Poreless Matte', icon: '☁️' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      onChangeMakeup((prev) => ({
                        ...prev,
                        face: { ...prev.face, finish: item.id as SkinFinish },
                      }))
                    }
                    className={`py-1.5 px-2 rounded-xl text-xs border text-center transition ${
                      makeup.face.finish === item.id
                        ? 'bg-rose-600/30 border-rose-500 text-rose-200 font-bold'
                        : 'bg-black/20 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="mr-1">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Blush Placement Style */}
            <div className="space-y-3 pt-2 border-t border-zinc-800">
              <label className="text-xs font-semibold uppercase tracking-wider text-rose-300 block">
                {lang === 'id' ? 'Area Penempatan Blush On' : 'Blush Placement Style'}
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { id: 'apples', label: 'Apples', desc: 'Pipi bulat segar' },
                  { id: 'draped', label: 'Draped', desc: 'Tulang pipi tinggi' },
                  { id: 'sunkissed', label: 'Sunkissed', desc: 'Menyebrang hidung' },
                  { id: 'undereye', label: 'Under-Eye', desc: 'K-Beauty idol' },
                  { id: 'temple', label: 'Temples', desc: 'Menuju pelipis' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      onChangeMakeup((prev) => ({
                        ...prev,
                        blush: { ...prev.blush, style: item.id as BlushStyle },
                      }))
                    }
                    className={`p-1.5 rounded-xl text-center border transition ${
                      makeup.blush.style === item.id
                        ? 'bg-rose-600/30 border-rose-500 text-rose-200 font-bold'
                        : 'bg-black/20 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xs block font-semibold">{item.label}</span>
                    <span className="text-[9px] text-zinc-500 block truncate">{item.desc}</span>
                  </button>
                ))}
              </div>

              {/* Blush Swatches */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1">
                {BLUSH_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.name}
                    onClick={() =>
                      onChangeMakeup((prev) => ({
                        ...prev,
                        blush: { ...prev.blush, color: swatch.hex },
                      }))
                    }
                    className={`group flex flex-col items-center p-1.5 rounded-xl border transition ${
                      makeup.blush.color.toLowerCase() === swatch.hex.toLowerCase()
                        ? 'border-rose-400 bg-rose-950/40 ring-1 ring-rose-400'
                        : 'border-white/5 bg-black/20 hover:border-white/20'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full shadow" style={{ backgroundColor: swatch.hex }} />
                    <span className="text-[9px] mt-1 text-center font-medium text-zinc-300 truncate w-full">
                      {swatch.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Blush Intensity Slider */}
              <div className="pt-1">
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-zinc-300">{lang === 'id' ? 'Intensitas Blush On' : 'Blush Intensity'}</span>
                  <span className="text-rose-400 font-mono">{makeup.blush.intensity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={makeup.blush.intensity}
                  onChange={(e) =>
                    onChangeMakeup((prev) => ({
                      ...prev,
                      blush: { ...prev.blush, intensity: Number(e.target.value) },
                    }))
                  }
                  className="w-full h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Contour & Bronzer */}
            <div className="space-y-3 pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-rose-300 block">
                  {lang === 'id' ? 'Kontur & Shading Rahang' : 'Contour & Sculpting'}
                </label>
                <span className="text-rose-400 font-mono text-xs">{makeup.face.contourIntensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={makeup.face.contourIntensity}
                onChange={(e) =>
                  onChangeMakeup((prev) => ({
                    ...prev,
                    face: { ...prev.face, contourIntensity: Number(e.target.value) },
                  }))
                }
                className="w-full h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Highlighter & Glow */}
            <div className="space-y-3 pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-rose-300 block">
                  {lang === 'id' ? 'Highlighter & Kilau Cahaya' : 'Highlighter Gleam'}
                </label>
                <div className="flex items-center gap-1.5">
                  {HIGHLIGHTER_SWATCHES.map((swatch) => (
                    <button
                      key={swatch.name}
                      onClick={() =>
                        onChangeMakeup((prev) => ({
                          ...prev,
                          face: { ...prev.face, highlighterColor: swatch.hex },
                        }))
                      }
                      className={`w-5 h-5 rounded-full border ${
                        makeup.face.highlighterColor === swatch.hex ? 'ring-2 ring-rose-400' : 'border-white/20'
                      }`}
                      style={{ backgroundColor: swatch.hex }}
                      title={swatch.name}
                    />
                  ))}
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={makeup.face.highlighterIntensity}
                onChange={(e) =>
                  onChangeMakeup((prev) => ({
                    ...prev,
                    face: { ...prev.face, highlighterIntensity: Number(e.target.value) },
                  }))
                }
                className="w-full h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Faux Freckles Slider */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-rose-300 block">
                  {lang === 'id' ? 'Bintik Alami (Faux Freckles)' : 'Faux Freckles Accent'}
                </label>
                <span className="text-rose-400 font-mono text-xs">{makeup.face.freckles}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={makeup.face.freckles}
                onChange={(e) =>
                  onChangeMakeup((prev) => ({
                    ...prev,
                    face: { ...prev.face, freckles: Number(e.target.value) },
                  }))
                }
                className="w-full h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* ===================== TAB 4: MODELS ===================== */}
        {activeTab === 'models' && (
          <div className="space-y-4">
            <div className="text-xs text-zinc-400">
              {lang === 'id'
                ? 'Pilih model wajah virtual dengan berbagai warna kulit & undertone untuk menguji tampilan riasan:'
                : 'Select a face model with different skin tones & undertones to test your look:'}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FACE_MODELS.map((item) => {
                const isSelected = item.id === model.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectModel(item)}
                    className={`flex items-start gap-3 p-3 rounded-2xl border text-left transition ${
                      isSelected
                        ? 'border-rose-500 bg-rose-950/40 ring-2 ring-rose-500/40'
                        : 'border-white/5 bg-black/20 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-stone-900 shadow-md shrink-0 border border-white/20"
                      style={{ backgroundColor: item.skinHex }}
                    >
                      {item.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm font-bold text-white">{item.name}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            item.undertone === 'warm'
                              ? 'bg-amber-900/60 text-amber-300 border border-amber-700/50'
                              : item.undertone === 'cool'
                              ? 'bg-blue-900/60 text-blue-300 border border-blue-700/50'
                              : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                          }`}
                        >
                          {item.undertone}
                        </span>
                      </div>
                      <div className="text-xs text-rose-300 font-medium truncate mt-0.5">
                        {item.skinToneName}
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Strip */}
      <div className="p-3 bg-[#110d13] border-t border-rose-950/40 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">{lang === 'id' ? 'Sedang Dipakai:' : 'Active:'}</span>
          <span className="w-3 h-3 rounded-full border border-white/30" style={{ backgroundColor: makeup.lips.color }} />
          <span className="w-3 h-3 rounded-full border border-white/30" style={{ backgroundColor: makeup.blush.color }} />
          <span className="w-3 h-3 rounded-full border border-white/30" style={{ backgroundColor: makeup.eyes.primaryColor }} />
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-zinc-400 hover:text-rose-300 text-xs transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{lang === 'id' ? 'Reset' : 'Reset'}</span>
        </button>
      </div>
    </div>
  );
};
