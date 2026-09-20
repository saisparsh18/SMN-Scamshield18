# SMN ScamShield

> **"Detect. Understand. Protect."**  
> AI-powered scam detection and awareness web application for modern cybersecurity defense.

SMN ScamShield helps everyday users and digital citizens analyze suspicious messages, deceptive URLs, screenshots, and phone calls—uncovering the underlying psychological coercion and technical deception with clear, transparent explainability.


---

## Key Features

1. **Message Analyzer**:
   - Analyzes pasted SMS, WhatsApp, and email messages.
   - Evaluates urgency cues, sensitive credential demands, brand impersonation, and unrealistic financial lures.
   - Computes a calibrated 0–100 risk score and threat tier (Low, Moderate, High, Critical).

2. **URL Indicator Inspector**:
   - Inspects transport security (HTTPS vs unencrypted HTTP).
   - Flags suspicious host structures (raw IP address vs registered domain).
   - Detects brand subdomain confusion, non-standard ports, and deceptive path patterns.
   - Grounded Google Gemini interpretation without fabricated WHOIS/blacklist data.

3. **Screenshot & Visual Threat Scanner**:
   - Upload screenshots of suspicious chats, SMS notifications, or phishing sites.
   - Evaluates visible text and visual scam markers via server-side Gemini Vision.

4. **Voice Scam & Vishing Scanner**:
   - Real-time spoken call analysis powered by browser Speech Recognition.
   - Captures speech-to-text with zero permanent audio storage for maximum user privacy.
   - Detects phone-based coercive tactics, authority impersonation, and OTP solicitation.

5. **Explainability Dashboard (Security Telemetry Dossier)**:
   - Dynamic circular risk gauge (0–100 calibrated risk score).
   - Clear breakdown of **WHY** something was flagged with cited evidence.
   - Immediate actionable protective steps.
   - One-click dossier copy for sharing or incident reporting.

6. **Common Scam Anatomy & Educational Hub**:
   - In-depth interactive guides for the 8 most frequent scam categories.
   - Immediate 1-click test triggers to experiment with real-world scenarios.

---

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Vanilla CSS with modern cybersecurity design system (Dark slate palette, accessible contrast, responsive cards, micro-animations)
- **Icons**: Lucide React
- **Backend**: Node.js + Express
- **AI Engine**: Google Gemini API via official `@google/genai` SDK

---

## Quick Start (Local Development)

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)

### 2. Configure Backend Server
```bash
cd server
npm install

# Copy example environment configuration
cp .env.example .env
```

Edit `server/.env` and insert your Gemini API key:
```env
PORT=5001
GEMINI_API_KEY=your_actual_gemini_api_key
```

Start the backend:
```bash
npm start
```
The server will run at `http://localhost:5001` by default. If 5001 is occupied, it will automatically retry the next free port.

### 3. Start Frontend Client
In a new terminal:
```bash
cd client
npm install
npm run dev
```

Visit `http://localhost:5173/` in your browser.

