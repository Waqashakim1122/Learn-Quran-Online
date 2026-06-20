import React from "react";
import "./About.css";
import Aboutimg from "../../assetes/about-img.jpg";

const features = [
  "Certified Quran Tutors",
  "One-on-One Live Classes",
  "Flexible Scheduling",
  "Male & Female Teachers",
  "Worldwide Access",
  "Progress Tracking",
];

const About = ({ setPlaystate }) => {
  return (
    <section className="about-section">
      <div className="about-grid">

        {/* Image Side */}
        <div className="about-image-wrapper">
          <img
            src={Aboutimg}
            alt="Student learning Quran"
            className="about-img"
          />
          <div className="about-image-frame"></div>

          <button
            type="button"
            className="video-btn"
            aria-label="Play Introduction Video"
            onClick={() => setPlaystate(true)}
          ></button>
        </div>

        {/* Content Side */}
        <div className="about-content">

          <div className="about-eyebrow">About Our Academy</div>

          <h2 className="about-title">
            Learn the Quran with Qualified Teachers From Anywhere in the World
          </h2>

          <p className="about-description">
            Learn Quran Online provides structured Quran education for
            children, adults, and families through one-on-one live classes,
            experienced tutors, and flexible schedules designed to fit your
            lifestyle.
          </p>

          <div className="about-features">
            {features.map((feature, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                {feature}
              </div>
            ))}
          </div>

          <a href="#contact" className="about-btn">
            Start Your Free Trial
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

        </div>

      </div>
    </section>
  );
};

export default About;
