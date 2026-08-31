import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure storage directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Lazy load Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
}

// Initial Default Products in case file doesn't exist
const DEFAULT_PRODUCTS = [
  {
    id: "prod-medium-kit",
    name: "Medium Painting Kit 🎨",
    description: "A fun and creative DIY painting kit for kids. Paint, decorate, and personalize your favourite ceramic toys while developing creativity and imagination.",
    price: 299,
    category: "plaster",
    image: "/assets/images/medium_paint_kit_1784789218683.jpg",
    stars: 5,
    ratingValue: 4.9,
    ratingLabel: "PAINT KITS",
    hasBannerImage: true,
    bannerText: "🔥 HOT SELLER - 9 TOYS INSIDE!",
    ageBadge: "🥚 Ages 3+",
    topRightBadge: "Hot Seller 🔥",
    badge: "Best Value",
    isBestSeller: true
  },
  {
    id: "prod-large-kit",
    name: "Large Painting Kit",
    description: "Large Paint & Play Kit. A complete creative painting kit packed with 14 ceramic toys for hours of fun and imagination.",
    price: 399,
    category: "plaster",
    image: "/assets/images/large_paint_kit_1784789210200.jpg",
    stars: 5,
    ratingValue: 4.9,
    ratingLabel: "PAINT KITS",
    hasBannerImage: true,
    bannerText: "✨ MINI PAINT STATION - 14 TOYS INSIDE!",
    ageBadge: "🥚 Ages 3+",
    topRightBadge: "14 Toys Pack ✨",
    badge: "Best Seller",
    isBestSeller: true
  },
  {
    id: "prod-small-kit",
    name: "Small Painting Kit 🎨",
    description: "Perfect starter paint-and-play set for young creators. Includes 2 large figures, 2 small figures, paints, and brush.",
    price: 199,
    category: "plaster",
    image: "/assets/images/small_paint_kit_1784789237699.jpg",
    stars: 5,
    ratingValue: 4.8,
    ratingLabel: "PAINT KITS",
    hasBannerImage: true,
    bannerText: "🎨 STARTER PAINT KIT",
    ageBadge: "🥚 Ages 3+",
    topRightBadge: "Starter Set 🧁",
    badge: "Starter Set"
  },
  {
    id: "prod-name-kit",
    name: "Alphabet Set (8-12 Letters)",
    description: "Create a one-of-a-kind masterpiece with a personalized ceramic name made just for you. Paint, decorate, and customize your name using the included colors to create a unique keepsake.",
    price: 399,
    category: "plaster",
    image: "/assets/images/custom_name_kit_1784789201977.jpg",
    stars: 5,
    ratingValue: 4.9,
    ratingLabel: "PAINT KITS",
    hasBannerImage: true,
    bannerText: "✨ CUSTOM CERAMIC ALPHABET SET",
    ageBadge: "🥚 All Ages",
    topRightBadge: "8-12 Letters ✨",
    badge: "Highly Customized",
    isBestSeller: true
  },
  {
    id: "prod-small-ceramic-toy",
    name: "Small Ceramic Toy 🧸",
    description: "Cute small unpainted ceramic toy figurine. Perfect for kids painting activities, party favors, return gifts, and creative DIY fun.",
    price: 10,
    category: "plaster",
    image: "/assets/images/small_ceramic_toy_10_1784789228519.jpg",
    stars: 5,
    ratingValue: 4.8,
    ratingLabel: "TOYS",
    hasBannerImage: true,
    bannerText: "🧸 SMALL UNPAINTED CERAMIC TOY - RS 10",
    ageBadge: "🥚 Ages 3+",
    topRightBadge: "Small Size 🧸",
    badge: "Budget Friendly"
  },
  {
    id: "prod-extra-medium-toy",
    name: "Single Ceramic Toy (Medium)",
    description: "Perfect for creative play, school activities, party favors, gifts, and DIY painting projects. Each ceramic toy is made from high-quality material and is ready to be painted.",
    price: 10,
    category: "plaster",
    image: "/assets/images/extra_medium_toy_10_1784789253457.jpg",
    stars: 4,
    ratingValue: 4.7,
    ratingLabel: "TOYS",
    hasBannerImage: true,
    bannerText: "🧸 READY TO PAINT MEDIUM TOY",
    ageBadge: "🥚 Ages 3+",
    topRightBadge: "Medium Size 🧸"
  },
  {
    id: "prod-extra-brush",
    name: "Painting Brush 🖌️",
    description: "A high-quality paint brush designed for ceramic painting, DIY crafts, and creative projects. Easy to hold, smooth to use, and perfect for detailed artwork.",
    price: 50,
    category: "accessories",
    image: "/assets/images/paint_brush_50_1784789260655.jpg",
    stars: 4,
    ratingValue: 4.8,
    ratingLabel: "BRUSHES",
    hasBannerImage: true,
    bannerText: "🖌️ PREMIUM PAINTING BRUSH",
    ageBadge: "🥚 All Ages",
    topRightBadge: "Paint Brush 🖌️"
  },
  {
    id: "prod-paint-strip",
    name: "Extra 6 Color Paint Strip",
    description: "Bright, smooth, and easy-to-use paints for ceramic toys, alphabet sets, and DIY crafts. Perfect as a refill or for extra creative options.",
    price: 80,
    category: "paints",
    image: "/assets/images/paint_strip_80_1784789268686.jpg",
    stars: 5,
    ratingValue: 4.8,
    ratingLabel: "BRUSHES",
    hasBannerImage: true,
    bannerText: "🎨 6 COLOURS PAINT STRIP",
    ageBadge: "🥚 All Ages",
    topRightBadge: "6 Colours 🎨"
  },
  {
    id: "prod-extra-big-toy",
    name: "Big Ceramic Toy 🧸",
    description: "Single large-size ceramic toy figurine (teddy bear with balloons, burger, donut). Adds extra scale and fun to your child's coloring adventure.",
    price: 15,
    category: "plaster",
    image: "/assets/images/big_ceramic_toy_15_1784789245573.jpg",
    stars: 5,
    ratingValue: 4.8,
    ratingLabel: "TOYS",
    hasBannerImage: true,
    bannerText: "🧸 BIG CERAMIC TOY - RS 15",
    ageBadge: "🥚 Ages 3+",
    topRightBadge: "Big Size 🧸",
    badge: "Popular Choice"
  }
];

// Helper to read products
function readProducts() {
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading products file:', err);
  }
  return DEFAULT_PRODUCTS;
}

// Helper to write products
function writeProducts(products: any[]) {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing products file:', err);
    return false;
  }
}

// Helper to read settings
function readSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading settings file:', err);
  }
  return {
    storePhone: "0310-6541965",
    announcement: "🎨 Grand Opening Offer: Handcrafted plaster kits with FREE stencil bundle on orders above Rs. 1000! 🚚 Fast Cash on Delivery across Pakistan.",
    minOrder: 199
  };
}

// Helper to write settings
function writeSettings(settings: any) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing settings file:', err);
    return false;
  }
}

async function startServer() {
  const app = express();

  // Allow larger payload sizes for image uploads and large catalogs
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Static uploads directory
  app.use('/uploads', express.static(UPLOADS_DIR));

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Get Live Products
  app.get('/api/products', (req, res) => {
    const products = readProducts();
    res.json({ success: true, products });
  });

  // Save / Update Live Products
  app.post('/api/products', (req, res) => {
    const { products } = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'Products array is required' });
    }
    const success = writeProducts(products);
    if (success) {
      res.json({ success: true, message: 'Products updated live successfully!', products });
    } else {
      res.status(500).json({ error: 'Failed to save products to database' });
    }
  });

  // Get Store Settings
  app.get('/api/settings', (req, res) => {
    const settings = readSettings();
    res.json({ success: true, settings });
  });

  // Update Store Settings
  app.post('/api/settings', (req, res) => {
    const newSettings = req.body;
    const current = readSettings();
    const merged = { ...current, ...newSettings };
    const success = writeSettings(merged);
    if (success) {
      res.json({ success: true, message: 'Store settings updated live!', settings: merged });
    } else {
      res.status(500).json({ error: 'Failed to save store settings' });
    }
  });

  // Upload Product Image (Base64 file upload)
  app.post('/api/upload-image', (req, res) => {
    try {
      const { imageBase64, filename } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: 'imageBase64 data is required' });
      }

      // Extract format & clean data
      let base64Data = imageBase64;
      let extension = 'png';
      if (imageBase64.includes(';base64,')) {
        const matches = imageBase64.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
        if (matches) {
          extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
          base64Data = matches[2];
        }
      }

      const safeName = `product_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${extension}`;
      const filePath = path.join(UPLOADS_DIR, safeName);
      
      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

      const publicUrl = `/uploads/${safeName}`;
      res.json({ success: true, url: publicUrl });
    } catch (err) {
      console.error('Error saving image:', err);
      res.status(500).json({ error: 'Failed to save image on server' });
    }
  });

  // AI Stencil Generator Endpoint with Gemini
  app.post('/api/generate-stencil', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Please provide a drawing prompt' });
    }

    const ai = getAiClient();
    
    if (!ai) {
      // Fallback cute stencil if Gemini key not set
      return res.json({
        fallback: true,
        prompt: prompt,
        svg: `<svg viewBox="0 0 400 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" stroke="black" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="130" cy="130" r="35" />
            <circle cx="130" cy="130" r="15" />
            <circle cx="270" cy="130" r="35" />
            <circle cx="270" cy="130" r="15" />
            <circle cx="200" cy="200" r="80" />
            <circle cx="170" cy="180" r="8" fill="black" />
            <circle cx="230" cy="180" r="8" fill="black" />
            <ellipse cx="200" cy="215" rx="25" ry="18" />
            <path d="M 190,210 Q 200,200 210,210" fill="black" />
            <path d="M 190,223 Q 200,235 210,223" />
            <path d="M 200,220 L 200,223" />
            <circle cx="145" cy="210" r="10" stroke-dasharray="4" />
            <circle cx="255" cy="210" r="10" stroke-dasharray="4" />
          </g>
        </svg>`
      });
    }

    try {
      const systemInstruction = 
        "You are a children's coloring page designer. Output raw, valid SVG code for a children's coloring page outline based on prompt. " +
        "Rules: Only use standard black strokes (stroke='black', stroke-width='6') and transparent/white fills. ViewBox '0 0 400 400'. Output ONLY the raw <svg>...</svg> string.";

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `Create a clean black outline vector SVG coloring page for: ${prompt}` }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.4,
        }
      });

      let rawSvg = response.text || '';
      rawSvg = rawSvg.trim();
      if (rawSvg.startsWith('```')) {
        rawSvg = rawSvg.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '').trim();
      }

      res.json({ svg: rawSvg });
    } catch (error) {
      console.error('Error generating AI stencil:', error);
      res.status(500).json({ error: 'AI Stencil creation failed. Please try again or use the fallbacks!' });
    }
  });

  // SEO: Direct sitemap.xml route
  app.get('/sitemap.xml', (req, res) => {
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      res.header('Content-Type', 'application/xml');
      return res.sendFile(sitemapPath);
    }
    res.status(404).send('Sitemap not found');
  });

  // SEO: Direct robots.txt route
  app.get('/robots.txt', (req, res) => {
    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    if (fs.existsSync(robotsPath)) {
      res.header('Content-Type', 'text/plain');
      return res.sendFile(robotsPath);
    }
    res.status(404).send('Robots.txt not found');
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Mini Paint Station server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
