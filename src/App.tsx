import React, { useState } from 'react';
import { FaceCanvas } from './components/studio/FaceCanvas';
import { MakeupControls } from './components/studio/MakeupControls';
import { LookbookView } from './components/lookbook/LookbookView';
import { PersonalColorQuiz } from './components/personal-color/PersonalColorQuiz';
import { TutorialGuide } from './components/tutorials/TutorialGuide';
import { VanityOrganizer } from './components/vanity/VanityOrganizer';
import { BeautyAdvisorModal } from './components/advisor/BeautyAdvisorModal';
import {
  INITIAL_MAKEUP_STATE,
  FACE_MODELS,
  LIP_SWATCHES,
  BLUSH_SWATCHES,
  EYESHADOW_PALETTES,
} from './data/makeupData';
import {
  FaceModel,
  MakeupLook,
  MakeupState,
  PersonalColorResult,
} from './types/makeup';
import {
  Sparkles,
  Palette,
  BookOpen,
  ShoppingBag,
  Sliders,
  Bot,
  Globe,
  Layers,
  Heart,
  Wand2,
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [activeView, setActiveView] = useState<'studio' | 'lookbook' | 'personal-color' | 'tutorials' | 'vanity'>('studio');
  const [selectedModel, setSelectedModel] = useState<FaceModel>(FACE_MODELS[2]); // Default Aisyah
  const [makeup, setMakeup] = useState<MakeupState>(INITIAL_MAKEUP_STATE);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Reset makeup
  const handleResetMakeup = () => {
    setMakeup(INITIAL_MAKEUP_STATE);
    showToast(lang === 'id' ? 'Riasan telah di-reset ke awal.' : 'Makeup reset to default.');
  };

  // Randomize makeup combination
  const handleRandomizeMakeup = () => {
    const randomLip = LIP_SWATCHES[Math.floor(Math.random() * LIP_SWATCHES.length)];
    const randomBlush = BLUSH_SWATCHES[Math.floor(Math.random() * BLUSH_SWATCHES.length)];
    const randomPalette = EYESHADOW_PALETTES[Math.floor(Math.random() * EYESHADOW_PALETTES.length)];
    const finishes: any[] = ['matte', 'glossy', 'ombre', 'satin'];
    const randomFinish = finishes[Math.floor(Math.random() * finishes.length)];

    setMakeup((prev) => ({
      ...prev,
      lips: {
        ...prev.lips,
        color: randomLip.hex,
        finish: randomFinish,
        intensity: Math.floor(Math.random() * 30) + 70,
        glossHighlight: randomFinish === 'glossy' ? 80 : 35,
        ombreInnerColor: '#8c0f26',
      },
      blush: {
        ...prev.blush,
        color: randomBlush.hex,
        intensity: Math.floor(Math.random() * 30) + 45,
      },
      eyes: {
        ...prev.eyes,
        primaryColor: randomPalette.primary,
        secondaryColor: randomPalette.secondary,
        shimmerColor: randomPalette.shimmer,
        intensity: Math.floor(Math.random() * 30) + 55,
      },
    }));

    showToast(
      lang === 'id'
        ? 'Kombinasi riasan baru berhasil diracik secara acak! ✨'
        : 'Random look generated! ✨'
    );
  };

  // Apply look from Lookbook
  const handleApplyLook = (look: MakeupLook) => {
    setMakeup({ ...look.state });
    setActiveView('studio');
    showToast(
      lang === 'id'
        ? `Tampilan "${look.titleId}" berhasil diterapkan ke Studio!`
        : `Look "${look.title}" applied to Studio!`
    );
  };

  // Apply personal color palette
  const handleApplyPersonalColor = (result: PersonalColorResult) => {
    const bestLip = result.recommendedLipShades[0]?.hex || '#d44958';
    const bestBlush = result.recommendedBlushShades[0]?.hex || '#f07d75';
    const bestEye = result.recommendedEyePalettes[0]?.colors || ['#fcd39c', '#e58f65', '#aa4b32'];

    setMakeup((prev) => ({
      ...prev,
      lips: {
        ...prev.lips,
        color: bestLip,
        finish: result.undertone === 'cool' ? 'ombre' : 'satin',
        intensity: 80,
      },
      blush: {
        ...prev.blush,
        color: bestBlush,
        intensity: 60,
      },
      eyes: {
        ...prev.eyes,
        primaryColor: bestEye[2] || prev.eyes.primaryColor,
        secondaryColor: bestEye[1] || prev.eyes.secondaryColor,
        shimmerColor: bestEye[0] || prev.eyes.shimmerColor,
        intensity: 70,
      },
    }));

    setActiveView('studio');
    showToast(
      lang === 'id'
        ? `Palet ${result.seasonNameId} berhasil diterapkan ke Studio!`
        : `Palette ${result.seasonNameEn} applied to Studio!`
    );
  };

  // Apply custom AI Recipe
  const handleApplyRecipe = (partialState: Partial<MakeupState>, lookName: string) => {
    setMakeup((prev) => ({
      ...prev,
      ...partialState,
      lips: { ...prev.lips, ...(partialState.lips || {}) },
      blush: { ...prev.blush, ...(partialState.blush || {}) },
      eyes: { ...prev.eyes, ...(partialState.eyes || {}) },
      face: { ...prev.face, ...(partialState.face || {}) },
    }));
    setActiveView('studio');
    showToast(
      lang === 'id'
        ? `Formula AI "${lookName}" berhasil diterapkan!`
        : `AI Formula "${lookName}" applied!`
    );
  };

  // Apply saved look from Vanity
  const handleApplySavedLook = (state: MakeupState) => {
    setMakeup({ ...state });
    setActiveView('studio');
    showToast(
      lang === 'id'
        ? 'Riasan dari tas rias berhasil dimuat!'
        : 'Saved look loaded to Studio!'
    );
  };

  return (
    <div className="min-h-screen bg-[#0d090e] text-[#f7eef5] flex flex-col selection:bg-rose-600 selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Luxury Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#140d16]/90 border-b border-rose-950/40 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Brand Identity */}
          <div
            onClick={() => setActiveView('studio')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-0.5 shadow-lg shadow-rose-950/60 transition group-hover:scale-105">
              <div className="w-full h-full bg-[#170e1a] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-rose-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg sm:text-xl tracking-wide shimmer-text">
                  GLOWSTUDIO
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 border border-amber-400/40 px-1.5 py-0.2 rounded-md bg-amber-400/10">
                  MUA
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 hidden sm:block -mt-1">
                {lang === 'id' ? 'Studio Virtual Make-up & AI Advisor' : 'Virtual Make-up Studio & Advisor'}
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#1a111c] p-1 rounded-2xl border border-rose-950/40">
            {[
              { id: 'studio', label: lang === 'id' ? 'Studio Rias' : 'Studio', icon: Sliders },
              { id: 'lookbook', label: lang === 'id' ? 'Lookbook Tren' : 'Lookbook', icon: Sparkles },
              { id: 'personal-color', label: lang === 'id' ? 'Personal Color' : 'Personal Color', icon: Palette },
              { id: 'tutorials', label: lang === 'id' ? 'Panduan Kontur' : 'Masterclass', icon: BookOpen },
              { id: 'vanity', label: lang === 'id' ? 'Tas Rias' : 'My Vanity', icon: ShoppingBag },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Header Right Actions */}
          <div className="flex items-center gap-2">
            {/* AI Advisor Trigger Button */}
            <button
              onClick={() => setIsAdvisorOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 text-stone-950 shadow-md shadow-rose-950/60 hover:brightness-110 active:scale-95 transition"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {lang === 'id' ? 'Konsultan AI' : 'AI Consultant'}
              </span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white/5 text-zinc-300 border border-white/10 hover:bg-white/10 transition"
              title="Ganti Bahasa / Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-rose-400" />
              <span>{lang.toUpperCase()}</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden items-center justify-around gap-1 pt-2.5 mt-2 border-t border-rose-950/30 overflow-x-auto">
          {[
            { id: 'studio', label: 'Studio', icon: Sliders },
            { id: 'lookbook', label: 'Lookbook', icon: Sparkles },
            { id: 'personal-color', label: 'Color', icon: Palette },
            { id: 'tutorials', label: 'Panduan', icon: BookOpen },
            { id: 'vanity', label: 'Tas Rias', icon: ShoppingBag },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition ${
                  isActive ? 'text-rose-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col">
        {/* VIEW 1: VIRTUAL STUDIO (Main Canvas & Interactive Controls) */}
        {activeView === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-stretch">
            {/* Canvas Viewport (7 Cols on desktop) */}
            <div className="lg:col-span-7 flex flex-col min-h-[500px]">
              <FaceCanvas
                model={selectedModel}
                makeup={makeup}
                onResetMakeup={handleResetMakeup}
                lang={lang}
              />
            </div>

            {/* Makeup Controls & Color Pickers (5 Cols on desktop) */}
            <div className="lg:col-span-5 flex flex-col min-h-[500px]">
              <MakeupControls
                model={selectedModel}
                onSelectModel={(m) => {
                  setSelectedModel(m);
                  showToast(
                    lang === 'id'
                      ? `Model diubah ke ${m.name} (${m.skinToneName})`
                      : `Model switched to ${m.name}`
                  );
                }}
                makeup={makeup}
                onChangeMakeup={(updater) => setMakeup(updater)}
                onRandomize={handleRandomizeMakeup}
                onReset={handleResetMakeup}
                lang={lang}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: LOOKBOOK */}
        {activeView === 'lookbook' && (
          <LookbookView onApplyLook={handleApplyLook} lang={lang} />
        )}

        {/* VIEW 3: PERSONAL COLOR ANALYSIS */}
        {activeView === 'personal-color' && (
          <PersonalColorQuiz
            onApplyPaletteToStudio={handleApplyPersonalColor}
            lang={lang}
          />
        )}

        {/* VIEW 4: TUTORIAL MASTERCLASS & CONTOUR */}
        {activeView === 'tutorials' && <TutorialGuide lang={lang} />}

        {/* VIEW 5: MY VANITY BAG & EXPIRATION TRACKER */}
        {activeView === 'vanity' && (
          <VanityOrganizer
            currentMakeup={makeup}
            currentModelName={selectedModel.name}
            onApplySavedLook={handleApplySavedLook}
            lang={lang}
          />
        )}
      </main>

      {/* AI Beauty Advisor Modal */}
      <BeautyAdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        onApplyRecipe={handleApplyRecipe}
        lang={lang}
      />

      {/* Footer */}
      <footer className="mt-auto py-5 px-4 text-center text-xs text-zinc-500 border-t border-rose-950/30 bg-[#0d080e]">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-1">
          <span className="text-zinc-400 font-medium">GlowStudio Makeup Ecosystem</span>
          <span>•</span>
          <span>Studio Virtual Try-On</span>
          <span>•</span>
          <span>Personal Color Analysis</span>
          <span>•</span>
          <span>AI Beauty Advisor</span>
        </div>
        <p className="text-[11px] text-zinc-600">
          Dirancang untuk pecinta kecantikan, makeup artist, dan siapa saja yang ingin mengekspresikan pesona terbaiknya.
        </p>
      </footer>
    </div>
  );
}
