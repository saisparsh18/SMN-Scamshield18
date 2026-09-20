import React from 'react';
import { Shield, ShieldAlert, Cpu, ExternalLink, BookOpen, Search } from 'lucide-react';

export default function Navbar({ onNavigate, activeSection, aiStatus = 'local' }) {
  const isAiActive = aiStatus === 'ai';

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand-group" onClick={() => onNavigate('hero')}>
          <div className="brand-logo-icon">
            <Shield size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div className="brand-title">
              SMN <span>SCAMSHIELD</span>
            </div>
          </div>
          <span className="brand-badge">MVP</span>
        </div>

        <nav className="nav-links">
          <button 
            type="button"
            className={`nav-link-btn ${activeSection === 'scanner' ? 'active' : ''}`}
            onClick={() => onNavigate('scanner')}
          >
            <Search size={15} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />
            Threat Scanner
          </button>

          <button 
            type="button"
            className={`nav-link-btn ${activeSection === 'education' ? 'active' : ''}`}
            onClick={() => onNavigate('education')}
          >
            <BookOpen size={15} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />
            Scam Directory
          </button>

          <div 
            className={`status-indicator ${isAiActive ? 'ai-active' : 'local-mode'}`}
            title={isAiActive ? 'Gemini AI Telemetry Active' : 'Local Heuristic Analysis Mode (Configure GEMINI_API_KEY in server/.env to activate AI)'}
          >
            <span className="pulse-dot" />
            <span>{isAiActive ? 'AI ENGINE ACTIVE' : 'LOCAL ANALYSIS MODE'}</span>
          </div>
        </nav>
      </div>
    </header>
  );
}
