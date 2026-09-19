import React from 'react';
import { Shield, ExternalLink, Heart } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Shield size={18} color="#06B6D4" />
            <span className="footer-brand-title">SMN SCAMSHIELD</span>
          </div>
          <p className="footer-disclaimer">
            An open AI scam detection and awareness platform designed to illuminate social engineering 
            and psychological coercion. SMN ScamShield evaluates observable patterns to explain 
            <strong> WHY</strong> something is suspicious without claiming absolute certainty.
          </p>
          <div style={{ marginTop: 12, fontSize: '0.78rem', color: '#64748B' }}>
            Built for Hackathon MVP • Privacy-First Architecture
          </div>
        </div>

        <div>
          <h4 className="footer-column-title">Emergency Helplines</h4>
          <ul className="footer-links-list">
            <li>
              <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer">
                India Cyber Crime (1930) <ExternalLink size={12} style={{ display: 'inline' }} />
              </a>
            </li>
            <li>
              <a href="https://www.ic3.gov" target="_blank" rel="noreferrer">
                FBI IC3 Fraud Center <ExternalLink size={12} style={{ display: 'inline' }} />
              </a>
            </li>
            <li>
              <a href="https://reportfraud.ftc.gov" target="_blank" rel="noreferrer">
                FTC Report Fraud <ExternalLink size={12} style={{ display: 'inline' }} />
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="footer-column-title">Platform Quick Links</h4>
          <ul className="footer-links-list">
            <li>
              <a href="#scanner" onClick={(e) => { e.preventDefault(); onNavigate('scanner'); }}>
                Message Scanner
              </a>
            </li>
            <li>
              <a href="#url" onClick={(e) => { e.preventDefault(); onNavigate('url'); }}>
                URL Inspector
              </a>
            </li>
            <li>
              <a href="#screenshot" onClick={(e) => { e.preventDefault(); onNavigate('screenshot'); }}>
                Screenshot OCR
              </a>
            </li>
            <li>
              <a href="#education" onClick={(e) => { e.preventDefault(); onNavigate('education'); }}>
                Scam Directory (8 Categories)
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>© 2025 SMN ScamShield. Detect. Understand. Protect.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>Empowering users with explainable cyber defense</span>
        </div>
      </div>
    </footer>
  );
}
