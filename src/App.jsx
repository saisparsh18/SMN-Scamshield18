import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AnalysisTabs from './components/AnalysisTabs';
import SecurityDashboard from './components/SecurityDashboard';
import EducationSection from './components/EducationSection';
import Footer from './components/Footer';
import { analyzeMessage, analyzeScreenshot, analyzeUrl, checkServerHealth } from './utils/api';
import { analyzeTextMessage } from './utils/heuristics';
import { DEMO_MESSAGE_SAMPLES } from './data/demoSamples';

export default function App() {
  const [activeTab, setActiveTab] = useState('message');
  const [activeSection, setActiveSection] = useState('hero');
  const [aiStatus, setAiStatus] = useState('local'); // 'ai' or 'local'
  const [analysisResult, setAnalysisResult] = useState(() => {
    // Initial friendly demo result with clearly labeled heuristic fallback
    const initial = analyzeTextMessage(DEMO_MESSAGE_SAMPLES[0].text);
    if (initial) {
      initial.engine = 'heuristic';
      initial.engineLabel = 'Local Heuristic Analysis';
      initial.assessmentType = 'Heuristic Risk Assessment';
    }
    return initial;
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const scannerRef = useRef(null);
  const educationRef = useRef(null);

  // Poll or check server health on mount to set exact status badge
  useEffect(() => {
    checkServerHealth().then((health) => {
      if (health.online && health.aiConfigured) {
        setAiStatus('ai');
      } else {
        setAiStatus('local');
      }
    });
  }, []);

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    if (scannerRef.current) {
      scannerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavigate = (section) => {
    setActiveSection(section);
    if (section === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'scanner' && scannerRef.current) {
      scannerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (section === 'education' && educationRef.current) {
      educationRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAnalyze = async (input, type) => {
    if (!input) return;
    setIsAnalyzing(true);

    try {
      let result = null;
      if (type === 'message' || type === 'voice') {
        result = await analyzeMessage(input);
        if (result && type === 'voice') {
          result.sourceType = 'voice';
          result.analyzedInput = input;
        }
      } else if (type === 'screenshot') {
        if (typeof input === 'object' && input.imageBase64) {
          result = await analyzeScreenshot(input);
        } else if (typeof input === 'string') {
          result = await analyzeScreenshot({ fallbackText: input });
        }
      } else if (type === 'url') {
        result = await analyzeUrl(input);
      }


      if (result) {
        if (result.engine === 'ai') {
          setAiStatus('ai');
        } else {
          setAiStatus('local');
        }
      }

      setAnalysisResult(result);
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
      if (scannerRef.current) {
        scannerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const handleLoadSampleFromEducation = (sampleText) => {
    setActiveTab('message');
    handleAnalyze(sampleText, 'message');
    if (scannerRef.current) {
      scannerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="app-container">
      <Navbar 
        onNavigate={handleNavigate} 
        activeSection={activeSection} 
        aiStatus={aiStatus}
      />

      <main className="main-content">
        <HeroSection 
          activeTab={activeTab} 
          onSelectTab={handleSelectTab} 
        />

        {/* Security Scanner Workspace */}
        <section ref={scannerRef} id="scanner-area" style={{ scrollMarginTop: 90 }}>
          <div className="analyzer-workspace">
            <AnalysisTabs
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />

            <SecurityDashboard
              result={analysisResult}
              onReset={handleReset}
            />
          </div>
        </section>

        {/* Education & Awareness Section */}
        <div ref={educationRef} style={{ scrollMarginTop: 80 }}>
          <EducationSection onLoadSampleToAnalyzer={handleLoadSampleFromEducation} />
        </div>
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
