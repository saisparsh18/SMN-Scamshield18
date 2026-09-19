import React, { useState } from 'react';
import { MessageSquare, ShieldCheck, Sparkles, X } from 'lucide-react';
import { DEMO_MESSAGE_SAMPLES } from '../data/demoSamples';

export default function MessageAnalyzer({ onAnalyze, isAnalyzing }) {
  const [inputText, setInputText] = useState('');
  const [selectedSampleId, setSelectedSampleId] = useState(null);

  const handleSelectSample = (sample) => {
    setInputText(sample.text);
    setSelectedSampleId(sample.id);
    onAnalyze(sample.text, 'message');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAnalyze(inputText.trim(), 'message');
  };

  const handleClear = () => {
    setInputText('');
    setSelectedSampleId(null);
  };

  return (
    <div className="cyber-card analyzer-panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <MessageSquare size={20} color="#06B6D4" />
          <span>Message Threat Inspection</span>
        </h2>
        <p className="panel-subtitle">
          Paste any unsolicited SMS, WhatsApp text, or email to detect coercive manipulation and red flags.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <label htmlFor="message-input" className="input-label" style={{ margin: 0 }}>
            Suspicious Message Text
          </label>
          {inputText && (
            <button
              type="button"
              onClick={handleClear}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>

        <textarea
          id="message-input"
          className="cyber-textarea"
          placeholder="e.g. 'Dear customer, your bank account has been suspended due to incomplete KYC. Click here immediately to update...' "
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setSelectedSampleId(null);
          }}
          rows={5}
        />

        {/* 1-Click Demo Samples */}
        <div className="samples-wrapper">
          <div className="samples-label">
            <Sparkles size={12} color="#06B6D4" />
            <span>Try Instant Hackathon Scenarios:</span>
          </div>
          <div className="samples-pills">
            {DEMO_MESSAGE_SAMPLES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                className={`sample-chip ${selectedSampleId === sample.id ? 'active' : ''}`}
                onClick={() => handleSelectSample(sample)}
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={!inputText.trim() || isAnalyzing}
        >
          <ShieldCheck size={18} />
          <span>{isAnalyzing ? 'Analyzing Message...' : 'Analyze Message Indicators'}</span>
        </button>
      </form>
    </div>
  );
}
