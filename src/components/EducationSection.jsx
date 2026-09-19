import React, { useState } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpRight, 
  Briefcase, 
  CreditCard, 
  TrendingUp, 
  Headphones, 
  Package, 
  UserX, 
  ShieldAlert, 
  Fish
} from 'lucide-react';
import { SCAM_CATEGORIES } from '../data/scamCategories';

const CATEGORY_ICONS = {
  FishHook: Fish,
  ShieldAlert: ShieldAlert,
  Briefcase: Briefcase,
  CreditCard: CreditCard,
  TrendingUp: TrendingUp,
  Headphones: Headphones,
  Package: Package,
  UserX: UserX
};

export default function EducationSection({ onLoadSampleToAnalyzer }) {
  const [expandedId, setExpandedId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const filterTags = [
    { id: 'all', label: 'All Categories' },
    { id: 'Banking', label: 'Banking & KYC' },
    { id: 'High Volume', label: 'High Volume' },
    { id: 'High Loss', label: 'Financial / Crypto' },
    { id: 'Authority Coercion', label: 'Authority / Police' }
  ];

  const filteredCategories = SCAM_CATEGORIES.filter((cat) => {
    if (activeFilter === 'all') return true;
    return cat.tag === activeFilter || (activeFilter === 'Banking' && (cat.tag === 'Banking' || cat.tag === 'UPI / Financial'));
  });

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="education-section" className="education-section">
      <div className="section-head">
        <h2 className="section-title">Common Scam Vectors & Anatomy</h2>
        <p className="section-desc">
          Understanding attacker psychology and recognizing common patterns is your primary line of defense. 
          Explore the 8 most frequent scam categories seen in digital fraud today.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="category-filter-chips">
        {filterTags.map((tag) => (
          <button
            key={tag.id}
            type="button"
            className={`filter-chip ${activeFilter === tag.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(tag.id)}
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* Grid of 8 Scam Categories */}
      <div className="education-grid">
        {filteredCategories.map((cat) => {
          const IconComponent = CATEGORY_ICONS[cat.icon] || AlertTriangle;
          const isExpanded = expandedId === cat.id;

          return (
            <div key={cat.id} className="cyber-card scam-category-card">
              <div>
                <div className="category-card-top">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span className="category-tag-pill">{cat.tag}</span>
                      <span 
                        style={{ 
                          fontSize: '0.72rem', 
                          fontWeight: 700, 
                          color: cat.severity === 'Critical' ? '#FCA5A5' : '#FDBA74' 
                        }}
                      >
                        {cat.severity} Risk
                      </span>
                    </div>
                    <h3 className="category-title">{cat.title}</h3>
                  </div>

                  <div className="category-icon-box">
                    <IconComponent size={20} />
                  </div>
                </div>

                <p className="category-summary">{cat.summary}</p>

                {/* Red flags snippet */}
                <div className="red-flags-box" style={{ marginTop: 14 }}>
                  <div className="red-flags-title">
                    <AlertTriangle size={12} />
                    <span>Immediate Red Flags:</span>
                  </div>
                  <ul className="red-flags-list">
                    {cat.redFlags.slice(0, 2).map((flag, idx) => (
                      <li key={idx}>{flag}</li>
                    ))}
                  </ul>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="category-expanded-content">
                    <div>
                      <strong style={{ color: '#F1F5F9', display: 'block', marginBottom: 4 }}>
                        How Attackers Operate:
                      </strong>
                      <ol style={{ paddingLeft: 18, color: '#94A3B8', lineHeight: 1.5 }}>
                        {cat.howItWorks.map((step, idx) => (
                          <li key={idx} style={{ marginBottom: 4 }}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <strong style={{ color: '#F1F5F9', display: 'block', marginBottom: 4 }}>
                        Real-World Deception Example:
                      </strong>
                      <div className="example-box">
                        "{cat.realExample}"
                      </div>
                    </div>

                    <div>
                      <strong style={{ color: '#10B981', display: 'block', marginBottom: 4 }}>
                        Protective Action Rules:
                      </strong>
                      <ul style={{ paddingLeft: 18, color: '#94A3B8', lineHeight: 1.5 }}>
                        {cat.preventionTips.map((tip, idx) => (
                          <li key={idx} style={{ marginBottom: 4 }}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10 }}>
                <button
                  type="button"
                  className="card-expand-toggle"
                  onClick={() => toggleExpand(cat.id)}
                >
                  <span>{isExpanded ? 'Hide Details' : 'View Full Anatomy'}</span>
                  {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>

                <button
                  type="button"
                  onClick={() => onLoadSampleToAnalyzer(cat.realExample)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#06B6D4',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                  title="Test this scenario in the Analyzer above"
                >
                  <span>Test in Scanner</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
