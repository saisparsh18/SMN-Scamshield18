import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { inspectUrlSignals, buildObservableIndicators } from './urlInspector.js';

/**
 * ScamShield AI - Server-Side AI Analysis Service
 * Grounded LLM explainability engine enforcing strict safety, zero-hallucination rules,
 * and calibrated risk scoring for text messages, visual screenshots, and target URLs.
 */

const SYSTEM_INSTRUCTION_MESSAGE = `You are SMN ScamShield, an objective, expert cybersecurity analysis engine for a scam awareness platform.
Your mission is to analyze suspicious messages, SMS, emails, or communication transcripts and explain WHY something exhibits threat patterns.

CRITICAL OPERATIONAL RULES:
1. NO ABSOLUTE CERTAINTY: Do not claim that you can determine with 100% certainty that something is a scam. Frame your evaluation strictly as an "AI Risk Assessment".
2. EXPLAIN THE EVIDENCE: For every warning sign, you MUST cite observable evidence directly from the input text (e.g., specific phrases like "suspended today", "complete KYC").
3. DO NOT INVENT FACTS OR URLS: Never invent or assume facts about the sender, company, or domain that were not provided. If a message says "Click the link below" but does NOT contain a URL, do NOT invent a URL. State that it includes an unverified directive to follow an external link.
4. DISTINGUISH OBSERVABLE EVIDENCE FROM AI INTERPRETATION: Clearly separate direct observations from behavioral threat assessments.
5. INSUFFICIENT EVIDENCE: If the message is benign, standard correspondence, or lacks sufficient threat signals, classify as LOW risk and clearly state the absence of coercive indicators.
6. IDENTIFY MULTIPLE INDICATORS: For deceptive messages, extract all relevant distinct threat vectors rather than collapsing everything into a single indicator.

Your response MUST be valid JSON matching this exact structure:
{
  "riskScore": <integer 0-100>,
  "riskLevel": <"LOW" | "MODERATE" | "HIGH" | "CRITICAL">,
  "category": <string identifying scam category, e.g. "KYC & Bank Account Phishing", "Part-Time Task Scam", "Delivery Phishing", "Utility Impersonation", or "Standard Communication">,
  "summary": <string explaining the overall assessment in 1-2 concise sentences>,
  "warningSigns": [
    {
      "title": <string, short name of warning indicator, e.g. "Urgency & Artificial Deadline", "Account Suspension Threat", "KYC Credential Solicitation", "Unverified Action Directive">,
      "severity": <"LOW" | "MEDIUM" | "HIGH">,
      "description": <string explaining the exact evidence and why it is suspicious>
    }
  ],
  "recommendedActions": [
    <string actionable safety step, e.g. "Do not click any embedded links", "Verify independently using official bank app">
  ],
  "confidence": <integer 0-100 indicating AI assessment confidence>
}`;

const SYSTEM_INSTRUCTION_SCREENSHOT = `You are SMN ScamShield, an objective, expert cybersecurity visual analyst.
Your task is to analyze the provided screenshot of a suspicious message, chat, email, website, payment interface, or SMS notification for deception, fraud, or social engineering indicators.

CRITICAL OPERATIONAL RULES:
1. GROUNDED IN VISIBLE EVIDENCE: Extract and analyze ONLY the text, graphics, and elements clearly visible in the image. Never invent, hallucinate, or assume text, sender names, phone numbers, companies, or URLs that are not visible.
2. NO ABSOLUTE CERTAINTY: Frame your evaluation strictly as an "AI Risk Assessment".
3. IDENTIFY ALL RELEVANT INDICATORS: Check for urgency cues, threats of account closure or suspension, requests for sensitive passwords/PINs/OTPs/KYC, financial lures, impersonation of known institutions (e.g. SBI, HDFC), or pressure to click links.
4. DISTINGUISH OBSERVABLE EVIDENCE FROM AI INTERPRETATION: Cite the exact visible text or UI elements in each warning sign.
5. INSUFFICIENT OR BENIGN EVIDENCE: If the screenshot shows safe or standard content with no threat patterns, classify as LOW risk and clearly state the absence of coercive indicators.
6. JSON OUTPUT SCHEMA: Must match the exact required JSON schema.

Your response MUST be valid JSON matching this exact structure:
{
  "riskScore": <integer 0-100>,
  "riskLevel": <"LOW" | "MODERATE" | "HIGH" | "CRITICAL">,
  "category": <string identifying scam category, e.g. "KYC & Bank Account Phishing", "Part-Time Task Scam", "Delivery Phishing", "Utility Impersonation", or "Standard Communication">,
  "summary": <string explaining the visual assessment in 1-2 concise sentences>,
  "warningSigns": [
    {
      "title": <string, short name of warning indicator, e.g. "Urgency & Artificial Deadline", "Account Suspension Threat", "KYC Credential Solicitation", "Suspicious URL", "Unverified Action Directive">,
      "severity": <"LOW" | "MEDIUM" | "HIGH">,
      "description": <string citing the exact visible evidence from the image and explaining why it is suspicious>
    }
  ],
  "recommendedActions": [
    <string actionable safety step, e.g. "Do not click any embedded links", "Verify independently using official bank app">
  ],
  "confidence": <integer 0-100 indicating AI assessment confidence>
}`;

const SYSTEM_INSTRUCTION_URL = `You are SMN ScamShield, an expert cybersecurity technical analyst specializing in web URL safety and deceptive domain patterns.
Your mission is to provide an objective, grounded contextual risk assessment for a target web address based STRICTLY on its observable structure and extracted technical indicators.

CRITICAL OPERATIONAL & ETHICAL RULES:
1. NEVER INVENT FACTS: Never claim, assume, or invent domain registration dates, WHOIS data, blacklist status, reputation scores, or browsing results that were not provided.
2. NO CERTAINTY CLAIMS: Never state with 100% certainty that a URL is malicious. Frame your assessment strictly as an "AI Risk Assessment".
3. GROUNDING IN OBSERVABLE SIGNALS: Cite only observable attributes (e.g. HTTPS transport security, hostname, path depth, security keywords like "secure", "kyc", "verify", and domain nomenclature).
4. CONTEXTUAL INTERPRETATION: Explain WHY certain combinations of keywords (e.g., pairing high-trust words like "secure" and "kyc" on an unverified domain with a "/verify" path) represent deceptive social engineering patterns designed to simulate authentic verification portals.
5. IF SAFE OR INSUFFICIENT EVIDENCE: If the URL belongs to a well-known standard domain or lacks indicators, classify as LOW risk.
6. JSON OUTPUT SCHEMA: Must match the exact required JSON schema.

Your response MUST be valid JSON matching this exact structure:
{
  "riskScore": <integer 0-100>,
  "riskLevel": <"LOW" | "MODERATE" | "HIGH" | "CRITICAL">,
  "category": <string identifying category, e.g. "Deceptive Keyword & Credential Lure", "Suspicious URL Structure", "Standard Web Address">,
  "summary": <string explaining the contextual assessment in 1-2 concise sentences>,
  "warningSigns": [
    {
      "title": <string, short name of warning indicator, e.g. "Deceptive High-Trust Keywords", "Unencrypted Transport (HTTP)", "Unusual Port Routing">,
      "severity": <"LOW" | "MEDIUM" | "HIGH">,
      "description": <string explaining the exact observable evidence and why it is suspicious>
    }
  ],
  "recommendedActions": [
    <string actionable safety step, e.g. "Do not enter login credentials or personal data", "Verify domain ownership via independent bookmark">
  ],
  "confidence": <integer 0-100 indicating AI assessment confidence>
}`;

const CANDIDATE_MODELS = ['gemini-3.6-flash', 'gemini-3-flash-preview'];

function parseAndNormalizeJson(responseText) {
  let cleanJson = responseText.trim();
  if (cleanJson.startsWith('```json')) {
    cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleanJson.startsWith('```')) {
    cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  const parsedData = JSON.parse(cleanJson);

  const riskScore = typeof parsedData.riskScore === 'number' 
    ? Math.min(Math.max(Math.round(parsedData.riskScore), 0), 98) 
    : 50;

  let riskLevel = parsedData.riskLevel;
  if (!['LOW', 'MODERATE', 'HIGH', 'CRITICAL'].includes(riskLevel)) {
    if (riskScore >= 75) riskLevel = 'CRITICAL';
    else if (riskScore >= 50) riskLevel = 'HIGH';
    else if (riskScore >= 25) riskLevel = 'MODERATE';
    else riskLevel = 'LOW';
  }

  return {
    riskScore,
    riskLevel,
    category: parsedData.category || 'General Communication Review',
    summary: parsedData.summary || 'AI-assisted evaluation of observable indicators.',
    warningSigns: Array.isArray(parsedData.warningSigns) ? parsedData.warningSigns : [],
    recommendedActions: Array.isArray(parsedData.recommendedActions) ? parsedData.recommendedActions : [],
    confidence: typeof parsedData.confidence === 'number' ? parsedData.confidence : 92
  };
}

/**
 * Analyzes text messages using Gemini AI.
 */
export async function analyzeMessageWithAI(messageText, heuristicSignals = {}) {
  dotenv.config();
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.trim() === 'your_gemini_api_key_here') {
    return {
      success: false,
      reason: 'NO_API_KEY',
      error: 'GEMINI_API_KEY is not configured in server/.env'
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

    const prompt = `Analyze the following message for deceptive, coercive, or fraudulent indicators.

USER MESSAGE TO ANALYZE:
"""
${messageText}
"""

FIRST-PASS HEURISTIC SIGNALS DETECTED LOCALLY:
${JSON.stringify(heuristicSignals, null, 2)}

Provide your grounded assessment as JSON matching the required schema.`;

    let response;
    let lastError = null;

    for (const model of CANDIDATE_MODELS) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION_MESSAGE,
            responseMimeType: 'application/json',
            temperature: 0.1
          }
        });
        if (response && response.text) break;
      } catch (err) {
        lastError = err;
        console.warn(`[ScamShield AI] Text model ${model} error:`, err.message);
        if (err.status === 503 || err.status === 429) {
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error('Empty response received from candidate models');
    }

    const normalized = parseAndNormalizeJson(response.text);

    return {
      success: true,
      engine: 'ai',
      engineLabel: 'AI-assisted analysis',
      assessmentType: 'AI Risk Assessment',
      result: {
        ...normalized,
        analyzedInput: messageText,
        sourceType: 'message',
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error executing Gemini message analysis:', error.message);
    return {
      success: false,
      reason: 'AI_EXECUTION_ERROR',
      error: error.message
    };
  }
}

/**
 * Analyzes uploaded screenshot images using Gemini Vision.
 */
export async function analyzeScreenshotWithAI(imageBase64, mimeType = 'image/png', clientText = '') {
  dotenv.config();
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.trim() === 'your_gemini_api_key_here') {
    return {
      success: false,
      reason: 'NO_API_KEY',
      error: 'GEMINI_API_KEY is not configured in server/.env'
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

    // Clean data URL prefix and normalize MIME type
    let cleanBase64 = imageBase64;
    let cleanMime = mimeType ? mimeType.split(';')[0].trim().toLowerCase() : 'image/png';

    if (cleanBase64.includes(';base64,')) {
      const match = cleanBase64.match(/^data:([^;]+);base64,(.+)$/s);
      if (match) {
        cleanMime = match[1].toLowerCase().trim();
        cleanBase64 = match[2];
      } else {
        cleanBase64 = cleanBase64.split(';base64,')[1];
      }
    }

    if (cleanMime === 'image/jpg') cleanMime = 'image/jpeg';
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'].includes(cleanMime)) {
      cleanMime = 'image/png';
    }
    cleanBase64 = cleanBase64.replace(/\s+/g, '');

    const promptText = `Examine this screenshot carefully for fraudulent, coercive, or phishing indicators.
Extract and analyze the visible text and graphical cues.
Identify:
- Scam category (e.g. KYC & Bank Account Phishing, Job Scam, etc.)
- Specific urgency cues or coercion
- Account threats (e.g. account suspended/blocked/closed)
- Demands for sensitive identity or financial information
- Any visible URLs, domains, or link directives
Explain the evidence directly observed in the screenshot and recommend protective actions.
${clientText ? `\nOptional context provided: "${clientText}"` : ''}

Provide your response as valid JSON matching the required schema.`;

    let response;
    let lastError = null;

    for (const model of CANDIDATE_MODELS) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          response = await ai.models.generateContent({
            model,
            contents: [
              {
                inlineData: {
                  mimeType: cleanMime,
                  data: cleanBase64
                }
              },
              promptText
            ],
            config: {
              systemInstruction: SYSTEM_INSTRUCTION_SCREENSHOT,
              responseMimeType: 'application/json',
              temperature: 0.1
            }
          });
          if (response && response.text) break;
        } catch (err) {
          lastError = err;
          console.warn(`[ScamShield AI] Vision model ${model} attempt ${attempt + 1} error:`, err.message);
          if (err.status === 503 || err.status === 429) {
            await new Promise((r) => setTimeout(r, 1200));
          } else {
            break;
          }
        }
      }
      if (response && response.text) break;
    }

    if (!response || !response.text) {
      throw lastError || new Error('Empty response received from vision model');
    }

    const normalized = parseAndNormalizeJson(response.text);

    return {
      success: true,
      engine: 'ai',
      engineLabel: 'AI-assisted analysis',
      assessmentType: 'AI Risk Assessment',
      result: {
        ...normalized,
        analyzedInput: '[Visual Screenshot Upload]',
        sourceType: 'screenshot',
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error executing Gemini screenshot vision analysis:', error.message);
    return {
      success: false,
      reason: 'AI_EXECUTION_ERROR',
      error: error.message
    };
  }
}

/**
 * Analyzes target URLs using deterministic technical signals + Gemini contextual interpretation.
 */
export async function analyzeUrlWithAI(rawUrl) {
  dotenv.config();
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  // Extract deterministic signals first
  const signals = inspectUrlSignals(rawUrl);
  const indicators = buildObservableIndicators(signals);

  if (!apiKey || apiKey.trim() === '' || apiKey.trim() === 'your_gemini_api_key_here') {
    return {
      success: false,
      reason: 'NO_API_KEY',
      error: 'GEMINI_API_KEY is not configured in server/.env',
      deterministicSignals: signals,
      indicators
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

    const promptText = `Analyze the target URL below based on its extracted technical indicators and domain nomenclature.

TARGET URL:
"""
${rawUrl}
"""

EXTRACTED OBJECTIVE SIGNALS:
${JSON.stringify(signals, null, 2)}

Provide your contextual assessment as JSON matching the required schema.`;

    let response;
    let lastError = null;

    for (const model of CANDIDATE_MODELS) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          response = await ai.models.generateContent({
            model,
            contents: promptText,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION_URL,
              responseMimeType: 'application/json',
              temperature: 0.1
            }
          });
          if (response && response.text) break;
        } catch (err) {
          lastError = err;
          console.warn(`[ScamShield AI] URL model ${model} attempt ${attempt + 1} error:`, err.message);
          if (err.status === 503 || err.status === 429) {
            await new Promise((r) => setTimeout(r, 1200));
          } else {
            break;
          }
        }
      }
      if (response && response.text) break;
    }

    if (!response || !response.text) {
      throw lastError || new Error('Empty response received from URL model');
    }

    const normalized = parseAndNormalizeJson(response.text);

    return {
      success: true,
      engine: 'ai',
      engineLabel: 'AI-assisted analysis',
      assessmentType: 'AI Risk Assessment',
      result: {
        ...normalized,
        indicators, // Merge deterministic indicator cards
        analyzedInput: rawUrl,
        hostname: signals.hostname,
        protocol: signals.protocol,
        sourceType: 'url',
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error executing Gemini URL analysis:', error.message);
    return {
      success: false,
      reason: 'AI_EXECUTION_ERROR',
      error: error.message,
      deterministicSignals: signals,
      indicators
    };
  }
}
