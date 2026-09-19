import React from 'react';
import { MessageSquare, Globe, Camera, Mic, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export default function HeroSection({ activeTab, onSelectTab }) {
  return (
    <section className="hero-section">
      <div className="hero-pill">
        <Sparkles size={14} />
        <span>NEXT-GEN SCAM INTELLIGENCE & EXPLAINABILITY</span>
      </div>

      <h1 className="hero-title">
        SMN <span className="highlight">SCAMSHIELD</span>
      </h1>

      <div className="hero-tagline">
        Detect. Understand. Protect.
      </div>

      <p className="hero-desc">
        Evaluate suspicious SMS, WhatsApp messages, deceptive URLs, phishing screenshots, and phone calls. 
        Uncover psychological coercion, credential harvesters, and fraudulent domains with 
        clear, evidence-backed security explanations.
      </p>

      {/* Main Actions required by specification */}
      <div className="hero-action-buttons">
        <button
          type="button"
          className={`hero-action-btn ${activeTab === 'message' ? 'active' : ''}`}
          onClick={() => onSelectTab('message')}
        >
          <MessageSquare size={18} color="#06B6D4" />
          <span>Analyze Message</span>
        </button>

        <button
          type="button"
          className={`hero-action-btn ${activeTab === 'url' ? 'active' : ''}`}
          onClick={() => onSelectTab('url')}
        >
          <Globe size={18} color="#3B82F6" />
          <span>Analyze URL</span>
        </button>

        <button
          type="button"
          className={`hero-action-btn ${activeTab === 'screenshot' ? 'active' : ''}`}
          onClick={() => onSelectTab('screenshot')}
        >
          <Camera size={18} color="#8B5CF6" />
          <span>Analyze Screenshot</span>
        </button>

        <button
          type="button"
          className={`hero-action-btn ${activeTab === 'voice' ? 'active' : ''}`}
          onClick={() => onSelectTab('voice')}
        >
          <Mic size={18} color="#10B981" />
          <span>Analyze Voice</span>
        </button>
      </div>


      <div className="hero-stats-banner">
        <div className="stat-item">
          <span className="stat-value" style={{ color: '#06B6D4' }}>0-100</span>
          <span className="stat-label">Calibrated Risk Index</span>
        </div>
        <div className="stat-item">
          <span className="stat-value" style={{ color: '#10B981' }}>100%</span>
          <span className="stat-label">Client-Side Privacy</span>
        </div>
        <div className="stat-item">
          <span className="stat-value" style={{ color: '#F59E0B' }}>8 Core</span>
          <span className="stat-label">Threat Categories</span>
        </div>
      </div>
    </section>
  );
}
