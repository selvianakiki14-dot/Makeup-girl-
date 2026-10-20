import React, { useState } from 'react';
import { MakeupState } from '../../types/makeup';
import { Sparkles, Send, Bot, User, Wand2, X, RefreshCw, Check, BookOpen } from 'lucide-react';

interface BeautyAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRecipe: (makeup: Partial<MakeupState>, lookName: string) => void;
  lang: 'id' | 'en';
}

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export const BeautyAdvisorModal: React.FC<BeautyAdvisorModalProps> = ({
  isOpen,
  onClose,
  onApplyRecipe,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'recipe'>('recipe');

  // Recipe Generator State
  const [occasion, setOccasion] = useState('Pesta Pernikahan / Kondangan');
  const [outfitColor, setOutfitColor] = useState('Sage Green / Hijau Zaitun');
  const [stylePreference, setStylePreference] = useState('Soft Glamour Elegan');
  const [skinType, setSkinType] = useState('Kombinasi');
  const [generatingRecipe, setGeneratingRecipe] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<any | null>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content:
        lang === 'id'
          ? 'Halo cantik! ✨ Saya **GlowAdvisor**, konsultan kecantikan & MUA personal Anda. Ada yang ingin Anda konsultasikan hari ini? Mulai dari pilihan warna riasan untuk acara tertentu, tips kulit berminyak/kering, hingga trik teknik ombre lips dan contouring!'
          : 'Hello gorgeous! ✨ I am **GlowAdvisor**, your personal AI makeup artist. What beauty questions or look recommendations can I help you with today?',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  if (!isOpen) return null;

  // Handle Recipe Generation
  const handleGenerateRecipe = async () => {
    setGeneratingRecipe(true);
    setGeneratedRecipe(null);
    try {
      const res = await fetch('/api/recommend-look', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion,
          outfitColor,
          style: stylePreference,
          skinTone: 'Medium Warm / Kuning Langsat',
          eyeShape: 'Almond',
        }),
      });
      const data = await res.json();
      setGeneratedRecipe(data);
    } catch (err) {
      console.error('Error generating recipe:', err);
    } finally {
      setGeneratingRecipe(false);
    }
  };

  // Handle Chat Submit
  const handleSendChat = async (presetText?: string) => {
    const textToSend = presetText || inputText;
    if (!textToSend.trim()) return;

    const newHistory: ChatMessage[] = [...chatMessages, { role: 'user', content: textToSend }];
    setChatMessages(newHistory);
    if (!presetText) setInputText('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/beauty-consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          context: {
            skinType,
            occasion,
          },
          history: newHistory.slice(-6).map((m) => ({ role: m.role, text: m.content })),
        }),
      });
      const data = await res.json();
      setChatMessages((prev) => [...prev, { role: 'model', content: data.reply }]);
    } catch (err) {
      console.error('Error in consultant chat:', err);
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content:
            lang === 'id'
              ? 'Terjadi kendala koneksi. Coba beberapa saat lagi atau tanyakan hal seputar foundation, ombre lips, atau blush!'
              : 'Connection error. Please try again.',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleApplyRecipeToStudio = () => {
    if (!generatedRecipe) return;

    const partialState: any = {
      lips: {
        color: generatedRecipe.lips?.color || '#d45d68',
        finish: generatedRecipe.lips?.finish || 'ombre',
        intensity: generatedRecipe.lips?.intensity || 80,
      },
      blush: {
        color: generatedRecipe.blush?.color || '#e88274',
        style: generatedRecipe.blush?.style || 'apples',
        intensity: generatedRecipe.blush?.intensity || 60,
      },
      eyes: {
        primaryColor: generatedRecipe.eyeshadow?.primaryColor || '#b87d60',
        secondaryColor: generatedRecipe.eyeshadow?.secondaryColor || '#f2c89f',
        eyeshadowStyle: generatedRecipe.eyeshadow?.style || 'duo',
        intensity: generatedRecipe.eyeshadow?.intensity || 70,
        eyelinerStyle: generatedRecipe.eyeliner?.style || 'winged',
        eyelinerColor: generatedRecipe.eyeliner?.color || '#1a1412',
      },
      face: {
        highlighterColor: generatedRecipe.highlighter?.color || '#fbe8c5',
        highlighterIntensity: generatedRecipe.highlighter?.intensity || 70,
        contourIntensity: generatedRecipe.contour?.intensity || 45,
      },
    };

    onApplyRecipe(partialState, generatedRecipe.lookName || 'Resep AI');
    onClose();
  };

  const promptChips = [
    lang === 'id'
      ? 'Tips riasan wisuda tahan lama & photogenic'
      : 'Graduation long-lasting makeup tips',
    lang === 'id'
      ? 'Lipstik cocok untuk gaun warna Sage Green'
      : 'Best lip color for Sage Green dress',
    lang === 'id'
      ? 'Trik ombre lips natural K-Beauty tanpa crack'
      : 'K-Beauty seamless ombre lips guide',
    lang === 'id'
      ? 'Complexion dewy untuk kulit berminyak'
      : 'Dewy skin routine for oily complexion',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="flex flex-col w-full max-w-3xl h-[88vh] bg-[#1a121c] border border-rose-900/40 rounded-3xl shadow-2xl overflow-hidden">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#140c16] border-b border-rose-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-400 p-0.5 flex items-center justify-center shadow-lg shadow-rose-950/50">
              <div className="w-full h-full bg-[#160c18] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-rose-300" />
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-display text-white">
                GlowAdvisor AI
              </h3>
              <p className="text-xs text-rose-300/80">
                {lang === 'id' ? 'Konsultan Riasan & MUA Virtual Pribadi' : 'Personal AI Makeup Consultant'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switchers */}
            <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
              <button
                onClick={() => setActiveTab('recipe')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'recipe'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{lang === 'id' ? 'Generator Resep' : 'Look Generator'}</span>
              </button>

              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'chat'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>{lang === 'id' ? 'Tanya Ahli' : 'Consultant Chat'}</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar text-zinc-300">
          {/* ================= TAB 1: RECIPE GENERATOR ================= */}
          {activeTab === 'recipe' && (
            <div className="space-y-6">
              {!generatedRecipe ? (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/30 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {lang === 'id'
                      ? 'Pilih acara, warna busana, dan gaya riasan impian Anda. AI MUA kami akan meracik formula makeup lengkap yang presisi dengan shade warna harmonis!'
                      : 'Choose your occasion, outfit color, and preferred aesthetic. Our AI MUA will formulate a tailored makeup recipe.'}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Occasion */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
                        {lang === 'id' ? 'Acara / Keperluan' : 'Occasion'}
                      </label>
                      <select
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-rose-500"
                      >
                        <option>Pesta Pernikahan / Kondangan</option>
                        <option>Seremoni Wisuda & Foto Studio</option>
                        <option>Kencan Romantis (Date Night)</option>
                        <option>Kerja / Wawancara Profesional</option>
                        <option>Hangout Santai & Kuliah</option>
                        <option>Pesta Malam & Prom Gala</option>
                      </select>
                    </div>

                    {/* Outfit Color */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
                        {lang === 'id' ? 'Warna Busana / Baju' : 'Outfit Color'}
                      </label>
                      <select
                        value={outfitColor}
                        onChange={(e) => setOutfitColor(e.target.value)}
                        className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-rose-500"
                      >
                        <option>Sage Green / Hijau Zaitun</option>
                        <option>Hitam Pekat / Elegan</option>
                        <option>Terracotta / Cokelat Bata</option>
                        <option>Putih Murni / Cream Ivory</option>
                        <option>Merah Marun / Burgundy</option>
                        <option>Navy Blue / Biru Dongker</option>
                        <option>Dusty Pink / Rose Gold</option>
                        <option>Lilac / Pastel Lavender</option>
                      </select>
                    </div>

                    {/* Style Preference */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
                        {lang === 'id' ? 'Gaya Riasan Impian' : 'Aesthetic Vibe'}
                      </label>
                      <select
                        value={stylePreference}
                        onChange={(e) => setStylePreference(e.target.value)}
                        className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-rose-500"
                      >
                        <option>Soft Glamour Elegan</option>
                        <option>Korean Douyin Glowing Glass Skin</option>
                        <option>Clean Girl Natural No-Makeup</option>
                        <option>Bold Red Carpet Glamour</option>
                        <option>Latte Monochromatic Warmth</option>
                      </select>
                    </div>

                    {/* Skin Type */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
                        {lang === 'id' ? 'Tipe Kulit' : 'Skin Type'}
                      </label>
                      <select
                        value={skinType}
                        onChange={(e) => setSkinType(e.target.value)}
                        className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-rose-500"
                      >
                        <option>Kombinasi (Normal - Oily T-Zone)</option>
                        <option>Berminyak (Oily Skin)</option>
                        <option>Kering (Dry Skin / Dehydrated)</option>
                        <option>Normal Seimbang</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateRecipe}
                    disabled={generatingRecipe}
                    className="w-full py-3.5 px-6 rounded-2xl text-sm font-bold bg-gradient-to-r from-rose-500 via-pink-600 to-amber-400 text-stone-950 shadow-xl shadow-rose-950/60 hover:brightness-110 active:scale-[0.99] transition flex items-center justify-center gap-2"
                  >
                    {generatingRecipe ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{lang === 'id' ? 'Meracik Resep Riasan...' : 'Formulating Recipe...'}</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        <span>{lang === 'id' ? 'Rancang Resep Riasan AI' : 'Generate Custom Makeup Recipe'}</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Generated Recipe Result Card */
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl bg-gradient-to-b from-[#251426] via-[#1a0f1d] to-[#120a15] border border-rose-900/50 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-950/50">
                      <div>
                        <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30">
                          Resep Terkurasi
                        </span>
                        <h4 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
                          {generatedRecipe.lookName}
                        </h4>
                        <p className="text-xs text-rose-300 font-medium">{generatedRecipe.tagline}</p>
                      </div>

                      <button
                        onClick={handleApplyRecipeToStudio}
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-stone-950 shadow-lg shadow-rose-950/60 hover:brightness-110 transition shrink-0"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{lang === 'id' ? 'Terapkan ke Studio Rias' : 'Apply to Studio'}</span>
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {generatedRecipe.description}
                    </p>

                    {/* Shade Palette Preview */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                        <span className="text-[10px] font-semibold text-zinc-400 uppercase">💄 Lip Shade</span>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full border border-white/20 shadow"
                            style={{ backgroundColor: generatedRecipe.lips?.color }}
                          />
                          <div className="text-xs font-mono font-medium">{generatedRecipe.lips?.color}</div>
                        </div>
                        <span className="text-[10px] text-zinc-500 capitalize block">
                          Finish: {generatedRecipe.lips?.finish}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                        <span className="text-[10px] font-semibold text-zinc-400 uppercase">🌸 Blush Shade</span>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full border border-white/20 shadow"
                            style={{ backgroundColor: generatedRecipe.blush?.color }}
                          />
                          <div className="text-xs font-mono font-medium">{generatedRecipe.blush?.color}</div>
                        </div>
                        <span className="text-[10px] text-zinc-500 capitalize block">
                          Style: {generatedRecipe.blush?.style}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                        <span className="text-[10px] font-semibold text-zinc-400 uppercase">👁️ Eyeshadow</span>
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-5 h-5 rounded-full border border-white/20 shadow"
                            style={{ backgroundColor: generatedRecipe.eyeshadow?.primaryColor }}
                          />
                          <div
                            className="w-5 h-5 rounded-full border border-white/20 shadow"
                            style={{ backgroundColor: generatedRecipe.eyeshadow?.secondaryColor }}
                          />
                        </div>
                        <span className="text-[10px] text-zinc-500 capitalize block">
                          Style: {generatedRecipe.eyeshadow?.style}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                        <span className="text-[10px] font-semibold text-zinc-400 uppercase">✨ Highlighter</span>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full border border-white/20 shadow"
                            style={{ backgroundColor: generatedRecipe.highlighter?.color }}
                          />
                          <div className="text-xs font-mono font-medium">{generatedRecipe.highlighter?.color}</div>
                        </div>
                        <span className="text-[10px] text-zinc-500 capitalize block">
                          Gleam: {generatedRecipe.highlighter?.intensity}%
                        </span>
                      </div>
                    </div>

                    {/* Pro Tips */}
                    {generatedRecipe.proTips && (
                      <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-2">
                        <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                          💡 Tips Profesional MUA:
                        </span>
                        <ul className="text-xs text-zinc-300 space-y-1 list-disc list-inside">
                          {generatedRecipe.proTips.map((tip: string, i: number) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                      <button
                        onClick={() => setGeneratedRecipe(null)}
                        className="text-xs text-zinc-400 hover:text-white transition flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{lang === 'id' ? 'Buat Resep Baru' : 'Create Another Recipe'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: CONSULTANT CHAT ================= */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full space-y-4">
              {/* Preset Quick Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {promptChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendChat(chip)}
                    className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-white/5 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 whitespace-nowrap transition"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-2.5 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.role === 'model' && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center shrink-0 text-white shadow">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-rose-600 text-white rounded-tr-none'
                          : 'bg-[#221625] text-zinc-200 border border-rose-950/40 rounded-tl-none shadow-md'
                      }`}
                    >
                      {msg.content}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-300">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex items-center gap-2 text-xs text-rose-300 animate-pulse py-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>{lang === 'id' ? 'GlowAdvisor sedang mengetik...' : 'GlowAdvisor is typing...'}</span>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="pt-2 border-t border-rose-950/40">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendChat();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      lang === 'id'
                        ? 'Tanyakan rekomendasi warna, teknik, atau riasan...'
                        : 'Ask for makeup advice, shades, techniques...'
                    }
                    className="flex-1 p-3 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || chatLoading}
                    className="p-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white disabled:opacity-40 transition hover:brightness-110 active:scale-95 shadow-md shadow-rose-950/50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
