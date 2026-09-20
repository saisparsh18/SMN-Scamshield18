import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Square, 
  ShieldCheck, 
  Sparkles, 
  X, 
  AlertCircle, 
  Radio, 
  CheckCircle2,
  PhoneCall,
  Volume2
} from 'lucide-react';
import { DEMO_VOICE_SAMPLES } from '../data/demoSamples';

export default function VoiceAnalyzer({ onAnalyze, isAnalyzing }) {
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedSampleId, setSelectedSampleId] = useState(null);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // Detect Web Speech API availability
  const isSpeechSupported = typeof window !== 'undefined' && 
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    setRecordingSeconds(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatSeconds = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Starts speech recognition and requests microphone permission
   * ONLY when the user explicitly triggers this click handler.
   */
  const handleStartRecording = () => {
    setErrorMessage(null);
    setInterimText('');
    setSelectedSampleId(null);

    if (!isSpeechSupported) {
      setErrorMessage(
        'Browser Speech Recognition is not supported in this browser. Please use Chrome, Edge, or Safari, or paste a transcript manually.'
      );
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        startTimer();
      };

      recognition.onresult = (event) => {
        let interim = '';
        let finalAccumulated = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            finalAccumulated += item[0].transcript + ' ';
          } else {
            interim += item[0].transcript;
          }
        }

        if (finalAccumulated) {
          setTranscript((prev) => {
            const trimmedPrev = prev ? prev.trim() : '';
            return trimmedPrev ? `${trimmedPrev} ${finalAccumulated.trim()}` : finalAccumulated.trim();
          });
        }
        setInterimText(interim);
      };

      recognition.onerror = (event) => {
        console.warn('[ScamShield AI] Speech recognition error event:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage(
            'Microphone access was denied. Please allow microphone permission in your browser address bar to record audio.'
          );
        } else if (event.error === 'no-speech') {
          // No-speech can be transient, don't break recording immediately unless stopped
        } else if (event.error === 'audio-capture') {
          setErrorMessage('No microphone found. Please connect an audio input device.');
        } else if (event.error === 'network') {
          setErrorMessage('Speech recognition network error. Please check your internet connection.');
        } else {
          setErrorMessage(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        stopTimer();
        setInterimText('');
      };

      // Prompt browser mic permissions and start listening
      recognition.start();
    } catch (err) {
      console.error('Failed to initialize speech recognition:', err);
      setErrorMessage(`Could not start speech recognition: ${err.message}`);
      setIsRecording(false);
      stopTimer();
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsRecording(false);
    stopTimer();
    setInterimText('');
  };

  const handleClear = () => {
    if (isRecording) {
      handleStopRecording();
    }
    setTranscript('');
    setInterimText('');
    setSelectedSampleId(null);
    setErrorMessage(null);
    setRecordingSeconds(0);
  };

  const handleSelectSample = (sample) => {
    if (isRecording) {
      handleStopRecording();
    }
    setTranscript(sample.text);
    setInterimText('');
    setSelectedSampleId(sample.id);
    onAnalyze(sample.text, 'voice');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRecording) {
      handleStopRecording();
    }
    const combined = [transcript, interimText].filter(Boolean).join(' ').trim();
    if (!combined) return;
    onAnalyze(combined, 'voice');
  };

  const currentDisplay = [transcript, interimText].filter(Boolean).join(' ').trim();

  return (
    <div className="cyber-card analyzer-panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <PhoneCall size={20} color="#10B981" />
          <span>Voice Scam & Vishing Scanner</span>
        </h2>
        <p className="panel-subtitle">
          Record suspicious incoming phone calls or voicemails in real time using speech recognition to detect coercive phone scams.
        </p>
      </div>

      {/* Browser Compatibility Notice */}
      {!isSpeechSupported && (
        <div 
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            padding: '12px 14px',
            marginBottom: 16,
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 8,
            fontSize: '0.82rem',
            color: '#FDE68A'
          }}
        >
          <AlertCircle size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <strong>Browser Speech Recognition Not Detected:</strong> Your current browser does not natively expose the Web Speech API. You can still test voice scam detection by selecting an instant scenario below or manually pasting call transcripts into the box.
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            padding: '12px 14px',
            marginBottom: 16,
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 8,
            fontSize: '0.82rem',
            color: '#FCA5A5'
          }}
        >
          <AlertCircle size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ flex: 1 }}>{errorMessage}</div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            style={{ background: 'none', border: 'none', color: '#FCA5A5', cursor: 'pointer' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Microphone Controls Strip */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '12px 16px',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 8,
          marginBottom: 16
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!isRecording ? (
            <button
              type="button"
              className="btn-primary"
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
              }}
              onClick={handleStartRecording}
              disabled={isAnalyzing}
            >
              <Mic size={16} />
              <span>Start Recording</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              style={{
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)'
              }}
              onClick={handleStopRecording}
            >
              <Square size={16} />
              <span>Stop Recording</span>
            </button>
          )}

          {isRecording && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span 
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#EF4444',
                  boxShadow: '0 0 10px #EF4444',
                  animation: 'pulse-glow 1s infinite'
                }} 
              />
              <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#FCA5A5', fontWeight: 600 }}>
                REC {formatSeconds(recordingSeconds)}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                (Listening...)
              </span>
            </div>
          )}
        </div>

        {/* Audio privacy assurance */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.74rem', color: '#94A3B8' }}>
          <CheckCircle2 size={13} color="#10B981" />
          <span>No audio files stored • Real-time client speech streaming</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <label htmlFor="voice-transcript-input" className="input-label" style={{ margin: 0 }}>
            Live Speech Transcript
          </label>
          {currentDisplay && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <X size={12} /> Clear Transcript
            </button>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <textarea
            id="voice-transcript-input"
            className="cyber-textarea"
            placeholder="Spoken words will appear here in real time when you click 'Start Recording'... Or choose an instant vishing scenario below."
            value={transcript + (interimText ? (transcript ? ' ' : '') + interimText : '')}
            onChange={(e) => {
              setTranscript(e.target.value);
              setInterimText('');
              setSelectedSampleId(null);
            }}
            rows={5}
          />

          {isRecording && (
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                right: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 8px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 4,
                fontSize: '0.72rem',
                color: '#34D399',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <Radio size={12} className="animate-pulse" />
              <span>Transcribing Speech...</span>
            </div>
          )}
        </div>

        {/* 1-Click Voice Scam Demos */}
        <div className="samples-wrapper">
          <div className="samples-label">
            <Sparkles size={12} color="#10B981" />
            <span>Try Instant Voice Call Scenarios:</span>
          </div>
          <div className="samples-pills">
            {DEMO_VOICE_SAMPLES.map((sample) => (
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
          style={{
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
          }}
          disabled={!currentDisplay || isAnalyzing || isRecording}
        >
          <ShieldCheck size={18} />
          <span>
            {isAnalyzing
              ? 'Analyzing Spoken Threat...'
              : isRecording
              ? 'Stop Recording to Analyze'
              : 'Analyze Voice Transcript'}
          </span>
        </button>
      </form>
    </div>
  );
}
