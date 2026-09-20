import React, { useState, useRef } from 'react';
import { Camera, Upload, Image as ImageIcon, Sparkles, X, FileText, Check } from 'lucide-react';

const DEMO_SCREENSHOTS = [
  {
    id: 'shot-kyc',
    title: 'Bank KYC SMS Screenshot',
    sender: 'HDFC-ALERT / SBI-NOTICE',
    message: 'URGENT! Your bank account will be suspended today. Click the link below immediately to complete your KYC verification: http://sbi-secure-kyc.account-verify.xyz/login. Failure to do so will result in account closure.',
    extractedText: 'URGENT! Your bank account will be suspended today. Click the link below immediately to complete your KYC verification: http://sbi-secure-kyc.account-verify.xyz/login. Failure to do so will result in account closure.',
    gradStart: '#1E1B4B',
    gradEnd: '#0F172A'
  },
  {
    id: 'shot-job',
    title: 'Telegram Job Chat Screenshot',
    sender: 'Telegram: Sarah HR Recruitment',
    message: 'Hello! I am Sarah from Global Media. Earn $400-$900 daily by liking 3 YouTube videos for 30 mins! Contact @EarnFastVIP now. Immediate daily payment.',
    extractedText: 'Sarah HR: Hello dear, do you want a part time job? You can earn $400-$900 daily by liking YouTube videos for 30 minutes! First 3 tasks give bonus. Contact Telegram @EarnFastVIP now.',
    gradStart: '#064E3B',
    gradEnd: '#0F172A'
  },
  {
    id: 'shot-package',
    title: 'FedEx Customs Parcel Screenshot',
    sender: 'FedEx Delivery Tracking',
    message: 'FedEx Alert: Parcel #FDX-88910 could not be cleared through regional hub due to missing customs street code. Please confirm your delivery address and pay $1.99 redelivery fee at https://fedex-parcel-redelivery.top/renew',
    extractedText: 'FedEx Alert: Parcel #FDX-88910 could not be cleared through regional hub due to missing customs street code. Please confirm delivery address and pay $1.99 redelivery fee at https://fedex-parcel-redelivery.top/renew',
    gradStart: '#431407',
    gradEnd: '#1E293B'
  }
];

function generateCanvasScreenshot(demo) {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 360;
  const ctx = canvas.getContext('2d');

  // Background
  const grad = ctx.createLinearGradient(0, 0, 640, 360);
  grad.addColorStop(0, demo.gradStart || '#111827');
  grad.addColorStop(1, demo.gradEnd || '#0B0F17');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 360);

  // Status Bar
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '13px sans-serif';
  ctx.fillText('9:41 AM  •  5G LTE  •  100%', 25, 32);

  // Smartphone Notification Card
  ctx.fillStyle = 'rgba(17, 24, 39, 0.92)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(24, 55, 592, 275, 14);
  ctx.fill();
  ctx.stroke();

  // App & Sender
  ctx.fillStyle = '#06B6D4';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(demo.sender, 45, 95);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '12px sans-serif';
  ctx.fillText('now • SMS / Messaging Notification', 45, 118);

  // Message content wrapping
  ctx.fillStyle = '#F8FAFC';
  ctx.font = '15px sans-serif';
  const words = demo.message.split(' ');
  let line = '';
  let y = 155;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 530 && n > 0) {
      ctx.fillText(line, 45, y);
      line = words[n] + ' ';
      y += 24;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 45, y);

  return canvas.toDataURL('image/png');
}

export default function ScreenshotAnalyzer({ onAnalyze, isAnalyzing }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageMime, setImageMime] = useState('image/png');
  const [extractedText, setExtractedText] = useState('');
  const [selectedDemoId, setSelectedDemoId] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;

    setImageMime(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setImagePreview(dataUrl);
      setSelectedDemoId(null);
      setExtractedText(`[Image File: ${file.name}] Ready for Gemini Vision Analysis.`);

      // Automatically dispatch to Gemini Vision analyzer
      onAnalyze(
        {
          imageBase64: dataUrl,
          mimeType: file.type || 'image/png',
          fallbackText: `Screenshot upload ${file.name}`
        },
        'screenshot'
      );
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectDemo = (demo) => {
    setSelectedDemoId(demo.id);
    setExtractedText(demo.extractedText);
    const generatedDataUrl = generateCanvasScreenshot(demo);
    setImagePreview(generatedDataUrl);
    setImageMime('image/png');

    onAnalyze(
      {
        imageBase64: generatedDataUrl,
        mimeType: 'image/png',
        fallbackText: demo.extractedText
      },
      'screenshot'
    );
  };

  const handleClear = () => {
    setImagePreview(null);
    setExtractedText('');
    setSelectedDemoId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!imagePreview && !extractedText.trim()) return;

    onAnalyze(
      {
        imageBase64: imagePreview,
        mimeType: imageMime || 'image/png',
        fallbackText: extractedText.trim()
      },
      'screenshot'
    );
  };

  return (
    <div className="cyber-card analyzer-panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <Camera size={20} color="#8B5CF6" />
          <span>Screenshot & Vision Threat Scanner</span>
        </h2>
        <p className="panel-subtitle">
          Upload any screenshot of a suspicious chat, SMS popup, or email. Gemini Vision extracts visible text and flags deception.
        </p>
      </div>

      {/* Dropzone */}
      <div
        className={`dropzone ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <Upload className="dropzone-icon" />
        <div className="dropzone-text">Click or drag & drop screenshot here</div>
        <div className="dropzone-hint">Supports PNG, JPG, WEBP screenshots up to 20MB</div>
      </div>

      {/* 1-Click Demo Screenshots */}
      <div className="samples-wrapper">
        <div className="samples-label">
          <Sparkles size={12} color="#8B5CF6" />
          <span>Try Realistic Preloaded Screenshots:</span>
        </div>
        <div className="samples-pills">
          {DEMO_SCREENSHOTS.map((demo) => (
            <button
              key={demo.id}
              type="button"
              className={`sample-chip ${selectedDemoId === demo.id ? 'active' : ''}`}
              onClick={() => handleSelectDemo(demo)}
            >
              {demo.title}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Demo or Uploaded Preview */}
      {(imagePreview || selectedDemoId) && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span className="input-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileText size={14} color="#8B5CF6" />
              <span>Visual Image Preview</span>
            </span>
            <button
              type="button"
              onClick={handleClear}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <X size={12} /> Clear
            </button>
          </div>

          {imagePreview && (
            <div className="preview-container">
              <img src={imagePreview} alt="Screenshot preview" className="preview-image" />
            </div>
          )}

          {extractedText && (
            <div style={{ marginTop: 8 }}>
              <div className="input-label" style={{ fontSize: '0.74rem', marginBottom: 4 }}>
                Visible Content Context:
              </div>
              <textarea
                className="cyber-textarea"
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                rows={2}
                placeholder="Visible text from image..."
              />
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        className="btn-primary"
        disabled={(!imagePreview && !extractedText.trim()) || isAnalyzing}
        onClick={handleSubmit}
        style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)' }}
      >
        <Camera size={18} />
        <span>{isAnalyzing ? 'Analyzing with Gemini Vision...' : 'Analyze Screenshot with AI'}</span>
      </button>
    </div>
  );
}
