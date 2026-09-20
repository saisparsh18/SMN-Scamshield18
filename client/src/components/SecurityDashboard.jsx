import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  RotateCcw, 
  Layers,
  Sparkles,
  Cpu,
  Compass,
  FileCheck2,
  Mic
} from 'lucide-react';
import RiskMeter from './RiskMeter';

export default function SecurityDashboard({ result, onReset }) {
  const [copied, setCopied] = useState(false);

  if (!result) {
    return (
      <div className="cyber-card empty-dashboard">
        <div className="empty-radar-icon">
          <ShieldAlert size={28} />
        </div>
        <h3 className="empty-title">Threat Telemetry Standby</h3>
        <p className="empty-desc">
          Paste a suspicious message, enter a target URL, upload a screenshot, or record a voice call on the left panel to generate an explainable threat assessment.
        </p>
      </div>
    );
  }

  const {
    riskScore = 0,
    riskLevel = 'LOW',
    category = 'Unknown Category',
    summary = '',
    warningSigns = [],
    indicators = [],
    recommendedActions = [],
    confidence = null,
    engine = 'heuristic',
    engineLabel = 'Local Heuristic Analysis',
    assessmentType = 'AI Risk Assessment',
    sourceType = '',
    timestamp = ''
  } = result;

  const isAi = engine === 'ai';
  const levelClass = riskLevel.toLowerCase();

  const handleCopyReport = () => {
    const reportText = `[SMN SCAMSHIELD TELEMETRY DOSSIER]
Mode: ${isAi ? 'AI-assisted analysis' : 'Local Heuristic Analysis'}${sourceType ? ` [Source: ${sourceType.toUpperCase()}]` : ''}
Assessment: ${assessmentType}

Threat Tier: ${riskLevel} (${riskScore}/100)
${confidence ? `AI Confidence: ${confidence}%\n` : ''}Category: ${category}
Summary: ${summary}

Warning Signs (${warningSigns.length} detected):
${warningSigns.map((w) => `- [${w.severity || 'WARN'}] ${w.title || w.type}: ${w.description}`).join('\n')}

Recommended Safety Actions:
${recommendedActions.map((a) => `- ${a}`).join('\n')}

Analyzed: ${new Date(timestamp).toLocaleString()}
SMN ScamShield • Detect. Understand. Protect.`;


    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="cyber-card dashboard-card">
      {/* Header bar with Engine Provenance Badge */}
      <div className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div className="dashboard-tag">
            {sourceType === 'voice' ? (
              <>
                <Mic size={14} color="#10B981" />
                <span>Voice Telemetry Dossier</span>
              </>
            ) : (
              <>
                <Layers size={14} color="#06B6D4" />
                <span>Telemetry Dossier</span>
              </>
            )}
          </div>


          {/* Explicit Engine Label per Safety Requirements */}
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: '0.74rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              padding: '3px 9px',
              borderRadius: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              background: isAi ? 'rgba(6, 182, 212, 0.15)' : 'rgba(148, 163, 184, 0.12)',
              color: isAi ? '#38BDF8' : '#CBD5E1',
              border: isAi ? '1px solid rgba(6, 182, 212, 0.35)' : '1px solid rgba(148, 163, 184, 0.25)'
            }}
          >
            {isAi ? <Sparkles size={12} color="#06B6D4" /> : <Cpu size={12} color="#94A3B8" />}
            <span>{isAi ? 'AI-assisted analysis' : 'Local heuristic analysis'}</span>
          </div>

          {confidence && (
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
              Confidence: {confidence}%
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={handleCopyReport}
            title="Copy structured security report to clipboard"
          >
            {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button 
            type="button" 
            className="btn-secondary" 
            onClick={onReset}
            title="Clear and perform another analysis"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Risk Hero Card */}
      <div className={`risk-hero-card ${levelClass}`}>
        <RiskMeter score={riskScore} />

        <div className="risk-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <span className={`risk-level-badge badge-${levelClass}`}>
              {riskLevel} THREAT
            </span>
            <span style={{ fontSize: '0.76rem', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
              {isAi ? 'AI Risk Assessment' : 'Heuristic Assessment'}
            </span>
          </div>

          <h3 className="risk-category-name">{category}</h3>
          <p className="risk-summary-text">{summary}</p>
        </div>
      </div>

      {/* URL Observable Indicators (if URL analysis) */}
      {indicators && indicators.length > 0 && (
        <div>
          <div className="section-subtitle">
            <Compass size={14} color="#06B6D4" />
            <span>Observable Technical Indicators</span>
          </div>

          <div className="indicators-grid">
            {indicators.map((ind, idx) => (
              <div key={idx} className="indicator-row">
                <div>
                  <div className="indicator-name">{ind.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: 2 }}>
                    {ind.note}
                  </div>
                </div>
                <span className={`indicator-badge ${ind.safe ? 'indicator-safe' : 'indicator-warn'}`}>
                  {ind.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warning Signs Explainability with Evidence Citations */}
      <div>
        <div className="section-subtitle">
          <AlertTriangle size={14} color="#EF4444" />
          <span>Why It Was Flagged ({warningSigns.length} Indicators Identified)</span>
        </div>

        {warningSigns.length === 0 ? (
          <div style={{ padding: '12px 14px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: 8, fontSize: '0.84rem', color: '#94A3B8' }}>
            No prominent coercion triggers, known suspicious URLs, or credential prompts were detected.
          </div>
        ) : (
          <div className="warning-signs-list">
            {warningSigns.map((sign, idx) => {
              const severityUpper = (sign.severity || 'HIGH').toUpperCase();
              const isHigh = severityUpper === 'HIGH' || severityUpper === 'CRITICAL';
              const isMed = severityUpper === 'MEDIUM' || severityUpper === 'MODERATE';

              return (
                <div key={idx} className="warning-sign-item">
                  <div className="warning-sign-icon">
                    <AlertTriangle size={16} color={isHigh ? '#EF4444' : isMed ? '#F59E0B' : '#10B981'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span className="warning-sign-title">{sign.title || sign.type}</span>
                      <span style={{
                        fontSize: '0.68rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: 3,
                        color: isHigh ? '#FCA5A5' : isMed ? '#FDE68A' : '#A7F3D0',
                        background: isHigh ? 'rgba(239, 68, 68, 0.2)' : isMed ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'
                      }}>
                        {severityUpper}
                      </span>
                    </div>
                    <div className="warning-sign-desc">{sign.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommended Protective Actions */}
      <div>
        <div className="section-subtitle">
          <ShieldCheck size={14} color="#10B981" />
          <span>Recommended Protective Actions</span>
        </div>

        <div className="action-checklist">
          {recommendedActions.map((action, idx) => (
            <div key={idx} className="action-item">
              <CheckCircle2 size={16} className="action-icon" />
              <span>{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Provenance & Grounded Ethics Note */}
      <div style={{ 
        borderTop: '1px solid rgba(255, 255, 255, 0.06)', 
        paddingTop: 12, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        fontSize: '0.72rem', 
        color: '#64748B',
        flexWrap: 'wrap',
        gap: 8
      }}>
        <span>
          {isAi ? '⚡ Gemini 2.5 Flash Grounded Model' : '🛡️ Local Rule & Signal Extraction Engine'}
        </span>
        <span>
          Risk Assessment • Probabilistic Security Telemetry
        </span>
      </div>
    </div>
  );
}
