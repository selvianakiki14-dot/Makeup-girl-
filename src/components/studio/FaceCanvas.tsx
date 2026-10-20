import React, { useRef, useState, useEffect } from 'react';
import { FaceModel, MakeupState } from '../../types/makeup';
import { Camera, Image as ImageIcon, RotateCcw, Download, Sparkles, Eye, Sliders, RefreshCw } from 'lucide-react';

interface FaceCanvasProps {
  model: FaceModel;
  makeup: MakeupState;
  onResetMakeup: () => void;
  lang: 'id' | 'en';
}

export const FaceCanvas: React.FC<FaceCanvasProps> = ({
  model,
  makeup,
  onResetMakeup,
  lang,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<'model' | 'camera' | 'upload'>('model');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [splitPosition, setSplitPosition] = useState<number>(50); // percentage
  const [isSplitting, setIsSplitting] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Stop camera when switching modes
  useEffect(() => {
    if (mode !== 'camera' && cameraActive) {
      stopCamera();
    }
  }, [mode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(
        lang === 'id'
          ? 'Kamera tidak dapat diakses. Pastikan izin kamera telah diberikan.'
          : 'Unable to access camera. Please allow camera permissions.'
      );
      setMode('model');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setMode('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  // Capture canvas & export snapshot
  const handleExportSnapshot = () => {
    const svgElement = containerRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const URLObject = window.URL || window.webkitURL || window;
    const blobURL = URLObject.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Dark luxury background
      const grad = ctx.createLinearGradient(0, 0, 0, 1200);
      grad.addColorStop(0, '#150f16');
      grad.addColorStop(1, '#0c080d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1000, 1200);

      // Draw portrait
      ctx.drawImage(image, 50, 40, 900, 950);

      // Footer branding card
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.roundRect(50, 1010, 900, 140, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Brand Title
      ctx.font = 'bold 28px "Playfair Display", serif';
      ctx.fillStyle = '#fce7f3';
      ctx.fillText('GLOWSTUDIO', 80, 1060);

      ctx.font = '16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#f9a8d4';
      ctx.fillText(
        lang === 'id' ? 'Studio Rias Virtual & Rekomendasi MUA' : 'Virtual Make-up Studio & AI MUA',
        80,
        1090
      );

      ctx.font = '14px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#9ca3af';
      ctx.fillText(
        `Lips: ${makeup.lips.color} • Blush: ${makeup.blush.color} • Eyes: ${makeup.eyes.primaryColor}`,
        80,
        1120
      );

      // Swatches preview
      const swatches = [makeup.lips.color, makeup.blush.color, makeup.eyes.primaryColor, makeup.face.highlighterColor];
      swatches.forEach((color, i) => {
        ctx.beginPath();
        ctx.arc(880 - (3 - i) * 45, 1075, 16, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      const pngURL = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngURL;
      downloadLink.download = `GlowStudio-Look-${Date.now()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URLObject.revokeObjectURL(blobURL);
    };
    image.src = blobURL;
  };

  // Convert hex color to rgba helper
  const hexToRgba = (hex: string, alpha: number) => {
    let clean = hex.replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map((c) => c + c).join('');
    }
    const num = parseInt(clean, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Compute blush SVG coordinates & gradient according to style
  const getBlushStyleCoords = () => {
    switch (makeup.blush.style) {
      case 'apples':
        return {
          leftCx: 280,
          leftCy: 460,
          rightCx: 420,
          rightCy: 460,
          rx: 48,
          ry: 38,
        };
      case 'draped':
        return {
          leftCx: 260,
          leftCy: 435,
          rightCx: 440,
          rightCy: 435,
          rx: 55,
          ry: 30,
        };
      case 'sunkissed':
        return {
          leftCx: 300,
          leftCy: 450,
          rightCx: 400,
          rightCy: 450,
          rx: 65,
          ry: 28,
        };
      case 'undereye':
        return {
          leftCx: 285,
          leftCy: 425,
          rightCx: 415,
          rightCy: 425,
          rx: 42,
          ry: 26,
        };
      case 'temple':
      default:
        return {
          leftCx: 250,
          leftCy: 405,
          rightCx: 450,
          rightCy: 405,
          rx: 45,
          ry: 32,
        };
    }
  };

  const blushCoords = getBlushStyleCoords();

  return (
    <div className="flex flex-col h-full w-full bg-[#120d14] rounded-2xl overflow-hidden border border-rose-900/30 shadow-2xl relative">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-[#19121c]/90 border-b border-rose-950/40 backdrop-blur z-20 gap-2">
        {/* Source Mode Toggles */}
        <div className="flex items-center gap-1.5 bg-[#0f0b11] p-1 rounded-xl border border-rose-900/30">
          <button
            onClick={() => {
              setMode('model');
              stopCamera();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              mode === 'model'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-900/40'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'id' ? 'Model Virtual' : 'Virtual Model'}</span>
          </button>

          <button
            onClick={() => {
              setMode('camera');
              startCamera();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              mode === 'camera'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-900/40'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{lang === 'id' ? 'Kamera AR' : 'Live Camera'}</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              mode === 'upload'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-900/40'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{lang === 'id' ? 'Foto Sendiri' : 'Upload Selfie'}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* View & Utility Actions */}
        <div className="flex items-center gap-2">
          {/* Split Screen Slider Toggle */}
          <button
            onClick={() => setIsSplitting(!isSplitting)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
              isSplitting
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
            }`}
            title={lang === 'id' ? 'Bandingkan Sebelum / Sesudah' : 'Compare Before / After'}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isSplitting
                ? lang === 'id' ? 'Mode Penuh' : 'Full Mode'
                : lang === 'id' ? 'Split Sebelum/Sesudah' : 'Split View'}
            </span>
          </button>

          {/* Hold to Compare Original */}
          <button
            onMouseDown={() => setShowOriginal(true)}
            onMouseUp={() => setShowOriginal(false)}
            onTouchStart={() => setShowOriginal(true)}
            onTouchEnd={() => setShowOriginal(false)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition select-none ${
              showOriginal
                ? 'bg-amber-500/30 text-amber-200 border-amber-500/50'
                : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10 active:scale-95'
            }`}
            title={lang === 'id' ? 'Tahan untuk melihat wajah asli tanpa riasan' : 'Hold to see original bare face'}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{lang === 'id' ? 'Tahan: Asli' : 'Hold: Bare'}</span>
          </button>

          {/* Reset Makeup */}
          <button
            onClick={onResetMakeup}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition"
            title={lang === 'id' ? 'Reset riasan ke awal' : 'Reset makeup'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Export High-Res Snapshot */}
          <button
            onClick={handleExportSnapshot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 text-stone-950 shadow-md shadow-rose-950/50 hover:brightness-110 active:scale-95 transition"
            title={lang === 'id' ? 'Unduh Foto Hasil Riasan' : 'Download High-Res Snapshot'}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="font-medium">{lang === 'id' ? 'Simpan' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport Area */}
      <div
        ref={containerRef}
        className="relative flex-1 flex items-center justify-center overflow-hidden bg-radial from-[#1e1422] via-[#120a15] to-[#070508] select-none p-4"
      >
        {/* Subtle Luxury Lighting Ambient Glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
          style={{
            background: `radial-gradient(circle at 50% 40%, ${makeup.face.highlighterColor}25 0%, transparent 60%)`,
          }}
        />

        {/* Live Camera View (When Active) */}
        {mode === 'camera' && (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
            {/* Camera Face Guide Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="w-72 h-96 rounded-[50%/60%_60%_40%_40%] border-2 border-dashed border-rose-400/50 flex items-center justify-center">
                <span className="text-xs bg-black/60 text-rose-200 px-3 py-1 rounded-full backdrop-blur">
                  {lang === 'id' ? 'Posisikan Wajah di Garis Pandu' : 'Align face in frame'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Uploaded User Photo (When Active) */}
        {mode === 'upload' && uploadedImage && (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0">
            <img
              src={uploadedImage}
              alt="User uploaded selfie"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* High-Fidelity SVG Portrait & Makeup Renderer */}
        <div className="relative w-full max-w-[540px] aspect-[700/860] flex items-center justify-center">
          <svg
            viewBox="0 0 700 860"
            className="w-full h-full filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Complexion & Skin Shading Gradients */}
              <radialGradient id="faceBaseGradient" cx="50%" cy="45%" r="55%">
                <stop offset="0%" stopColor={model.skinHex} />
                <stop
                  offset="70%"
                  stopColor={
                    model.undertone === 'cool'
                      ? '#d69784'
                      : model.undertone === 'warm'
                      ? '#c48962'
                      : '#b88265'
                  }
                />
                <stop offset="100%" stopColor="#2c1a17" stopOpacity="0.8" />
              </radialGradient>

              {/* Natural Skin Volume Shadow */}
              <linearGradient id="neckShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1a0f0d" stopOpacity="0.75" />
                <stop offset="100%" stopColor={model.skinHex} />
              </linearGradient>

              {/* Contour Gradients (Cheekbones & Jawline) */}
              <radialGradient id="contourLeft" cx="30%" cy="50%" r="50%">
                <stop offset="0%" stopColor={makeup.face.contourColor} stopOpacity="0.8" />
                <stop offset="60%" stopColor={makeup.face.contourColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor={makeup.face.contourColor} stopOpacity="0" />
              </radialGradient>

              <radialGradient id="contourRight" cx="70%" cy="50%" r="50%">
                <stop offset="0%" stopColor={makeup.face.contourColor} stopOpacity="0.8" />
                <stop offset="60%" stopColor={makeup.face.contourColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor={makeup.face.contourColor} stopOpacity="0" />
              </radialGradient>

              {/* Highlighter Radial Glow */}
              <radialGradient id="highlighterGleam" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={makeup.face.highlighterColor} stopOpacity="0.9" />
                <stop offset="40%" stopColor={makeup.face.highlighterColor} stopOpacity="0.4" />
                <stop offset="100%" stopColor={makeup.face.highlighterColor} stopOpacity="0" />
              </radialGradient>

              {/* Blush Radial Gradients */}
              <radialGradient id="blushLeftGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={makeup.blush.color} stopOpacity="0.85" />
                <stop offset="60%" stopColor={makeup.blush.color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={makeup.blush.color} stopOpacity="0" />
              </radialGradient>

              <radialGradient id="blushRightGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={makeup.blush.color} stopOpacity="0.85" />
                <stop offset="60%" stopColor={makeup.blush.color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={makeup.blush.color} stopOpacity="0" />
              </radialGradient>

              {/* Lip Gradients (Ombre / Gradient Lip Support) */}
              <radialGradient id="lipOmbreGradient" cx="50%" cy="50%" r="60%">
                <stop
                  offset="0%"
                  stopColor={makeup.lips.ombreInnerColor || '#8c0f26'}
                  stopOpacity="1"
                />
                <stop offset="55%" stopColor={makeup.lips.color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={makeup.lips.color} stopOpacity="0.4" />
              </radialGradient>

              {/* Lip Gloss Specular Highlight */}
              <linearGradient id="lipGlossSheen" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="45%" stopColor="#ffffff" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>

              {/* Eyeshadow Duo Gradients */}
              <linearGradient id="eyeShadowGradLeft" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor={makeup.eyes.primaryColor} stopOpacity="0.9" />
                <stop offset="65%" stopColor={makeup.eyes.secondaryColor} stopOpacity="0.75" />
                <stop offset="100%" stopColor={makeup.eyes.shimmerColor} stopOpacity="0" />
              </linearGradient>

              <linearGradient id="eyeShadowGradRight" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor={makeup.eyes.primaryColor} stopOpacity="0.9" />
                <stop offset="65%" stopColor={makeup.eyes.secondaryColor} stopOpacity="0.75" />
                <stop offset="100%" stopColor={makeup.eyes.shimmerColor} stopOpacity="0" />
              </linearGradient>

              {/* Halo Eye Shimmer center gradient */}
              <radialGradient id="eyeHaloShimmer" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={makeup.eyes.shimmerColor} stopOpacity="0.95" />
                <stop offset="60%" stopColor={makeup.eyes.secondaryColor} stopOpacity="0.4" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>

              {/* Gaussian Blur Filters for Seamless Blending */}
              <filter id="softBlurBlush" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="16" />
              </filter>

              <filter id="softBlurContour" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="18" />
              </filter>

              <filter id="softBlurHighlight" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
              </filter>

              <filter id="softBlurShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
              </filter>

              {/* Split-screen clip path if split mode enabled */}
              <clipPath id="splitClipPath">
                <rect
                  x="0"
                  y="0"
                  width={isSplitting ? (700 * splitPosition) / 100 : 700}
                  height="860"
                />
              </clipPath>
            </defs>

            {/* BASE FACE LAYER (Only shown in 'model' mode) */}
            {mode === 'model' && (
              <g id="baseFace">
                {/* Hair Background Backdrop */}
                <path
                  d="M 170 300 C 140 450, 150 720, 160 860 L 540 860 C 550 720, 560 450, 530 300 C 510 160, 430 70, 350 70 C 270 70, 190 160, 170 300 Z"
                  fill="#181316"
                />

                {/* Neck & Shoulders */}
                <path
                  d="M 285 550 L 285 730 C 285 760, 200 810, 140 860 L 560 860 C 500 810, 415 760, 415 730 L 415 550 Z"
                  fill="url(#neckShadow)"
                />
                {/* Collarbones */}
                <path
                  d="M 270 760 Q 350 790 430 760"
                  fill="none"
                  stroke="#5a392c"
                  strokeWidth="2.5"
                  strokeOpacity="0.3"
                  strokeLinecap="round"
                />

                {/* Main Face Contour Oval */}
                <path
                  d="M 220 330 C 215 480, 260 620, 350 635 C 440 620, 485 480, 480 330 C 475 200, 430 150, 350 150 C 270 150, 225 200, 220 330 Z"
                  fill="url(#faceBaseGradient)"
                />

                {/* Natural Chin & Jaw shading */}
                <path
                  d="M 280 580 Q 350 632 420 580"
                  fill="none"
                  stroke="#633d2e"
                  strokeWidth="5"
                  strokeOpacity="0.25"
                  filter="url(#softBlurShadow)"
                />

                {/* Forehead Shadow & Hairline */}
                <path
                  d="M 220 300 C 260 210, 440 210, 480 300 C 470 200, 420 150, 350 150 C 280 150, 230 200, 220 300 Z"
                  fill="#1a1216"
                  opacity="0.8"
                />

                {/* Ears */}
                <path
                  d="M 220 370 C 195 385, 195 440, 222 460 Z"
                  fill={model.skinHex}
                  stroke="#613b2c"
                  strokeWidth="1.5"
                  strokeOpacity="0.3"
                />
                <path
                  d="M 480 370 C 505 385, 505 440, 478 460 Z"
                  fill={model.skinHex}
                  stroke="#613b2c"
                  strokeWidth="1.5"
                  strokeOpacity="0.3"
                />

                {/* Nose Structure */}
                <g id="noseStructure">
                  {/* Nose Bridge Soft Shadow */}
                  <path
                    d="M 338 340 L 338 435 Q 350 452 362 435 L 362 340"
                    fill="none"
                    stroke="#5e3a2b"
                    strokeWidth="3.5"
                    strokeOpacity="0.2"
                    filter="url(#softBlurShadow)"
                  />
                  {/* Nose Tip & Nostrils */}
                  <path
                    d="M 334 445 C 342 452, 358 452, 366 445"
                    fill="none"
                    stroke="#542e20"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeOpacity="0.5"
                  />
                  <ellipse cx="334" cy="442" rx="4.5" ry="2.5" fill="#422116" opacity="0.6" />
                  <ellipse cx="366" cy="442" rx="4.5" ry="2.5" fill="#422116" opacity="0.6" />
                </g>

                {/* Bare Eyes (Eyes Balls, Irises, Pupils) */}
                <g id="bareEyes">
                  {/* Left Eye White */}
                  <path
                    d="M 260 365 C 275 350, 305 350, 320 365 C 305 380, 275 380, 260 365 Z"
                    fill="#fbf9f8"
                  />
                  {/* Right Eye White */}
                  <path
                    d="M 380 365 C 395 350, 425 350, 440 365 C 425 380, 395 380, 380 365 Z"
                    fill="#fbf9f8"
                  />

                  {/* Left Iris & Pupil */}
                  <circle cx="290" cy="365" r="13" fill="#3b271d" />
                  <circle cx="290" cy="365" r="7" fill="#130c09" />
                  <circle cx="286" cy="361" r="3" fill="#ffffff" opacity="0.9" />
                  <circle cx="293" cy="368" r="1.5" fill="#ffffff" opacity="0.6" />

                  {/* Right Iris & Pupil */}
                  <circle cx="410" cy="365" r="13" fill="#3b271d" />
                  <circle cx="410" cy="365" r="7" fill="#130c09" />
                  <circle cx="406" cy="361" r="3" fill="#ffffff" opacity="0.9" />
                  <circle cx="413" cy="368" r="1.5" fill="#ffffff" opacity="0.6" />

                  {/* Natural Eyelid Crease */}
                  <path
                    d="M 260 355 Q 290 345 320 357"
                    fill="none"
                    stroke="#503125"
                    strokeWidth="1.5"
                    strokeOpacity="0.35"
                  />
                  <path
                    d="M 380 357 Q 410 345 440 355"
                    fill="none"
                    stroke="#503125"
                    strokeWidth="1.5"
                    strokeOpacity="0.35"
                  />
                </g>

                {/* Natural Bare Lips Base */}
                <g id="bareLipsBase">
                  {/* Upper Lip */}
                  <path
                    d="M 305 510 Q 328 498 350 504 Q 372 498 395 510 Q 350 522 305 510 Z"
                    fill="#be7a7a"
                    opacity="0.75"
                  />
                  {/* Lower Lip */}
                  <path
                    d="M 305 510 Q 350 522 395 510 Q 350 550 305 510 Z"
                    fill="#b56d6d"
                    opacity="0.8"
                  />
                  {/* Lip Separation Line */}
                  <path
                    d="M 303 510 Q 328 514 350 511 Q 372 514 397 510"
                    fill="none"
                    stroke="#5c2b2b"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                </g>
              </g>
            )}

            {/* ACTIVE MAKEUP OVERLAYS (Controlled by MakeupState, Hidden if showOriginal) */}
            {!showOriginal && (
              <g id="makeupOverlays" clipPath={isSplitting ? 'url(#splitClipPath)' : undefined}>
                {/* 1. FOUNDATION / SKIN TINT & SMOOTHING COMPLEXION FILTER */}
                {makeup.face.foundationOpacity > 0 && (
                  <path
                    d="M 220 330 C 215 480, 260 620, 350 635 C 440 620, 485 480, 480 330 C 475 200, 430 150, 350 150 C 270 150, 225 200, 220 330 Z"
                    fill={makeup.face.foundationTone}
                    opacity={(makeup.face.foundationOpacity / 100) * 0.45}
                    style={{
                      mixBlendMode:
                        makeup.face.finish === 'matte'
                          ? 'soft-light'
                          : makeup.face.finish === 'dewy'
                          ? 'screen'
                          : 'overlay',
                    }}
                  />
                )}

                {/* 2. CONTOUR & BRONZER LAYER */}
                {makeup.face.contourIntensity > 0 && (
                  <g
                    id="contourLayer"
                    opacity={(makeup.face.contourIntensity / 100) * 0.75}
                    style={{ mixBlendMode: 'multiply' }}
                    filter="url(#softBlurContour)"
                  >
                    {/* Left Cheekbone Hollow */}
                    <ellipse cx="255" cy="475" rx="36" ry="20" fill="url(#contourLeft)" transform="rotate(25 255 475)" />
                    {/* Right Cheekbone Hollow */}
                    <ellipse cx="445" cy="475" rx="36" ry="20" fill="url(#contourRight)" transform="rotate(-25 445 475)" />
                    {/* Nose Bridge Slimming Contour */}
                    <rect x="334" y="350" width="8" height="85" fill={makeup.face.contourColor} rx="4" />
                    <rect x="358" y="350" width="8" height="85" fill={makeup.face.contourColor} rx="4" />
                    {/* Jawline Slimming */}
                    <path
                      d="M 240 540 Q 350 640 460 540"
                      fill="none"
                      stroke={makeup.face.contourColor}
                      strokeWidth="14"
                    />
                  </g>
                )}

                {/* 3. BLUSH LAYER */}
                {makeup.blush.intensity > 0 && (
                  <g
                    id="blushLayer"
                    opacity={(makeup.blush.intensity / 100) * 0.85}
                    style={{ mixBlendMode: 'multiply' }}
                    filter="url(#softBlurBlush)"
                  >
                    {/* Left Cheek Blush */}
                    <ellipse
                      cx={blushCoords.leftCx}
                      cy={blushCoords.leftCy}
                      rx={blushCoords.rx}
                      ry={blushCoords.ry}
                      fill="url(#blushLeftGlow)"
                    />
                    {/* Right Cheek Blush */}
                    <ellipse
                      cx={blushCoords.rightCx}
                      cy={blushCoords.rightCy}
                      rx={blushCoords.rx}
                      ry={blushCoords.ry}
                      fill="url(#blushRightGlow)"
                    />
                    {/* Nose Bridge Sunkissed Flush (if style is sunkissed) */}
                    {makeup.blush.style === 'sunkissed' && (
                      <ellipse
                        cx="350"
                        cy="445"
                        rx="35"
                        ry="16"
                        fill="url(#blushLeftGlow)"
                        opacity="0.8"
                      />
                    )}
                  </g>
                )}

                {/* 4. HIGHLIGHTER LAYER */}
                {makeup.face.highlighterIntensity > 0 && (
                  <g
                    id="highlighterLayer"
                    opacity={(makeup.face.highlighterIntensity / 100) * 0.9}
                    style={{ mixBlendMode: 'screen' }}
                    filter="url(#softBlurHighlight)"
                  >
                    {/* Left Cheekbone High Point */}
                    <ellipse cx="265" cy="425" rx="22" ry="12" fill="url(#highlighterGleam)" transform="rotate(-15 265 425)" />
                    {/* Right Cheekbone High Point */}
                    <ellipse cx="435" cy="425" rx="22" ry="12" fill="url(#highlighterGleam)" transform="rotate(15 435 425)" />
                    {/* Nose Bridge & Tip Shimmer */}
                    <ellipse cx="350" cy="370" rx="3" ry="18" fill="url(#highlighterGleam)" />
                    <circle cx="350" cy="436" r="5" fill="url(#highlighterGleam)" />
                    {/* Cupid's Bow Highlight */}
                    <path
                      d="M 344 496 Q 350 493 356 496"
                      fill="none"
                      stroke={makeup.face.highlighterColor}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Inner Eye Corner Highlights */}
                    <circle cx="265" cy="365" r="3.5" fill="url(#highlighterGleam)" />
                    <circle cx="435" cy="365" r="3.5" fill="url(#highlighterGleam)" />
                  </g>
                )}

                {/* 5. FAUX FRECKLES (If enabled) */}
                {makeup.face.freckles > 0 && (
                  <g id="frecklesLayer" opacity={(makeup.face.freckles / 100) * 0.75} fill="#5c3826">
                    <circle cx="330" cy="445" r="1.3" />
                    <circle cx="338" cy="448" r="1" />
                    <circle cx="347" cy="442" r="1.4" />
                    <circle cx="355" cy="446" r="1.1" />
                    <circle cx="363" cy="443" r="1.3" />
                    <circle cx="315" cy="452" r="1.2" />
                    <circle cx="324" cy="456" r="0.9" />
                    <circle cx="375" cy="452" r="1.1" />
                    <circle cx="385" cy="456" r="1.4" />
                    <circle cx="305" cy="458" r="1.3" />
                    <circle cx="395" cy="458" r="1" />
                  </g>
                )}

                {/* 6. EYEBROW LAYER */}
                {makeup.eyes.browIntensity > 0 && (
                  <g
                    id="eyebrowsLayer"
                    opacity={(makeup.eyes.browIntensity / 100) * 0.95}
                    stroke={makeup.eyes.browColor}
                    strokeLinecap="round"
                  >
                    {/* Left Eyebrow */}
                    {makeup.eyes.browStyle === 'straight' ? (
                      <path d="M 250 328 Q 285 320 320 325" fill="none" strokeWidth="6" />
                    ) : makeup.eyes.browStyle === 'defined' ? (
                      <path d="M 250 332 Q 285 315 305 316 Q 320 328 322 334" fill="none" strokeWidth="5.5" />
                    ) : makeup.eyes.browStyle === 'feathered' ? (
                      <g>
                        <path d="M 252 330 Q 285 318 320 324" fill="none" strokeWidth="5" strokeOpacity="0.8" />
                        {/* Micro hair strokes */}
                        <line x1="255" y1="334" x2="258" y2="326" strokeWidth="1.5" />
                        <line x1="265" y1="332" x2="270" y2="322" strokeWidth="1.5" />
                        <line x1="278" y1="329" x2="284" y2="319" strokeWidth="1.5" />
                        <line x1="292" y1="326" x2="298" y2="318" strokeWidth="1.5" />
                        <line x1="306" y1="325" x2="313" y2="321" strokeWidth="1.5" />
                      </g>
                    ) : (
                      <path d="M 252 330 Q 285 320 320 326" fill="none" strokeWidth="4.5" strokeOpacity="0.85" />
                    )}

                    {/* Right Eyebrow */}
                    {makeup.eyes.browStyle === 'straight' ? (
                      <path d="M 450 328 Q 415 320 380 325" fill="none" strokeWidth="6" />
                    ) : makeup.eyes.browStyle === 'defined' ? (
                      <path d="M 450 332 Q 415 315 395 316 Q 380 328 378 334" fill="none" strokeWidth="5.5" />
                    ) : makeup.eyes.browStyle === 'feathered' ? (
                      <g>
                        <path d="M 448 330 Q 415 318 380 324" fill="none" strokeWidth="5" strokeOpacity="0.8" />
                        {/* Micro hair strokes */}
                        <line x1="445" y1="334" x2="442" y2="326" strokeWidth="1.5" />
                        <line x1="435" y1="332" x2="430" y2="322" strokeWidth="1.5" />
                        <line x1="422" y1="329" x2="416" y2="319" strokeWidth="1.5" />
                        <line x1="408" y1="326" x2="402" y2="318" strokeWidth="1.5" />
                        <line x1="394" y1="325" x2="387" y2="321" strokeWidth="1.5" />
                      </g>
                    ) : (
                      <path d="M 448 330 Q 415 320 380 326" fill="none" strokeWidth="4.5" strokeOpacity="0.85" />
                    )}
                  </g>
                )}

                {/* 7. EYESHADOW LAYER */}
                {makeup.eyes.intensity > 0 && (
                  <g
                    id="eyeshadowLayer"
                    opacity={(makeup.eyes.intensity / 100) * 0.9}
                    style={{ mixBlendMode: 'multiply' }}
                    filter="url(#softBlurShadow)"
                  >
                    {/* Left Eye Shadow Wash */}
                    <path
                      d="M 252 368 C 265 335, 310 335, 326 366 C 310 355, 270 355, 252 368 Z"
                      fill="url(#eyeShadowGradLeft)"
                    />
                    {/* Right Eye Shadow Wash */}
                    <path
                      d="M 374 366 C 390 335, 435 335, 448 368 C 430 355, 390 355, 374 366 Z"
                      fill="url(#eyeShadowGradRight)"
                    />

                    {/* Halo Eye Center Shimmer (If halo style) */}
                    {makeup.eyes.eyeshadowStyle === 'halo' && (
                      <g style={{ mixBlendMode: 'screen' }}>
                        <ellipse cx="290" cy="354" rx="14" ry="10" fill="url(#eyeHaloShimmer)" />
                        <ellipse cx="410" cy="354" rx="14" ry="10" fill="url(#eyeHaloShimmer)" />
                      </g>
                    )}

                    {/* Smokey Outer V Deepening */}
                    {makeup.eyes.eyeshadowStyle === 'smokey' && (
                      <g>
                        <path
                          d="M 252 368 C 255 350, 275 345, 270 365 Z"
                          fill={makeup.eyes.primaryColor}
                          opacity="0.8"
                        />
                        <path
                          d="M 448 368 C 445 350, 425 345, 430 365 Z"
                          fill={makeup.eyes.primaryColor}
                          opacity="0.8"
                        />
                      </g>
                    )}
                  </g>
                )}

                {/* 8. EYELINER LAYER */}
                {makeup.eyes.eyelinerStyle !== 'none' && (
                  <g
                    id="eyelinerLayer"
                    stroke={makeup.eyes.eyelinerColor}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={makeup.eyes.eyelinerThickness * 1.4}
                    fill="none"
                  >
                    {/* Base Upper Lashline - Left */}
                    <path d="M 260 365 Q 290 351 320 365" />
                    {/* Base Upper Lashline - Right */}
                    <path d="M 380 365 Q 410 351 440 365" />

                    {/* Winged Styles */}
                    {makeup.eyes.eyelinerStyle === 'winged' && (
                      <>
                        <path d="M 260 365 L 246 357 L 253 364 Z" fill={makeup.eyes.eyelinerColor} strokeWidth="1" />
                        <path d="M 440 365 L 454 357 L 447 364 Z" fill={makeup.eyes.eyelinerColor} strokeWidth="1" />
                      </>
                    )}
                    {makeup.eyes.eyelinerStyle === 'cat' && (
                      <>
                        <path d="M 260 365 L 242 352 L 252 363 Z" fill={makeup.eyes.eyelinerColor} strokeWidth="1" />
                        <path d="M 440 365 L 458 352 L 448 363 Z" fill={makeup.eyes.eyelinerColor} strokeWidth="1" />
                      </>
                    )}
                    {makeup.eyes.eyelinerStyle === 'puppy' && (
                      <>
                        <path d="M 260 365 L 249 369" strokeWidth="2.5" />
                        <path d="M 440 365 L 451 369" strokeWidth="2.5" />
                      </>
                    )}
                    {makeup.eyes.eyelinerStyle === 'graphic' && (
                      <>
                        <path d="M 260 365 L 244 354" strokeWidth="2" />
                        <path d="M 244 354 Q 285 340 310 348" strokeWidth="1.5" />
                        <path d="M 440 365 L 456 354" strokeWidth="2" />
                        <path d="M 456 354 Q 415 340 390 348" strokeWidth="1.5" />
                      </>
                    )}
                  </g>
                )}

                {/* 9. MASCARA & FALSE LASHES */}
                {makeup.eyes.mascaraIntensity > 0 && (
                  <g
                    id="lashesLayer"
                    opacity={(makeup.eyes.mascaraIntensity / 100) * 0.95}
                    stroke="#110d0f"
                    strokeLinecap="round"
                  >
                    {/* Left Eye Upper Lashes */}
                    <line x1="262" y1="363" x2="256" y2="354" strokeWidth="1.6" />
                    <line x1="272" y1="358" x2="268" y2="348" strokeWidth="1.8" />
                    <line x1="282" y1="354" x2="280" y2="344" strokeWidth="2.2" />
                    <line x1="292" y1="353" x2="292" y2="342" strokeWidth="2.2" />
                    <line x1="302" y1="355" x2="304" y2="344" strokeWidth="2.0" />
                    <line x1="312" y1="359" x2="316" y2="349" strokeWidth="1.8" />

                    {/* Right Eye Upper Lashes */}
                    <line x1="438" y1="363" x2="444" y2="354" strokeWidth="1.6" />
                    <line x1="428" y1="358" x2="432" y2="348" strokeWidth="1.8" />
                    <line x1="418" y1="354" x2="420" y2="344" strokeWidth="2.2" />
                    <line x1="408" y1="353" x2="408" y2="342" strokeWidth="2.2" />
                    <line x1="398" y1="355" x2="396" y2="344" strokeWidth="2.0" />
                    <line x1="388" y1="359" x2="384" y2="349" strokeWidth="1.8" />

                    {/* Extra Volume Doll Spikes */}
                    {(makeup.eyes.mascaraStyle === 'volume' || makeup.eyes.mascaraStyle === 'doll') && (
                      <>
                        <line x1="276" y1="356" x2="273" y2="343" strokeWidth="2.4" />
                        <line x1="297" y1="354" x2="298" y2="340" strokeWidth="2.6" />
                        <line x1="424" y1="356" x2="427" y2="343" strokeWidth="2.4" />
                        <line x1="403" y1="354" x2="402" y2="340" strokeWidth="2.6" />
                      </>
                    )}
                  </g>
                )}

                {/* 10. LIPSTICK LAYER */}
                {makeup.lips.intensity > 0 && (
                  <g id="lipstickLayer">
                    {/* Lip Liner (If enabled) */}
                    {makeup.lips.lipLiner && (
                      <path
                        d="M 302 510 Q 328 495 350 502 Q 372 495 398 510 Q 350 554 302 510 Z"
                        fill="none"
                        stroke={makeup.lips.linerColor}
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                        opacity={(makeup.lips.intensity / 100) * 0.9}
                      />
                    )}

                    {/* Main Lip Surface Fill */}
                    {makeup.lips.finish === 'ombre' ? (
                      /* K-Beauty Ombre Lip Gradient */
                      <g>
                        {/* Outer Diffused Lip base */}
                        <path
                          d="M 304 510 Q 328 497 350 503 Q 372 497 396 510 Q 350 550 304 510 Z"
                          fill={makeup.lips.color}
                          opacity={(makeup.lips.intensity / 100) * 0.85}
                          style={{ mixBlendMode: 'multiply' }}
                        />
                        {/* Inner Gradient Pop */}
                        <path
                          d="M 318 511 Q 334 505 350 507 Q 366 505 382 511 Q 350 535 318 511 Z"
                          fill="url(#lipOmbreGradient)"
                          opacity={(makeup.lips.intensity / 100) * 0.95}
                          style={{ mixBlendMode: 'multiply' }}
                        />
                      </g>
                    ) : (
                      /* Standard Lip Surface */
                      <g>
                        <path
                          d="M 304 510 Q 328 497 350 503 Q 372 497 396 510 Q 350 550 304 510 Z"
                          fill={makeup.lips.color}
                          opacity={(makeup.lips.intensity / 100) * 0.9}
                          style={{
                            mixBlendMode:
                              makeup.lips.finish === 'matte'
                                ? 'multiply'
                                : makeup.lips.finish === 'metallic'
                                ? 'color-burn'
                                : 'multiply',
                          }}
                        />
                      </g>
                    )}

                    {/* Specular Gloss & Shimmer Overlay (Glossy or High Highlight) */}
                    {(makeup.lips.finish === 'glossy' || (makeup.lips.glossHighlight && makeup.lips.glossHighlight > 20)) && (
                      <g style={{ mixBlendMode: 'screen' }} opacity={(makeup.lips.glossHighlight / 100) * 0.85}>
                        {/* Lower Lip Glass Reflection */}
                        <ellipse cx="350" cy="530" rx="24" ry="7" fill="url(#lipGlossSheen)" />
                        {/* Upper Lip Cupid Reflection */}
                        <ellipse cx="350" cy="505" rx="14" ry="3.5" fill="url(#lipGlossSheen)" />
                        <circle cx="342" cy="528" r="2.5" fill="#ffffff" opacity="0.9" />
                        <circle cx="358" cy="529" r="1.8" fill="#ffffff" opacity="0.7" />
                      </g>
                    )}

                    {/* Metallic Micro Shimmer */}
                    {makeup.lips.finish === 'metallic' && (
                      <g style={{ mixBlendMode: 'screen' }} opacity="0.65">
                        <ellipse cx="350" cy="522" rx="35" ry="14" fill="#fed7aa" filter="url(#softBlurHighlight)" />
                      </g>
                    )}
                  </g>
                )}
              </g>
            )}

            {/* Split Screen Separator Line & Label Handle */}
            {isSplitting && !showOriginal && (
              <g id="splitHandle">
                <line
                  x1={(700 * splitPosition) / 100}
                  y1="0"
                  x2={(700 * splitPosition) / 100}
                  y2="860"
                  stroke="#f43f5e"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                />
                <circle
                  cx={(700 * splitPosition) / 100}
                  cy="430"
                  r="18"
                  fill="#f43f5e"
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))"
                />
                <path
                  d={`M ${(700 * splitPosition) / 100 - 6} 430 L ${(700 * splitPosition) / 100 - 1} 425 L ${(700 * splitPosition) / 100 - 1} 435 Z M ${(700 * splitPosition) / 100 + 6} 430 L ${(700 * splitPosition) / 100 + 1} 425 L ${(700 * splitPosition) / 100 + 1} 435 Z`}
                  fill="#ffffff"
                />
              </g>
            )}
          </svg>

          {/* Interactive Draggable Split Handle on Top */}
          {isSplitting && !showOriginal && (
            <div
              className="absolute inset-y-0 w-8 -ml-4 cursor-ew-resize z-30 flex items-center justify-center"
              style={{ left: `${splitPosition}%` }}
              onMouseDown={(e) => {
                const startX = e.clientX;
                const startPos = splitPosition;
                const onMouseMove = (moveEvent: MouseEvent) => {
                  if (!containerRef.current) return;
                  const rect = containerRef.current.getBoundingClientRect();
                  const newX = moveEvent.clientX - rect.left;
                  const newPercent = Math.max(10, Math.min(90, (newX / rect.width) * 100));
                  setSplitPosition(newPercent);
                };
                const onMouseUp = () => {
                  window.removeEventListener('mousemove', onMouseMove);
                  window.removeEventListener('mouseup', onMouseUp);
                };
                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('mouseup', onMouseUp);
              }}
              onTouchMove={(e) => {
                if (!containerRef.current) return;
                const rect = containerRef.current.getBoundingClientRect();
                const touch = e.touches[0];
                const newX = touch.clientX - rect.left;
                const newPercent = Math.max(10, Math.min(90, (newX / rect.width) * 100));
                setSplitPosition(newPercent);
              }}
            >
              <div className="w-1.5 h-12 bg-white rounded-full shadow-lg" />
            </div>
          )}

          {/* Floating Badges */}
          {showOriginal && (
            <div className="absolute top-4 left-4 bg-amber-500/90 text-stone-950 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg">
              {lang === 'id' ? 'Wajah Asli (Bare Face)' : 'Original Bare Face'}
            </div>
          )}

          {isSplitting && !showOriginal && (
            <>
              <div
                className="absolute top-4 px-3 py-1 rounded-full text-[11px] font-semibold bg-black/60 text-rose-300 border border-rose-500/30 backdrop-blur"
                style={{ left: `${Math.max(2, splitPosition / 2 - 10)}%` }}
              >
                {lang === 'id' ? '✨ Dirias' : '✨ Glow Look'}
              </div>
              <div
                className="absolute top-4 px-3 py-1 rounded-full text-[11px] font-semibold bg-black/60 text-zinc-300 border border-white/20 backdrop-blur"
                style={{ right: `${Math.max(2, (100 - splitPosition) / 2 - 10)}%` }}
              >
                {lang === 'id' ? 'Polos' : 'Bare'}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Model Name & Undertone Info Bar */}
      <div className="px-4 py-2.5 bg-[#160f18] border-t border-rose-950/40 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: model.skinHex }} />
          <span className="font-semibold text-zinc-200">{model.name}</span>
          <span className="text-zinc-500">•</span>
          <span>{model.skinToneName}</span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] bg-rose-950/50 text-rose-300 border border-rose-800/40 uppercase tracking-wider font-semibold">
            {model.undertone}
          </span>
        </div>
        <div className="text-[11px] text-zinc-500">
          {lang === 'id' ? 'Klik & geser tab di bawah untuk berkreasi' : 'Use controls below to customize'}
        </div>
      </div>
    </div>
  );
};
