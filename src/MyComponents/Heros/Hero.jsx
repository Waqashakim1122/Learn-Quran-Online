import React from 'react';
import { NavLink } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-pat-tr"></div>
      <div className="hero-pat-bl"></div>
      <div className="hero-inner">

        <div className="hero-eyebrow">Online Quran Academy — UK & USA</div>

        <div className="hero-bismillah">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</div>

        <p className="hero-sub">Most Sought-After Online Quran Academy in UK & USA</p>

        <h1 className="hero-title">Online <em>Quran</em> Classes</h1>

        <p className="hero-desc">
          Quran Nazra, Hifz & Tajweed classes for Men, Women & Kids — taught by
          certified teachers, live one-on-one from anywhere in the world.
        </p>

        <div className="hero-btns">
          <NavLink to="/courses" className="hero-btn-gold">
            Book Free Trial Class
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </NavLink>
          <NavLink to="/About" className="hero-btn-outline">
            Learn More
          </NavLink>
        </div>

        <div className="hero-feats">

          <div className="hero-feat">
            <div className="hero-feat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <div className="hero-feat-text">
              <strong>Certified Teachers</strong>
              <span>Qualified & experienced</span>
            </div>
          </div>

          <div className="hero-feat-div"></div>

          <div className="hero-feat">
            <div className="hero-feat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div className="hero-feat-text">
              <strong>1-on-1 Live Classes</strong>
              <span>Personal attention</span>
            </div>
          </div>

          <div className="hero-feat-div"></div>

          <div className="hero-feat">
            <div className="hero-feat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div className="hero-feat-text">
              <strong>Flexible Schedule</strong>
              <span>Learn at your pace</span>
            </div>
          </div>

          <div className="hero-feat-div"></div>

          <div className="hero-feat">
            <div className="hero-feat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <div className="hero-feat-text">
              <strong>Learn From Anywhere</strong>
              <span>UK, USA & worldwide</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
