import React from 'react';

export default function RiskMeter({ score = 0, size = 96, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let strokeColor = '#10B981'; // Green
  let textColor = '#6EE7B7';

  if (clampedScore >= 75) {
    strokeColor = '#EF4444'; // Red
    textColor = '#FCA5A5';
  } else if (clampedScore >= 50) {
    strokeColor = '#F97316'; // Orange
    textColor = '#FDBA74';
  } else if (clampedScore >= 25) {
    strokeColor = '#F59E0B'; // Amber
    textColor = '#FDE68A';
  }

  return (
    <div className="meter-wrapper" style={{ width: size, height: size }}>
      <svg className="meter-svg" width={size} height={size}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Animated Score ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease'
          }}
        />
      </svg>
      <div className="meter-score-text">
        <div className="meter-score-number" style={{ color: textColor }}>
          {clampedScore}
        </div>
        <div className="meter-score-max">/ 100</div>
      </div>
    </div>
  );
}
