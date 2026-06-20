import React from 'react';
import './Program.css';
import Program1 from '../../assetes/Quran--Memorization.jpg';
import Program2 from '../../assetes/Quran-Reactation.jpg';
import Program3 from '../../assetes/Quran-Tranlation-Course.jpg';
import Program4 from '../../assetes/Norani-quida.jpg';

const programs = [
  {
    img: Program1,
    title: 'Quran Memorization',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    img: Program2,
    title: 'Quran Recitation',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
      </svg>
    ),
  },
  {
    img: Program3,
    title: 'Quran Translation',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6" />
      </svg>
    ),
  },
  {
    img: Program4,
    title: 'Noorani Qaida',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
];

const Program = () => {
  return (
    <section className="programs-section">
      <div className="programs-header">
        <div className="programs-eyebrow">What We Offer</div>
        <h2 className="programs-title">Our Quran Learning Programs</h2>
        <p className="programs-sub">
          Structured courses for every stage of your Quran learning journey, taught by certified teachers.
        </p>
      </div>

      <div className="programs-grid">
        {programs.map((p, i) => (
          <div className="program-card" key={i}>
            <img src={p.img} alt={p.title} />
            <div className="program-card-base-caption">
              <span>{p.title}</span>
            </div>
            <div className="program-card-hover">
              <div className="program-card-icon">{p.icon}</div>
              <div className="program-card-hover-title">{p.title}</div>
              <div className="program-card-hover-link">Learn More →</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Program;
