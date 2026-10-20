import React, { useState } from 'react';
import { FACE_SHAPES_CONTOUR } from '../../data/makeupData';
import { BookOpen, Sparkles, CheckCircle2, AlertCircle, Heart, ChevronRight, Layers } from 'lucide-react';

interface TutorialGuideProps {
  lang: 'id' | 'en';
}

export const TutorialGuide: React.FC<TutorialGuideProps> = ({ lang }) => {
  const [activeFaceShape, setActiveFaceShape] = useState<string>('oval');
  const [activeTutorialIndex, setActiveTutorialIndex] = useState<number>(0);

  const selectedShape =
    FACE_SHAPES_CONTOUR.find((s) => s.id === activeFaceShape) || FACE_SHAPES_CONTOUR[0];

  const tutorials = [
    {
      title: lang === 'id' ? 'Langkah 1: Skin Prep & Primer' : 'Step 1: Skin Prep & Primer',
      subtitle: lang === 'id' ? 'Fondasi Kulit Sehat & Glowing' : 'Healthy Radiant Skin Prep',
      tool: 'Hydrating Toner, Moisturizer Gel, Blurring Primer',
      steps: [
        'Bersihkan wajah dengan gentle cleanser dan tepuk lembut hingga kering.',
        'Aplikasikan hydrating toner berlapis (teknik 2-3 layer) untuk mengunci kelembaban dari dalam.',
        'Oleskan moisturizer tipis merata. Jika kulit berminyak, pilih gel moisturizer bebas minyak.',
        'Tunggu 2 menit hingga skincare meresap sempurna sebelum primer.',
        'Gunakan pore-blurring primer di area T-Zone dan garis senyum untuk menyamarkan pori secara instan.',
      ],
      proTip: 'Jangan langsung memakai foundation setelah skincare! Jeda 2-3 menit adalah rahasia agar makeup tidak bergeser (peeling).',
    },
    {
      title: lang === 'id' ? 'Langkah 2: Complexion (Foundation & Concealer)' : 'Step 2: Complexion Base',
      subtitle: lang === 'id' ? 'Wajah Mulus Tanpa Efek Cakey' : 'Flawless Base Without Caking',
      tool: 'Damp Beauty Sponge / Foundation Brush',
      steps: [
        'Kocok foundation dan letakkan 1-2 pump di punggung tangan.',
        'Aplikasikan dengan teknik titik-titik dari bagian tengah wajah (area yang butuh coverage) ke arah luar.',
        'Baurkan dengan beauty sponge yang sudah dibasahi dan diperas tuntas menggunakan gerakan tap-tap (menepuk, bukan menggeser).',
        'Gunakan concealer 1 tingkat lebih terang di sudut dalam mata dan sudut luar mata untuk efek lifting instan.',
      ],
      proTip: 'Kurang itu lebih (less is more). Bangun coverage secara bertahap tipis-tipis daripada langsung tebal di awal.',
    },
    {
      title: lang === 'id' ? 'Langkah 3: Bedak & Teknik Baking' : 'Step 3: Setting & Baking',
      subtitle: lang === 'id' ? 'Kunci Riasan Tahan Seharian' : 'All-Day Lock Technique',
      tool: 'Velvet Powder Puff, Fluffy Powder Brush, Translucent Powder',
      steps: [
        'Sebelum mengeset bedak, pastikan lipatan bawah mata halus tanpa concealer yang crease.',
        'Ambil loose powder dengan powder puff, ratakan di punggung tangan terlebih dahulu.',
        'Tekan lembut di area bawah mata dan T-Zone (teknik pressing).',
        'Biarkan 1-2 menit untuk proses baking ringan menyerap minyak alami kulit.',
        'Sapu lembut sisa bedak berlebih dengan fluffy brush bersih.',
      ],
      proTip: 'Hindari bedak di area pipi luar jika Anda menginginkan efek natural dewy glow.',
    },
    {
      title: lang === 'id' ? 'Langkah 4: Eyeliner & Bulu Mata' : 'Step 4: Eyes & Lashes',
      subtitle: lang === 'id' ? 'Mata Memikat & Berdimensi' : 'Alluring Dimension Eyes',
      tool: 'Waterproof Gel / Liquid Pen Eyeliner, Eyelash Curler, Mascara',
      steps: [
        'Jepit bulu mata mulai dari pangkal, tengah, hingga ujung selama masing-masing 5 detik.',
        'Lakukan tightlining di garis batas air mata atas (waterline) dengan eyeliner pensil cokelat/hitam untuk mempertegas garis mata alami.',
        'Untuk winged liner: Ikuti arah garis kelopak mata bawah naik ke arah ujung alis, tarik garis tipis lalu hubungkan kembali ke garis mata atas.',
        'Aplikasikan maskara dengan gerakan zig-zag dari akar bulu mata untuk volume maksimal tanpa gumpalan.',
      ],
      proTip: 'Gunakan cermin sedikit di bawah dagu dan tatap ke bawah saat mengaplikasikan eyeliner agar kelopak mata rileks.',
    },
    {
      title: lang === 'id' ? 'Langkah 5: Rahasia Ombre Lips K-Beauty' : 'Step 5: K-Beauty Ombre Lips',
      subtitle: lang === 'id' ? 'Bibir Segar Bergradasi Alami' : 'Juicy Seamless Gradient Lips',
      tool: 'Lip Balm, Concealer tipis, Nude Lipstick, Deep Tint',
      steps: [
        'Lembabkan bibir dengan lip balm dan tepuk sisa minyak dengan tisu.',
        'Sapukan sedikit sisa concealer di tepi garis luar bibir untuk memudarkan warna gelap alami tepi bibir.',
        'Oleskan warna nude peachy atau dusty rose di seluruh permukaan bibir.',
        'Aplikasikan lip tint berwarna cherry, berry, atau red marun tepat di tengah/dalam bibir.',
        'Baurkan tepinya dengan ujung jari manis atau kuas eyeshadow bersih dengan gerakan menepuk ke arah luar.',
      ],
      proTip: 'Tambahkan clear gloss tepat di tengah bibir bawah untuk ilusi bibir lebih tebal bervolume.',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 py-4">
      {/* Intro Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{lang === 'id' ? 'Masterclass & Panduan Rias MUA' : 'Masterclass & Face Architecture'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
          {lang === 'id' ? 'Panduan Kontur Wajah & Teknik Riasan' : 'Contour Guide & Makeup Masterclass'}
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
          {lang === 'id'
            ? 'Pelajari titik penempatan kontur, blush on, dan highlighter sesuai bentuk wajah unik Anda, serta teknik rahasia MUA profesional untuk riasan sempurna.'
            : 'Explore contour, blush, and highlighter placement mapped to your face shape, accompanied by step-by-step techniques.'}
        </p>
      </div>

      {/* SECTION 1: INTERACTIVE FACE SHAPE CONTOUR MAP */}
      <div className="rounded-3xl bg-[#19111c] border border-rose-950/50 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-rose-950/50">
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-display text-white">
              {lang === 'id' ? 'Peta Penempatan Kontur Menurut Bentuk Wajah' : 'Contour Placement by Face Shape'}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              {lang === 'id' ? 'Pilih bentuk wajah untuk melihat diagram titik riasan:' : 'Select your face shape to explore placement:'}
            </p>
          </div>
        </div>

        {/* Face Shape Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {FACE_SHAPES_CONTOUR.map((shape) => (
            <button
              key={shape.id}
              onClick={() => setActiveFaceShape(shape.id)}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                activeFaceShape === shape.id
                  ? 'bg-rose-600/30 border-rose-500 text-white font-bold ring-2 ring-rose-500/30'
                  : 'bg-black/30 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-xs">{lang === 'id' ? shape.name : shape.nameEn}</span>
            </button>
          ))}
        </div>

        {/* Face Shape Visual Diagram & Blueprint */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
          {/* Visual SVG Map */}
          <div className="relative w-full aspect-square max-w-[340px] mx-auto rounded-3xl bg-radial from-[#2a172c] via-[#1a0f1d] to-[#0c070e] border border-rose-900/30 p-4 flex items-center justify-center shadow-xl">
            <svg viewBox="0 0 300 340" className="w-full h-full drop-shadow-lg">
              <defs>
                <radialGradient id="contourColorMap" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#8c4e32" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#8c4e32" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="highlightColorMap" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fff3d6" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#fff3d6" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="blushColorMap" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Base Face Outline Shape */}
              {activeFaceShape === 'round' ? (
                <ellipse cx="150" cy="170" rx="95" ry="95" fill="#f5d0b5" stroke="#4a2e22" strokeWidth="2" />
              ) : activeFaceShape === 'square' ? (
                <rect x="55" y="75" width="190" height="190" rx="40" fill="#f5d0b5" stroke="#4a2e22" strokeWidth="2" />
              ) : activeFaceShape === 'heart' ? (
                <path
                  d="M 150 260 C 80 200, 50 140, 70 90 C 90 60, 140 70, 150 95 C 160 70, 210 60, 230 90 C 250 140, 220 200, 150 260 Z"
                  fill="#f5d0b5"
                  stroke="#4a2e22"
                  strokeWidth="2"
                />
              ) : activeFaceShape === 'diamond' ? (
                <polygon points="150,60 245,160 150,265 55,160" fill="#f5d0b5" stroke="#4a2e22" strokeWidth="2" />
              ) : (
                /* Oval */
                <ellipse cx="150" cy="170" rx="85" ry="105" fill="#f5d0b5" stroke="#4a2e22" strokeWidth="2" />
              )}

              {/* Eyes, Nose, Mouth landmarks */}
              <circle cx="115" cy="150" r="5" fill="#38241c" />
              <circle cx="185" cy="150" r="5" fill="#38241c" />
              <path d="M 150 160 L 150 185 Q 150 190 145 190" stroke="#38241c" strokeWidth="1.5" fill="none" />
              <path d="M 135 215 Q 150 225 165 215" stroke="#b91c1c" strokeWidth="2.5" fill="none" />

              {/* CONTOUR ZONES (Brown dots / ellipses) */}
              <g id="contourPlacementMarkers">
                {activeFaceShape === 'round' && (
                  <>
                    <ellipse cx="75" cy="170" rx="14" ry="40" fill="url(#contourColorMap)" />
                    <ellipse cx="225" cy="170" rx="14" ry="40" fill="url(#contourColorMap)" />
                  </>
                )}
                {activeFaceShape === 'square' && (
                  <>
                    <circle cx="75" cy="95" r="18" fill="url(#contourColorMap)" />
                    <circle cx="225" cy="95" r="18" fill="url(#contourColorMap)" />
                    <circle cx="75" cy="245" r="18" fill="url(#contourColorMap)" />
                    <circle cx="225" cy="245" r="18" fill="url(#contourColorMap)" />
                  </>
                )}
                {activeFaceShape === 'oval' && (
                  <>
                    <ellipse cx="85" cy="180" rx="12" ry="25" fill="url(#contourColorMap)" transform="rotate(20 85 180)" />
                    <ellipse cx="215" cy="180" rx="12" ry="25" fill="url(#contourColorMap)" transform="rotate(-20 215 180)" />
                  </>
                )}
                {activeFaceShape === 'heart' && (
                  <>
                    <ellipse cx="85" cy="100" rx="18" ry="12" fill="url(#contourColorMap)" />
                    <ellipse cx="215" cy="100" rx="18" ry="12" fill="url(#contourColorMap)" />
                    <circle cx="150" cy="255" r="12" fill="url(#contourColorMap)" />
                  </>
                )}
                {activeFaceShape === 'diamond' && (
                  <>
                    <circle cx="65" cy="160" r="16" fill="url(#contourColorMap)" />
                    <circle cx="235" cy="160" r="16" fill="url(#contourColorMap)" />
                  </>
                )}
              </g>

              {/* HIGHLIGHT ZONES (Yellow Gleams) */}
              <g id="highlightPlacementMarkers">
                <circle cx="150" cy="115" r="14" fill="url(#highlightColorMap)" />
                <ellipse cx="150" cy="170" rx="4" ry="12" fill="url(#highlightColorMap)" />
                <circle cx="150" cy="240" r="10" fill="url(#highlightColorMap)" />
                <ellipse cx="100" cy="165" rx="12" ry="6" fill="url(#highlightColorMap)" />
                <ellipse cx="200" cy="165" rx="12" ry="6" fill="url(#highlightColorMap)" />
              </g>

              {/* BLUSH ZONES (Pink Glows) */}
              <g id="blushPlacementMarkers">
                <ellipse cx="105" cy="185" rx="16" ry="12" fill="url(#blushColorMap)" />
                <ellipse cx="195" cy="185" rx="16" ry="12" fill="url(#blushColorMap)" />
              </g>
            </svg>

            {/* Legend Labels */}
            <div className="absolute bottom-2 inset-x-2 flex items-center justify-around bg-black/60 px-2 py-1.5 rounded-xl text-[10px] backdrop-blur border border-white/5">
              <span className="flex items-center gap-1 text-amber-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8c4e32]" /> Kontur
              </span>
              <span className="flex items-center gap-1 text-rose-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]" /> Blush
              </span>
              <span className="flex items-center gap-1 text-amber-200 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#fff3d6]" /> Highlight
              </span>
            </div>
          </div>

          {/* Details & Actionable Technique */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                {lang === 'id' ? 'Karakteristik Bentuk Wajah' : 'Shape Analysis'}
              </span>
              <h4 className="text-xl font-bold font-display text-white mt-0.5">
                {lang === 'id' ? selectedShape.name : selectedShape.nameEn}
              </h4>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{selectedShape.description}</p>
            </div>

            {/* Blush Placement Instruction */}
            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/30 space-y-1">
              <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <span>🌸</span>
                <span>{lang === 'id' ? 'Penempatan Blush On' : 'Blush Placement'}</span>
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">{selectedShape.blushPlacement}</p>
            </div>

            {/* Contour & Highlight checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1.5">
                <span className="font-bold text-amber-500 uppercase tracking-wider block">
                  🤎 Area Kontur:
                </span>
                <ul className="space-y-1 text-zinc-300">
                  {selectedShape.contourPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-500">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1.5">
                <span className="font-bold text-amber-200 uppercase tracking-wider block">
                  ✨ Area Highlighter:
                </span>
                <ul className="space-y-1 text-zinc-300">
                  {selectedShape.highlightPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-300">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: STEP-BY-STEP MASTERCLASS */}
      <div className="rounded-3xl bg-[#19111c] border border-rose-950/50 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="pb-4 border-b border-rose-950/50">
          <h3 className="text-lg sm:text-xl font-bold font-display text-white">
            {lang === 'id' ? 'Masterclass Langkah Demi Langkah' : 'Step-by-Step Masterclass'}
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            {lang === 'id'
              ? 'Urutan teknik riasan profesional dari skin prep hingga setting spray'
              : 'Professional makeup routine order from skin prep to setting lock'}
          </p>
        </div>

        {/* Step Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
          {tutorials.map((tut, i) => (
            <button
              key={i}
              onClick={() => setActiveTutorialIndex(i)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTutorialIndex === i
                  ? 'bg-rose-600 text-white shadow-lg'
                  : 'bg-black/30 text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tut.title.split(':')[0]}
            </button>
          ))}
        </div>

        {/* Active Step Content */}
        <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4">
          <div className="space-y-1">
            <h4 className="text-lg sm:text-xl font-bold text-white font-display">
              {tutorials[activeTutorialIndex].title}
            </h4>
            <p className="text-xs font-semibold text-rose-300">
              {tutorials[activeTutorialIndex].subtitle}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 flex items-center gap-2">
            <span className="font-bold text-rose-300 uppercase">
              {lang === 'id' ? 'Alat / Produk:' : 'Tools Needed:'}
            </span>
            <span>{tutorials[activeTutorialIndex].tool}</span>
          </div>

          <div className="space-y-2.5 pt-2">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
              {lang === 'id' ? 'Langkah Aplikasi:' : 'Application Steps:'}
            </span>
            <div className="space-y-2">
              {tutorials[activeTutorialIndex].steps.map((st, i) => (
                <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  <div className="w-5 h-5 rounded-full bg-rose-600/30 text-rose-300 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-rose-500/40">
                    {i + 1}
                  </div>
                  <span>{st}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tip Box */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5 mt-4">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <span className="font-bold block mb-0.5">MUA Pro Tip:</span>
              <p className="leading-relaxed">{tutorials[activeTutorialIndex].proTip}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
