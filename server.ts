import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();

function getPort(): number {
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    return parseInt(process.argv[portArgIndex + 1], 10);
  }
  return parseInt(process.env.PORT || '3000', 10);
}

const PORT = getPort();
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client if a valid API key is present
const apiKey = process.env.GEMINI_API_KEY;
const isValidKey = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 15);

let ai: GoogleGenAI | null = null;
if (isValidKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey!,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
      timeout: 10000,
    },
  });
}

// Timeout wrapper to guarantee lightning-fast responses even during API demand spikes
async function withTimeout<T>(promise: Promise<T>, fallbackValue: T, ms = 4500): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => {
      resolve(fallbackValue);
    }, ms);
  });

  try {
    const res = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timer!);
    return res;
  } catch (e) {
    clearTimeout(timer!);
    return fallbackValue;
  }
}

// Rich Fallback Knowledge Base for Indonesian Make-Up Consultation
function generateFallbackAdvisorResponse(message: string, context?: any): string {
  const lower = message.toLowerCase();

  if (lower.includes('wisuda') || lower.includes('graduation')) {
    return `🎓 **Panduan Makeup Wisuda Tahan Lama & Photogenic**:
1. **Skin Prep**: Gunakan hydrating toner dan moisturizer gel water-based agar kompleksi tidak cepat berminyak di bawah lampu gedung seremoni.
2. **Complexion**: Aplikasikan primer mattifying di area T-Zone. Ratakan foundation satin-matte tipis bertahap dengan teknik tap-tap puff cushion lembab.
3. **Mata**: Riasan mata soft glam dengan gradasi cokelat hangat & shimmer champagne di kelopak agar mata tampak segar dan berdimensi di kamera foto studio!
4. **Bibir**: Gunakan teknik ombre lips (nude rose sebagai base, deep berry di bagian dalam) lalu lapisi lip tint stain agar awet walau dipakai berjam-jam.
5. **Setting**: Kunci dengan translucent powder (teknik baking ringan bawah mata) dan semprotkan setting spray!`;
  }

  if (lower.includes('sage') || lower.includes('hijau') || lower.includes('green')) {
    return `🌿 **Kombinasi Makeup untuk Gaun Sage Green / Emerald**:
- **Bibir**: Warna bernuansa hangat seperti **Warm Terracotta**, **Peachy Nude**, atau **Cinnamon Rose**. Hindari pink neon dingin yang bertabrakan dengan rona zaitun.
- **Mata**: Palet emas sampanye (Champagne Gold), bronze hangat, atau peach shimmer. Padukan dengan winged eyeliner tipis agar tatapan mata terdefinisi anggun.
- **Blush On**: Warm peach atau apricot glow dengan sapuan lembut di atas tulang pipi ke arah pelipis.
- **Aksen**: Sedikit highlighter champagne di tulang pipi tertinggi dan ujung cupids bow!`;
  }

  if (lower.includes('berminyak') || lower.includes('oily')) {
    return `✨ **Tips Riasan Tahan Seharian untuk Kulit Berminyak**:
- **Pori-pori & Primer**: Gunakan pore-blurring primer khusus di area T-zone (dahi, hidung, dagu).
- **Foundation**: Pilih foundation oil-free berformula velvet atau matte. Hindari serum foundation yang terlalu basah.
- **Teknik Bedak**: Aplikasikan loose powder dengan velvet powder puff dengan cara ditekan perlahan, bukan disapu.
- **Blush & Bronzer**: Pilih blush berbentuk powder daripada cream yang mudah luntur saat terkena sebum.
- **Finishing**: Selalu siapkan blotting paper dan gunakan matte setting spray berkekuatan transfer-proof.`;
  }

  if (lower.includes('kering') || lower.includes('dry')) {
    return `💧 **Tips Riasan Dewy Glowing untuk Kulit Kering**:
- **Hidrasi Kunci Utama**: Aplikasikan hydrating serum kaya hyaluronic acid + moisturizer krim sebelum primer.
- **Primer**: Gunakan illuminating / hydrating primer untuk memberi efek glowing dari dalam kulit.
- **Complexion**: Pilih cushion dewy, skin tint, atau serum foundation. Hindari foundation dead-matte yang mempertegas dry patches.
- **Cream Blush & Liquid Highlighter**: Sangat direkomendasikan karena menyatu alami dengan kulit tanpa terlihat powdery.
- **Finishing**: Hindari bedak di seluruh wajah; cukup kunci area T-zone yang mudah crease secara minimalis.`;
  }

  if (lower.includes('bibir') || lower.includes('lip') || lower.includes('ombre')) {
    return `💄 **Rahasia Ombre Lips K-Beauty Halus Tanpa Crack**:
1. Eksfoliasi bibir dengan lip scrub dan lembabkan dengan lip balm selama 5 menit, lalu bersihkan sisa minyak berlebih.
2. Ratakan sedikit concealer atau sisa foundation di tepi garis bibir untuk menyamarkan batas gelap alami.
3. Aplikasikan lipstik nude (peachy nude atau dusty rose) di seluruh permukaan bibir sebagai base.
4. Oleskan shade yang lebih pekat (deep cherry, wine, atau ruby red) tepat di bagian tengah/dalam bibir.
5. Baurkan batasnya menggunakan ujung jari manis dengan gerakan menepuk ke arah luar.
6. Opsional: Tambahkan clear lip gloss di bagian tengah untuk efek plumpy juicy lips!`;
  }

  return `✨ **Rekomendasi Makeup GlowStudio**:
Untuk menciptakan riasan yang memukau dan tahan seharian:
1. **Kenali Undertone**: Cek undertone Anda di tab "Tes Personal Color" GlowStudio untuk memastikan foundation, blush, dan lipstik menyatu sempurna tanpa terlihat ashy/kusam.
2. **Keseimbangan Fokus**: Jika riasan mata dramatis (smokey / graphic liner), seimbangkan dengan bibir nude atau gloss lembut. Sebaliknya jika memakai bold red lips, buat riasan mata lebih minimalis dan berfokus pada bulu mata lentik.
3. **Pencahayaan**: Coba langsung di Studio Rias Virtual dengan berbagai pencahayaan dan model wajah untuk melihat hasil simulasi real-time!`;
}

function getFallbackRecipe(occasion?: string, outfitColor?: string, style?: string): any {
  return {
    lookName: `${occasion ? occasion.split('/')[0].trim() : 'Special'} Glamour`,
    tagline: 'Pesona Anggun, Berkilau, & Tahan Lama',
    description: `Riasan yang dikurasi khusus untuk acara ${occasion || 'spesial'} berpadu harmonis dengan outfit ${outfitColor || 'favorit'}. Menampilkan kompleksi mulus berkilau dengan sentuhan mata yang memikat.`,
    lips: {
      color: '#d44958',
      finish: 'ombre',
      intensity: 85,
    },
    blush: {
      color: '#f07d75',
      style: 'apples',
      intensity: 60,
    },
    eyeshadow: {
      primaryColor: '#b87d60',
      secondaryColor: '#f2c89f',
      style: 'duo',
      intensity: 70,
    },
    eyeliner: {
      style: 'winged',
      color: '#1a1412',
      thickness: 2,
    },
    highlighter: {
      color: '#faeed2',
      intensity: 75,
    },
    contour: {
      intensity: 45,
    },
    proTips: [
      'Gunakan teknik baking tipis di bawah kontur pipi untuk garis rahang yang lebih terdefinisi.',
      'Aplikasikan highlighter di tulang pipi tertinggi dan ujung cupids bow bibir.',
      'Kombinasikan lip gloss di bagian tengah bibir untuk efek bibir plumpy segar.'
    ],
    productSuggestions: [
      { category: 'Lipstik', product: 'Velvet Lip Tint Stain', shade: 'Rose Terracotta' },
      { category: 'Eyeshadow', product: 'Sunset Warmth Palette', shade: 'Shimmer Bronze & Champagne' },
      { category: 'Blush', product: 'Luminous Cheek Blush', shade: 'Warm Coral Blossom' }
    ]
  };
}

// 1. AI Beauty Consultant Chat endpoint
app.post('/api/beauty-consultant', async (req: Request, res: Response) => {
  try {
    const { message, context, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const fallback = generateFallbackAdvisorResponse(message, context);

    if (!ai) {
      return res.json({ reply: fallback, source: 'knowledge-base' });
    }

    const systemPrompt = `Anda adalah GlowAdvisor, seorang Make-Up Artist (MUA) profesional, ahli estetika, dan konsultan kecantikan bersertifikat internasional.
Bahasa utama Anda adalah Bahasa Indonesia yang ramah, santun, modis, profesional, dan inspiratif.
Berikan saran makeup yang praktis, mencakup rekomendasi warna, langkah teknik, dan tips ketahanan. Jawab dengan format markdown rapi berstruktur.`;

    const chatHistory = Array.isArray(history) ? history.map((h: any) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text || h.content || '' }]
    })) : [];

    const contents = [
      ...chatHistory,
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    const generatePromise = (async () => {
      const response = await ai!.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });
      return response.text || fallback;
    })();

    const reply = await withTimeout(generatePromise, fallback, 4500);
    return res.json({ reply, source: 'gemini' });
  } catch (error: any) {
    const fallback = generateFallbackAdvisorResponse(req.body.message || '', req.body.context);
    return res.json({ reply: fallback, source: 'fallback' });
  }
});

// 2. Custom Look AI Generator endpoint
app.post('/api/recommend-look', async (req: Request, res: Response) => {
  try {
    const { occasion, outfitColor, style, skinTone, eyeShape } = req.body;
    const fallbackResult = getFallbackRecipe(occasion, outfitColor, style);

    if (!ai) {
      return res.json(fallbackResult);
    }

    const prompt = `Hasilkan resep formula makeup lengkap dalam format JSON murni untuk profil berikut:
- Acara: ${occasion || 'Pesta Malam'}
- Warna Outfit: ${outfitColor || 'Hitam / Netral'}
- Gaya Riasan yang Diminati: ${style || 'Korean Glam / Soft Glam'}
- Skintone / Undertone: ${skinTone || 'Medium Warm'}
- Bentuk Mata: ${eyeShape || 'Almond'}

Balas HANYA dengan objek JSON valid dengan field: lookName, tagline, description, lips { color, finish, intensity }, blush { color, style, intensity }, eyeshadow { primaryColor, secondaryColor, style, intensity }, eyeliner { style, color, thickness }, highlighter { color, intensity }, contour { intensity }, proTips (array string).`;

    const generatePromise = (async () => {
      const response = await ai!.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });
      const text = response.text?.trim() || '{}';
      return JSON.parse(text);
    })();

    const finalResult = await withTimeout(generatePromise, fallbackResult, 4500);
    return res.json(finalResult);
  } catch (error) {
    return res.json(getFallbackRecipe(req.body.occasion, req.body.outfitColor, req.body.style));
  }
});

async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ GlowStudio Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
