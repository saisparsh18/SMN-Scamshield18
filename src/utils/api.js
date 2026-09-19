import { extractHeuristicSignals, analyzeTextMessage, analyzeUrlIndicators } from './heuristics';

const SERVER_BASE_URL = 'http://localhost:5000';

/**
 * Checks if the backend server and Gemini AI engine are reachable and configured.
 */
export async function checkServerHealth() {
  try {
    const res = await fetch(`${SERVER_BASE_URL}/api/health`, { method: 'GET' });
    if (!res.ok) return { online: false, aiConfigured: false };
    const data = await res.json();
    return {
      online: true,
      aiConfigured: data.aiConfigured,
      model: data.model
    };
  } catch {
    return { online: false, aiConfigured: false };
  }
}

/**
 * Analyzes a message using the two-stage pipeline:
 * First-pass heuristic signal extraction -> Server AI analysis -> Structured Result
 * Automatically falls back to Local Heuristic Analysis if server/AI is unavailable.
 */
export async function analyzeMessage(text) {
  if (!text || !text.trim()) return null;

  // Stage 1: Local Heuristic First-Pass Signal Extraction
  const heuristicSignals = extractHeuristicSignals(text);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(`${SERVER_BASE_URL}/api/analyze/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        heuristicSignals
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.engine === 'ai') {
        return {
          ...data,
          sourceType: 'message',
          engine: 'ai',
          engineLabel: 'AI-assisted analysis',
          assessmentType: 'AI Risk Assessment'
        };
      }
    }
  } catch (err) {
    console.warn('[ScamShield AI] Server message AI unavailable, utilizing Local Heuristic Analysis fallback:', err.message);
  }

  // Stage 2 Fallback: Local Heuristic Analysis
  const fallbackResult = analyzeTextMessage(text);
  if (fallbackResult) {
    fallbackResult.engine = 'heuristic';
    fallbackResult.engineLabel = 'Local Heuristic Analysis';
    fallbackResult.assessmentType = 'Heuristic Risk Assessment';
  }
  return fallbackResult;
}

/**
 * Analyzes a screenshot using Gemini Vision multimodal intelligence.
 * Falls back to local heuristic analysis of extracted text if AI is unavailable.
 */
export async function analyzeScreenshot({ imageBase64, mimeType = 'image/png', fallbackText = '' }) {
  if (!imageBase64 && !fallbackText) return null;

  if (imageBase64) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000);

      const res = await fetch(`${SERVER_BASE_URL}/api/analyze/screenshot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType,
          extractedText: fallbackText
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.engine === 'ai') {
          return {
            ...data,
            sourceType: 'screenshot',
            engine: 'ai',
            engineLabel: 'AI-assisted analysis',
            assessmentType: 'AI Risk Assessment'
          };
        }
      }
    } catch (err) {
      console.warn('[ScamShield AI] Server screenshot AI unavailable, utilizing Local Heuristic fallback:', err.message);
    }
  }

  // Fallback: Local Heuristic Analysis
  const fallbackResult = analyzeTextMessage(fallbackText || 'Suspicious screenshot notification');
  if (fallbackResult) {
    fallbackResult.sourceType = 'screenshot';
    fallbackResult.engine = 'heuristic';
    fallbackResult.engineLabel = 'Local Heuristic Analysis';
    fallbackResult.assessmentType = 'Heuristic Risk Assessment';
    fallbackResult.summary = `[Local Heuristic Analysis] ${fallbackResult.summary}`;
  }
  return fallbackResult;
}

/**
 * Analyzes a URL using deterministic signals + Gemini AI contextual interpretation.
 * Automatically falls back to local heuristic indicator analysis if unavailable.
 */
export async function analyzeUrl(rawUrl) {
  if (!rawUrl || !rawUrl.trim()) return null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 16000);

    const res = await fetch(`${SERVER_BASE_URL}/api/analyze/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: rawUrl.trim() }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.engine === 'ai') {
        return {
          ...data,
          sourceType: 'url',
          engine: 'ai',
          engineLabel: 'AI-assisted analysis',
          assessmentType: 'AI Risk Assessment'
        };
      }
    }
  } catch (err) {
    console.warn('[ScamShield AI] Server URL AI unavailable, utilizing Local Heuristic fallback:', err.message);
  }

  // Fallback: Local Heuristic Analysis
  const fallbackResult = analyzeUrlIndicators(rawUrl);
  if (fallbackResult) {
    fallbackResult.sourceType = 'url';
    fallbackResult.engine = 'heuristic';
    fallbackResult.engineLabel = 'Local Heuristic Analysis';
    fallbackResult.assessmentType = 'Heuristic Risk Assessment';
  }
  return fallbackResult;
}
