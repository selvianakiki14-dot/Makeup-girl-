import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS, PERSONAL_COLOR_DATA } from '../../data/makeupData';
import { PersonalColorResult, MakeupState } from '../../types/makeup';
import { Sparkles, CheckCircle2, RotateCcw, ArrowRight, ArrowLeft, Palette, Award, ShieldCheck, ThumbsUp, ThumbsDown } from 'lucide-react';

interface PersonalColorQuizProps {
  onApplyPaletteToStudio: (seasonResult: PersonalColorResult) => void;
  lang: 'id' | 'en';
}

export const PersonalColorQuiz: React.FC<PersonalColorQuizProps> = ({
  onApplyPaletteToStudio,
  lang,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<PersonalColorResult | null>(null);

  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentQ = QUIZ_QUESTIONS[currentStep];

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentStep]: optionIndex }));
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      calculateResult();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const calculateResult = () => {
    let warmScore = 0;
    let coolScore = 0;
    let neutralScore = 0;

    Object.entries(selectedAnswers).forEach(([stepStr, optIdx]) => {
      const step = parseInt(stepStr, 10);
      const points = QUIZ_QUESTIONS[step].options[optIdx]?.points;
      if (points) {
        warmScore += points.warm || 0;
        coolScore += points.cool || 0;
        neutralScore += points.neutral || 0;
      }
    });

    let detectedSeason: 'spring_warm' | 'summer_cool' | 'autumn_warm' | 'winter_cool';

    if (warmScore >= coolScore) {
      // Warm: choose Spring or Autumn based on question 2 & 5 (intensity)
      const q2Answer = selectedAnswers[1]; // sun test
      detectedSeason = q2Answer === 0 ? 'autumn_warm' : 'spring_warm';
    } else {
      // Cool: choose Summer or Winter based on question 5 (contrast)
      const q5Answer = selectedAnswers[4];
      detectedSeason = q5Answer === 1 ? 'winter_cool' : 'summer_cool';
    }

    const calculated = PERSONAL_COLOR_DATA[detectedSeason];
    setResult(calculated);

    // Launch festive confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: calculated.paletteHexes,
      });
    } catch (e) {
      // Ignore if confetti context unavailable
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setCurrentStep(0);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
      {/* Intro Heading */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
          <Palette className="w-3.5 h-3.5" />
          <span>{lang === 'id' ? 'Diagnosis Rona & Suhu Kulit' : 'Skin Tone & Season Diagnosis'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
          {lang === 'id' ? 'Tes Personal Color & Undertone' : 'Personal Color & Undertone Analysis'}
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
          {lang === 'id'
            ? 'Cari tahu apakah Anda Spring Warm, Summer Cool, Autumn Warm, atau Winter Cool untuk menemukan shade lipstik, blush, dan eyeshadow yang paling memancarkan kecantikan alami Anda.'
            : 'Discover your seasonal color palette to identify the most flattering makeup shades for your natural complexion.'}
        </p>
      </div>

      {/* QUIZ IN PROGRESS */}
      {!result && (
        <div className="rounded-2xl bg-[#1a131d] border border-rose-950/50 p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-400 font-medium">
              <span>
                {lang === 'id' ? 'Pertanyaan' : 'Question'} {currentStep + 1} / {totalQuestions}
              </span>
              <span className="text-rose-400 font-semibold">
                {Math.round(((currentStep + 1) / totalQuestions) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 transition-all duration-300 rounded-full"
                style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {lang === 'id' ? currentQ.question : currentQ.questionEn}
            </h3>

            {/* Interactive Visual Wrist / Jewelry Assist for Question 3 */}
            {currentStep === 2 && (
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-black/40 border border-white/5">
                <div className="flex flex-col items-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 via-amber-300 to-yellow-100 shadow-md flex items-center justify-center font-bold text-xs text-stone-900 mb-1">
                    GOLD
                  </div>
                  <span className="text-[11px] font-semibold text-amber-300">Yellow / Rose Gold</span>
                  <span className="text-[10px] text-zinc-400 text-center mt-0.5">
                    {lang === 'id' ? 'Karakter Hangat (Warm)' : 'Warm undertone indicator'}
                  </span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-xl bg-sky-500/10 border border-sky-500/30">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-400 via-slate-100 to-white shadow-md flex items-center justify-center font-bold text-xs text-stone-900 mb-1">
                    SILVER
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300">Silver / Platinum</span>
                  <span className="text-[10px] text-zinc-400 text-center mt-0.5">
                    {lang === 'id' ? 'Karakter Dingin (Cool)' : 'Cool undertone indicator'}
                  </span>
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentStep] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition ${
                      isSelected
                        ? 'border-rose-500 bg-rose-950/40 text-white ring-2 ring-rose-500/30'
                        : 'border-white/10 bg-black/30 text-zinc-300 hover:border-rose-500/40 hover:bg-white/5'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-rose-400 bg-rose-600 text-white'
                          : 'border-zinc-600'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className="text-sm font-medium leading-relaxed">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-rose-950/40">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                currentStep === 0
                  ? 'opacity-40 cursor-not-allowed border-zinc-800 text-zinc-500'
                  : 'border-white/10 text-zinc-300 hover:bg-white/10'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'id' ? 'Kembali' : 'Previous'}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentStep] === undefined}
              className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-lg ${
                selectedAnswers[currentStep] === undefined
                  ? 'opacity-50 cursor-not-allowed bg-zinc-800 text-zinc-500'
                  : 'bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white shadow-rose-950/50 hover:brightness-110 active:scale-95'
              }`}
            >
              <span>
                {currentStep === totalQuestions - 1
                  ? lang === 'id' ? 'Lihat Hasil Personal Color' : 'Reveal My Palette'
                  : lang === 'id' ? 'Selanjutnya' : 'Next'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* RESULT CARD VIEW */}
      {result && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-gradient-to-b from-[#241525] via-[#1a111c] to-[#120a14] border border-rose-900/40 p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Header Badge & Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-rose-950/50">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <Award className="w-3.5 h-3.5" />
                  <span>Undertone: {result.undertone.toUpperCase()}</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
                  {lang === 'id' ? result.seasonNameId : result.seasonNameEn}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
                  {result.summary}
                </p>
              </div>

              {/* Action: Apply directly to Virtual Studio */}
              <button
                onClick={() => onApplyPaletteToStudio(result)}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-stone-950 shadow-xl shadow-rose-950/60 hover:brightness-110 active:scale-95 transition shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'id' ? 'Terapkan Palet ke Studio Rias' : 'Apply Palette to Studio'}</span>
              </button>
            </div>

            {/* Signature Palette Swatch Strip */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-rose-300 block">
                {lang === 'id' ? 'Palet Warna Terbaik Anda' : 'Your Signature Color Spectrum'}
              </label>
              <div className="flex items-center gap-2 overflow-x-auto p-2 bg-black/40 rounded-2xl border border-white/5">
                {result.paletteHexes.map((hex, i) => (
                  <div
                    key={i}
                    className="flex-1 min-w-12 h-14 rounded-xl shadow-inner flex flex-col justify-end p-1.5 transition hover:scale-105"
                    style={{ backgroundColor: hex }}
                  >
                    <span className="text-[9px] font-mono text-white/90 drop-shadow text-center font-bold">
                      {hex}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Makeup Breakdown (Lips, Blush, Eyes) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Lips */}
              <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-3">
                <span className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>💄</span>
                  <span>{lang === 'id' ? 'Shade Lipstik Ideal' : 'Lipstick Recommendations'}</span>
                </span>
                <div className="space-y-2">
                  {result.recommendedLipShades.map((lip) => (
                    <div key={lip.name} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border border-white/20 shadow" style={{ backgroundColor: lip.hex }} />
                      <span className="text-xs text-zinc-200 font-medium">{lip.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blush */}
              <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-3">
                <span className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🌸</span>
                  <span>{lang === 'id' ? 'Shade Perona Pipi' : 'Blush Recommendations'}</span>
                </span>
                <div className="space-y-2">
                  {result.recommendedBlushShades.map((blush) => (
                    <div key={blush.name} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border border-white/20 shadow" style={{ backgroundColor: blush.hex }} />
                      <span className="text-xs text-zinc-200 font-medium">{blush.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Jewelry & Eyes */}
              <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-3">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>✨</span>
                  <span>{lang === 'id' ? 'Saran Perhiasan & Logam' : 'Jewelry & Metals'}</span>
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {result.jewelryAdvice}
                </p>
              </div>
            </div>

            {/* Dos and Don'ts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/30 space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>DO (Sangat Direkomendasikan):</span>
                </div>
                <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                  {result.doAndDonts.do.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/30 space-y-2">
                <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>AVOID (Sebaiknya Dihindari):</span>
                </div>
                <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                  {result.doAndDonts.dont.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Retake Button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={handleResetQuiz}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition py-2 px-4 rounded-xl border border-white/10 hover:bg-white/5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'id' ? 'Ulangi Diagnosis Tes' : 'Retake Analysis Quiz'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
