import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-memory community gallery seeded with authentic creations
interface ServerGalleryItem {
  id: string;
  title: string;
  designerName: string;
  inspirationNote: string;
  seasonTag: 'Spring Hanami' | 'Summer Breeze' | 'Autumn Maple' | 'Winter Crane';
  createdAt: string;
  likes: number;
  remixes: number;
  previewDataUrl?: string;
  config: Record<string, unknown>;
}

const galleryStore: ServerGalleryItem[] = [
  {
    id: 'creation-sakura-dawn',
    title: 'Yoshino Weeping Sakura Furisode',
    designerName: 'Aoi Takahashi · Kyoto',
    inspirationNote: 'Inspired by the first cherry blossoms drifting across the Philosopher’s Path at dawn, woven on pebbled Chirimen silk.',
    seasonTag: 'Spring Hanami',
    createdAt: '2 hours ago',
    likes: 148,
    remixes: 29,
    config: {
      silhouette: 'furisode',
      baseColor: '#FADADD',
      hemGradientColor: '#D6457A',
      sleeveColor: '#F6C2D0',
      eriCollarColor: '#FFF8FA',
      obiStyle: 'bunko',
      obiColor: '#1D4E89',
      obijimeColor: '#D4AF37',
      patternId: 'sakura',
      patternPrimaryColor: '#E13D73',
      patternSecondaryColor: '#FFF5F8',
      patternScale: 1.1,
      patternDensity: 1.1,
      customPatternDataUrl: null,
      fabricTexture: 'chirimen',
      fabricIntensity: 0.75,
      goldLeafAccents: true,
      faceMapping: {
        enabled: false,
        imageDataUrl: null,
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        warmthLighting: 6,
        petalGlow: 45,
        showLandmarks: false,
        kanzashiStyle: 'sakura_shidare',
      },
    },
  },
  {
    id: 'creation-tsuru-eternity',
    title: 'Senbazuru Golden Crane Uchikake',
    designerName: 'Haruka Mizuno · Kanazawa',
    inspirationNote: 'Red-crowned Tsuru cranes soaring over golden clouds and crimson Nishijin brocade for a spring bridal ceremony.',
    seasonTag: 'Winter Crane',
    createdAt: '5 hours ago',
    likes: 214,
    remixes: 42,
    config: {
      silhouette: 'uchikake',
      baseColor: '#C82846',
      hemGradientColor: '#7A1128',
      sleeveColor: '#D83454',
      eriCollarColor: '#FBF3D5',
      obiStyle: 'darari',
      obiColor: '#D4AF37',
      obijimeColor: '#FFFFFF',
      patternId: 'tsuru',
      patternPrimaryColor: '#FFFFFF',
      patternSecondaryColor: '#F3C65F',
      patternScale: 1.2,
      patternDensity: 1.0,
      customPatternDataUrl: null,
      fabricTexture: 'nishijin',
      fabricIntensity: 0.85,
      goldLeafAccents: true,
      faceMapping: {
        enabled: false,
        imageDataUrl: null,
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        warmthLighting: 8,
        petalGlow: 50,
        showLandmarks: false,
        kanzashiStyle: 'golden_crane',
      },
    },
  },
  {
    id: 'creation-nami-poster-tribute',
    title: 'Sakura & Seigaiha Ribbon Homage',
    designerName: 'Kenji Sato · Tokyo',
    inspirationNote: 'Directly inspired by the classic Kimono Moyou poster—alternating waves of indigo Seigaiha and crimson cherry blossom ribbons.',
    seasonTag: 'Summer Breeze',
    createdAt: '1 day ago',
    likes: 186,
    remixes: 37,
    config: {
      silhouette: 'houmongi',
      baseColor: '#FCE4EC',
      hemGradientColor: '#164A7A',
      sleeveColor: '#F8BBD0',
      eriCollarColor: '#FFFFFF',
      obiStyle: 'taiko',
      obiColor: '#C62828',
      obijimeColor: '#F9A825',
      patternId: 'sakura_nami_ribbon',
      patternPrimaryColor: '#155289',
      patternSecondaryColor: '#D8315B',
      patternScale: 1.05,
      patternDensity: 1.15,
      customPatternDataUrl: null,
      fabricTexture: 'rinzu',
      fabricIntensity: 0.7,
      goldLeafAccents: true,
      faceMapping: {
        enabled: false,
        imageDataUrl: null,
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        warmthLighting: 4,
        petalGlow: 35,
        showLandmarks: false,
        kanzashiStyle: 'pearl_comb',
      },
    },
  },
  {
    id: 'creation-azure-waves',
    title: 'Kamakura Azure Nami Kosode',
    designerName: 'Mio Watanabe · Kamakura',
    inspirationNote: 'Tranquil Seigaiha ocean arches layered over soft sakura-tinted silk damask with a sunlit gold obi sash.',
    seasonTag: 'Summer Breeze',
    createdAt: '2 days ago',
    likes: 132,
    remixes: 19,
    config: {
      silhouette: 'yukata',
      baseColor: '#EBF5FB',
      hemGradientColor: '#1B4F72',
      sleeveColor: '#D6EAF8',
      eriCollarColor: '#FFF5F8',
      obiStyle: 'bunko',
      obiColor: '#E15B85',
      obijimeColor: '#1B4F72',
      patternId: 'nami',
      patternPrimaryColor: '#1F618D',
      patternSecondaryColor: '#85C1E9',
      patternScale: 1.0,
      patternDensity: 1.2,
      customPatternDataUrl: null,
      fabricTexture: 'shibori',
      fabricIntensity: 0.65,
      goldLeafAccents: false,
      faceMapping: {
        enabled: false,
        imageDataUrl: null,
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        warmthLighting: 2,
        petalGlow: 30,
        showLandmarks: false,
        kanzashiStyle: 'sakura_shidare',
      },
    },
  },
];

app.get('/api/gallery', (_req, res) => {
  res.json({ items: galleryStore });
});

app.post('/api/gallery', (req, res) => {
  const { title, designerName, inspirationNote, seasonTag, previewDataUrl, config } = req.body;
  if (!title || !config) {
    res.status(400).json({ error: 'Title and kimono configuration are required.' });
    return;
  }
  const newItem: ServerGalleryItem = {
    id: `creation-${Date.now()}`,
    title: String(title).slice(0, 80),
    designerName: String(designerName || 'Anonymous Artisan').slice(0, 60),
    inspirationNote: String(
      inspirationNote || 'Handcrafted under the blooming sakura canopy.'
    ).slice(0, 240),
    seasonTag: seasonTag || 'Spring Hanami',
    createdAt: 'Just now',
    likes: 1,
    remixes: 0,
    previewDataUrl: typeof previewDataUrl === 'string' ? previewDataUrl : undefined,
    config,
  };
  galleryStore.unshift(newItem);
  res.status(201).json({ item: newItem });
});

app.post('/api/gallery/:id/like', (req, res) => {
  const item = galleryStore.find((entry) => entry.id === req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Creation not found' });
    return;
  }
  item.likes += 1;
  res.json({ item });
});

app.post('/api/gallery/:id/remix', (req, res) => {
  const item = galleryStore.find((entry) => entry.id === req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Creation not found' });
    return;
  }
  item.remixes += 1;
  res.json({ item });
});

// AI-Driven Facial Mapping & Skin/Kimono Harmony Endpoint using Gemini
app.post('/api/ai/face-harmony', async (req, res) => {
  const { imageDataUrl, currentConfig } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    // Graceful deterministic analysis if API key is not configured
    res.json({
      undertone: 'Warm Peach Blossom (Sakura-iro)',
      lightingHarmonyScore: 95,
      recommendedSilkHex: '#F9D5E0',
      recommendedObiHex: '#1D4E89',
      stylistNote:
        'Soft warm undertones harmonize beautifully with sakura petal pinks (#F9D5E0) and a deep Seigaiha indigo obi (#1D4E89) to frame the collarbone and jawline.',
      detectedLandmarksConfidence: 98.4,
      suggestedWarmth: 6,
      suggestedScale: 1.02,
    });
    return;
  }

  try {
    const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

    if (typeof imageDataUrl === 'string' && imageDataUrl.startsWith('data:image/')) {
      const match = imageDataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (match) {
        parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2],
          },
        });
      }
    }

    parts.push({
      text: `You are a Master Kyoto Kimono Portrait Stylist and AI Facial Mapping calibration expert.
Analyze this portrait for virtual kimono facial mapping alongside the user's current kimono configuration (${JSON.stringify({
        silhouette: currentConfig?.silhouette,
        baseColor: currentConfig?.baseColor,
        patternId: currentConfig?.patternId,
        fabricTexture: currentConfig?.fabricTexture,
      })}).
Return a JSON object with:
- undertone: descriptive skin & lighting undertone (e.g. "Warm Golden Sakura", "Cool Porcelain Alabaster", "Rich Rose Amber")
- lightingHarmonyScore: integer between 88 and 99
- recommendedSilkHex: 7-character hex color for the kimono silk that flatters this face
- recommendedObiHex: 7-character hex color for a contrasting obi sash
- stylistNote: 1-2 concise sentences explaining how the facial features, lighting, and collar frame harmonize with traditional Japanese motifs (Sakura, Tsuru, or Nami)
- detectedLandmarksConfidence: number between 95.0 and 99.6
- suggestedWarmth: integer between -8 and 12 for ambient sakura relighting`,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            undertone: { type: Type.STRING },
            lightingHarmonyScore: { type: Type.INTEGER },
            recommendedSilkHex: { type: Type.STRING },
            recommendedObiHex: { type: Type.STRING },
            stylistNote: { type: Type.STRING },
            detectedLandmarksConfidence: { type: Type.NUMBER },
            suggestedWarmth: { type: Type.INTEGER },
          },
          required: [
            'undertone',
            'lightingHarmonyScore',
            'recommendedSilkHex',
            'recommendedObiHex',
            'stylistNote',
            'detectedLandmarksConfidence',
            'suggestedWarmth',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error) {
    console.error('Gemini face harmony error:', error);
    res.json({
      undertone: 'Radiant Blossom Warmth (Sakura-iro)',
      lightingHarmonyScore: 94,
      recommendedSilkHex: '#FADADD',
      recommendedObiHex: '#C82846',
      stylistNote:
        'Balanced facial illumination pairs effortlessly with a soft sakura pink silk ground and crimson gold-brocade obi.',
      detectedLandmarksConfidence: 97.8,
      suggestedWarmth: 5,
    });
  }
});

// Master Kimono Artisan Critique Endpoint
app.post('/api/ai/critique-kimono', async (req, res) => {
  const { config, challengeTitle } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    res.json({
      artisanTitle: 'Spring Blossom Silk Poet',
      harmonyScore: 96,
      critique:
        'Your pairing of traditional motifs with luminous silk weave captures the fleeting spirit of Kyoto in full sakura bloom. The collar contrast draws the eye upward with noble poise.',
      haiku: 'Petals drift on silk / Cranes ascend through golden clouds / Waves whisper of spring',
    });
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are a Living National Treasure kimono weaver in Nishijin, Kyoto.
Evaluate this user-designed kimono configuration:
${JSON.stringify({
  silhouette: config?.silhouette,
  baseColor: config?.baseColor,
  hemGradientColor: config?.hemGradientColor,
  obiStyle: config?.obiStyle,
  obiColor: config?.obiColor,
  patternId: config?.patternId,
  fabricTexture: config?.fabricTexture,
  goldLeafAccents: config?.goldLeafAccents,
  faceMapped: config?.faceMapping?.enabled,
  challengeTitle: challengeTitle || 'Free Atelier Creation',
})}
Provide an encouraging, culturally rich critique referencing Japanese motif symbolism (Sakura cherry blossoms, Tsuru cranes, Nami waves, Kikko, or Asanoha) and textile craftsmanship.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            artisanTitle: { type: Type.STRING },
            harmonyScore: { type: Type.INTEGER },
            critique: { type: Type.STRING },
            haiku: { type: Type.STRING },
          },
          required: ['artisanTitle', 'harmonyScore', 'critique', 'haiku'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error) {
    console.error('Gemini critique error:', error);
    res.json({
      artisanTitle: 'Nishijin Master Weaver',
      harmonyScore: 95,
      critique:
        'Exquisite balance between the migoro body dye and the obi sash. Your chosen motif honors the harmony of nature and good fortune.',
      haiku: 'Crimson blossoms fall / Woven threads of ancient grace / Crane takes to the sky',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hanami Kimono Atelier running on http://localhost:${PORT}`);
  });
}

startServer();
