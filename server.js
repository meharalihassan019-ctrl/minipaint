import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON body parsing for API requests
app.use(express.json());

// Lazy load Gemini API
let aiClient = null;
function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
}

// AI Stencil Generator Endpoint
app.post('/api/generate-stencil', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Please provide a drawing prompt' });
  }

  const ai = getAiClient();
  
  if (!ai) {
    // Elegant fallback stencils when API key is missing
    console.warn('GEMINI_API_KEY is missing or invalid. Returning a cute fallback stencil.');
    return res.json({
      fallback: true,
      prompt: prompt,
      svg: `<svg viewBox="0 0 400 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <!-- Cute Teddy Bear Fallback Stencil -->
        <g fill="none" stroke="black" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
          <!-- Ears -->
          <circle cx="130" cy="130" r="35" />
          <circle cx="130" cy="130" r="15" />
          <circle cx="270" cy="130" r="35" />
          <circle cx="270" cy="130" r="15" />
          <!-- Head -->
          <circle cx="200" cy="200" r="80" />
          <!-- Eyes -->
          <circle cx="170" cy="180" r="8" fill="black" />
          <circle cx="230" cy="180" r="8" fill="black" />
          <!-- Snout & Nose -->
          <ellipse cx="200" cy="215" rx="25" ry="18" />
          <path d="M 190,210 Q 200,200 210,210" fill="black" />
          <!-- Smile -->
          <path d="M 190,223 Q 200,235 210,223" />
          <path d="M 200,220 L 200,223" />
          <!-- Rosy Cheek Circles -->
          <circle cx="145" cy="210" r="10" stroke-dasharray="4" />
          <circle cx="255" cy="210" r="10" stroke-dasharray="4" />
          <!-- Decorative Heart -->
          <path d="M 200,290 C 200,290 170,260 170,245 C 170,235 180,225 190,225 C 195,225 198,230 200,233 C 202,230 205,225 210,225 C 220,225 230,235 230,245 C 230,260 200,290 200,290 Z" stroke-dasharray="4" />
        </g>
      </svg>`
    });
  }

  try {
    const systemInstruction = 
      "You are a children's coloring page designer. Your job is to output raw, valid SVG code for a children's coloring page/stencil outline based on the user's prompt. " +
      "Rules:\n" +
      "1. Only use standard black strokes (stroke='black', stroke-width='6') and transparent/white fills so it is paintable.\n" +
      "2. The drawing should be extremely cute, child-friendly, bold, and clean for ages 3-8 (e.g. thick closed paths, simple shapes).\n" +
      "3. Use a viewBox of '0 0 400 400' and preserve aspect ratios.\n" +
      "4. Include some dotted inner details (stroke-dasharray='4') to make it fun for children.\n" +
      "5. Do NOT include any markdown block markers like ```xml or ```svg or ```, and no introductory or concluding text. Output ONLY the raw <svg>...</svg> string.";

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
    
    // Clean up response if the model accidentally included markdown wrappers
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

// Serve the static files from the Vite build directory
app.use(express.static(join(__dirname, 'dist')));

// Serve index.html for all other routes to support client-side routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
