import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { 
  analyzeMessageWithAI, 
  analyzeScreenshotWithAI, 
  analyzeUrlWithAI 
} from './services/aiService.js';

dotenv.config();

const app = express();
const DEFAULT_PORT = Number(process.env.PORT) || 5001;
const PORT_CANDIDATES = Array.from(new Set([DEFAULT_PORT, 5002, 5003, 5173, 5174, 8000]));

app.use(cors());
app.use(express.json({ limit: '25mb' }));

// Health and AI status check endpoint
app.get('/api/health', (req, res) => {
  dotenv.config();
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const isAiConfigured = Boolean(apiKey && apiKey.trim() !== '' && apiKey.trim() !== 'your_gemini_api_key_here');

  res.json({
    status: 'online',
    service: 'SMN ScamShield Backend',
    version: '1.4.0',
    aiConfigured: isAiConfigured,
    mode: isAiConfigured ? 'ai' : 'local',
    model: isAiConfigured ? 'gemini-3.6-flash' : 'local-heuristic-fallback-active',
    timestamp: new Date().toISOString()
  });
});

// Message Analysis Endpoint
app.post('/api/analyze/message', async (req, res) => {
  try {
    const { message, heuristicSignals } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message string is required in request body.'
      });
    }

    const aiResponse = await analyzeMessageWithAI(message, heuristicSignals);

    if (aiResponse.success) {
      return res.json({
        success: true,
        engine: 'ai',
        engineLabel: 'AI-assisted analysis',
        assessmentType: 'AI Risk Assessment',
        ...aiResponse.result
      });
    }

    console.log(`[ScamShield AI] Message fallback triggered: ${aiResponse.reason}`);
    return res.json({
      success: false,
      fallbackRequired: true,
      reason: aiResponse.reason,
      error: aiResponse.error
    });
  } catch (err) {
    console.error('Unhandled route error in /api/analyze/message:', err);
    return res.status(500).json({
      success: false,
      fallbackRequired: true,
      error: err.message
    });
  }
});

// Screenshot Vision Analysis Endpoint
app.post('/api/analyze/screenshot', async (req, res) => {
  try {
    const { imageBase64, mimeType, extractedText } = req.body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'imageBase64 string is required in request body.'
      });
    }

    const aiResponse = await analyzeScreenshotWithAI(imageBase64, mimeType, extractedText);

    if (aiResponse.success) {
      return res.json({
        success: true,
        engine: 'ai',
        engineLabel: 'AI-assisted analysis',
        assessmentType: 'AI Risk Assessment',
        ...aiResponse.result
      });
    }

    console.log(`[ScamShield AI] Screenshot vision fallback triggered: ${aiResponse.reason}`);
    return res.json({
      success: false,
      fallbackRequired: true,
      reason: aiResponse.reason,
      error: aiResponse.error
    });
  } catch (err) {
    console.error('Unhandled route error in /api/analyze/screenshot:', err);
    return res.status(500).json({
      success: false,
      fallbackRequired: true,
      error: err.message
    });
  }
});

// URL Contextual Analysis Endpoint
app.post('/api/analyze/url', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'URL string is required in request body.'
      });
    }

    const aiResponse = await analyzeUrlWithAI(url);

    if (aiResponse.success) {
      return res.json({
        success: true,
        engine: 'ai',
        engineLabel: 'AI-assisted analysis',
        assessmentType: 'AI Risk Assessment',
        ...aiResponse.result
      });
    }

    console.log(`[ScamShield AI] URL analysis fallback triggered: ${aiResponse.reason}`);
    return res.json({
      success: false,
      fallbackRequired: true,
      reason: aiResponse.reason,
      error: aiResponse.error,
      deterministicSignals: aiResponse.deterministicSignals,
      indicators: aiResponse.indicators
    });
  } catch (err) {
    console.error('Unhandled route error in /api/analyze/url:', err);
    return res.status(500).json({
      success: false,
      fallbackRequired: true,
      error: err.message
    });
  }
});

function startServer(portIndex = 0) {
  const port = PORT_CANDIDATES[portIndex];

  const server = app.listen(port, () => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const isConfigured = Boolean(apiKey && apiKey.trim() !== '' && apiKey.trim() !== 'your_gemini_api_key_here');
    console.log(`[SMN ScamShield] Server running on http://localhost:${port}`);
    console.log(`[SMN ScamShield] Gemini AI Engine status: ${isConfigured ? 'CONNECTED' : 'STANDBY (Local Fallback Active)'}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && portIndex < PORT_CANDIDATES.length - 1) {
      console.warn(`[SMN ScamShield] Port ${port} is busy. Retrying on ${PORT_CANDIDATES[portIndex + 1]}...`);
      startServer(portIndex + 1);
      return;
    }

    console.error('[SMN ScamShield] Failed to start server:', error);
    process.exit(1);
  });
}

startServer();
