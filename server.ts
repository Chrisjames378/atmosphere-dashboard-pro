import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client server-side
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Route: Climate Telemetry & AI Advisor
  app.post('/api/gemini/advisor', async (req, res) => {
    try {
      const { prompt, telemetryData } = req.body;
      const ai = getAiClient();

      if (!ai) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY is not configured in environment secrets.',
          fallbackAnswer: `Based on your station metrics (${telemetryData?.location || 'Selected Region'}), local AQI is ${telemetryData?.aqi || 'Good'} and atmospheric CO₂ levels are ${telemetryData?.co2 || '421 ppm'}. Recommended eco-actions include solar energy generation and localized carbon credit funding.`,
        });
      }

      const systemInstruction = `You are the Atmosphere Pro Telemetry AI & Climate Advisor. 
You provide scientific, concise, and highly actionable analysis of atmospheric data, greenhouse gas concentrations (CO2, CH4, O3), weather patterns, air quality index, satellite radar observations, and carbon credit market opportunities.
Keep your response structured with markdown headers, concise bullet points, and high readability.`;

      const contents = `Current Telemetry Context:
${JSON.stringify(telemetryData || {}, null, 2)}

User Question/Prompt:
${prompt}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      res.status(500).json({ error: err?.message || 'Failed to generate climate advisor report.' });
    }
  });

  // API Route: Live Telemetry Data Proxy / Mock Generator with global station locations
  app.get('/api/telemetry', (req, res) => {
    const location = (req.query.location as string) || 'San Francisco, USA';
    
    // Hash location to produce stable yet varied realistic station data
    let hash = 0;
    for (let i = 0; i < location.length; i++) {
      hash = (hash << 5) - hash + location.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);

    const baseTemp = 12 + (absHash % 22);
    const humidity = 45 + (absHash % 45);
    const pressure = 1008 + (absHash % 20);
    const windSpeed = 8 + (absHash % 25);
    const aqi = 15 + (absHash % 85);
    const co2 = (418 + (absHash % 12) + Math.random()).toFixed(1);
    const methane = 1880 + (absHash % 75);
    const ozone = 28 + (absHash % 24);

    res.json({
      location,
      temperature: baseTemp,
      feelsLike: baseTemp + 2,
      condition: baseTemp > 24 ? 'Sunny' : baseTemp > 18 ? 'Partly Cloudy' : 'Overcast / Breezy',
      windSpeed,
      windDirection: ['SW', 'NE', 'NW', 'SSW', 'E', 'SE'][absHash % 6],
      humidity,
      pressure,
      aqi,
      aqiCategory: aqi < 50 ? 'Good' : aqi < 100 ? 'Moderate' : 'Unhealthy for Sensitive Groups',
      co2,
      methane,
      ozone,
      pollen: aqi > 50 ? 'Moderate (Trees)' : 'Low (Grass)',
      pm25: (aqi * 0.25).toFixed(1),
      pm10: (aqi * 0.45).toFixed(1),
      lastUpdated: new Date().toISOString(),
    });
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
