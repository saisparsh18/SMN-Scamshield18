import React from 'react';
import { MessageSquare, Globe, Camera, Mic } from 'lucide-react';
import MessageAnalyzer from './MessageAnalyzer';
import UrlAnalyzer from './UrlAnalyzer';
import ScreenshotAnalyzer from './ScreenshotAnalyzer';
import VoiceAnalyzer from './VoiceAnalyzer';

export default function AnalysisTabs({ activeTab, onSelectTab, onAnalyze, isAnalyzing }) {
  return (
    <div>
      <div className="tab-navigation-bar">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'message' ? 'active' : ''}`}
          onClick={() => onSelectTab('message')}
        >
          <MessageSquare size={16} />
          <span>Message</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'url' ? 'active' : ''}`}
          onClick={() => onSelectTab('url')}
        >
          <Globe size={16} />
          <span>Target URL</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'screenshot' ? 'active' : ''}`}
          onClick={() => onSelectTab('screenshot')}
        >
          <Camera size={16} />
          <span>Screenshot</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'voice' ? 'active' : ''}`}
          onClick={() => onSelectTab('voice')}
        >
          <Mic size={16} />
          <span>Voice</span>
        </button>
      </div>

      {activeTab === 'message' && (
        <MessageAnalyzer onAnalyze={onAnalyze} isAnalyzing={isAnalyzing} />
      )}

      {activeTab === 'url' && (
        <UrlAnalyzer onAnalyze={onAnalyze} isAnalyzing={isAnalyzing} />
      )}

      {activeTab === 'screenshot' && (
        <ScreenshotAnalyzer onAnalyze={onAnalyze} isAnalyzing={isAnalyzing} />
      )}

      {activeTab === 'voice' && (
        <VoiceAnalyzer onAnalyze={onAnalyze} isAnalyzing={isAnalyzing} />
      )}
    </div>
  );
}

