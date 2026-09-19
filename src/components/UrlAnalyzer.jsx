import React, { useState } from 'react';
import { Globe, ShieldCheck, Sparkles, X, Lock, Unlock } from 'lucide-react';
import { DEMO_URL_SAMPLES } from '../data/demoSamples';

export default function UrlAnalyzer({ onAnalyze, isAnalyzing }) {
  const [inputUrl, setInputUrl] = useState('');
  const [selectedSampleId, setSelectedSampleId] = useState(null);

  const handleSelectSample = (sample) => {
    setInputUrl(sample.url);
    setSelectedSampleId(sample.id);
    onAnalyze(sample.url, 'url');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    onAnalyze(inputUrl.trim(), 'url');
  };

  const handleClear = () => {
    setInputUrl('');
    setSelectedSampleId(null);
  };

  const isHttp = inputUrl.trim().startsWith('http://');
  const isHttps = inputUrl.trim().startsWith('https://');

  return (
    <div className="cyber-card analyzer-panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <Globe size={20} color="#3B82F6" />
          <span>URL Structure & Indicator Scanner</span>
        </h2>
        <p className="panel-subtitle">
          Examine observable domain indicators, transport encryption, and lookalike brand subdomains.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <label htmlFor="url-input" className="input-label" style={{ margin: 0 }}>
            Target Web Address / Link
          </label>
          {inputUrl && (
            <button
              type="button"
              onClick={handleClear}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <input
            id="url-input"
            type="text"
            className="cyber-input"
            placeholder="e.g. http://sbi-secure-kyc.account-verify.xyz/login"
            value={inputUrl}
            onChange={(e) => {
              setInputUrl(e.target.value);
              setSelectedSampleId(null);
            }}
            style={{ paddingLeft: inputUrl ? 36 : 14 }}
          />

          {/* Dynamic Lock indicator */}
          {inputUrl && (
            <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
              {isHttps ? (
                <Lock size={15} color="#10B981" title="HTTPS Transport Specified" />
              ) : isHttp ? (
                <Unlock size={15} color="#EF4444" title="Unencrypted Plain-text HTTP" />
              ) : null}
            </div>
          )}
        </div>

        {/* 1-Click Demo Samples */}
        <div className="samples-wrapper">
          <div className="samples-label">
            <Sparkles size={12} color="#3B82F6" />
            <span>Try Instant URL Test Vectors:</span>
          </div>
          <div className="samples-pills">
            {DEMO_URL_SAMPLES.map((sample) => (
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
          disabled={!inputUrl.trim() || isAnalyzing}
          style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' }}
        >
          <ShieldCheck size={18} />
          <span>{isAnalyzing ? 'Inspecting Indicators...' : 'Analyze URL Indicators'}</span>
        </button>
      </form>
    </div>
  );
}
