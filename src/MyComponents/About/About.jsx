import React from "react";
import "./About.css";
import Aboutimg from "../../assetes/about-img.jpg";
import Aboutplybuton from "../../assetes/Play-Button.gif";

const About = ({ setPlaystate }) => {
  return (
    <section className="about-section">
      <div className="container">
        <div className="row align-items-center g-5">

          {/* Image Side */}
          <div className="col-lg-6">
            <div className="about-image-wrapper">

              <img
                src={Aboutimg}
                alt="Learn Quran Online"
                className="about-img"
              />

              <button
                type="button"
                className="video-btn"
                aria-label="Play Introduction Video"
                onClick={() => setPlaystate(true)}
              >
                <img
                  src={Aboutplybuton}
                  alt="Play Video"
                  className="play-icon"
                />
              </button>

            </div>
          </div>

          {/* Content Side */}
          <div className="col-lg-6">
            <div className="about-content">

              <span className="section-tag">
                ABOUT OUR ACADEMY
              </span>

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

                <div className="feature-card">
                  ✓ Certified Quran Tutors
                </div>

                <div className="feature-card">
                  ✓ One-on-One Live Classes
                </div>

                <div className="feature-card">
                  ✓ Flexible Scheduling
                </div>

                <div className="feature-card">
                  ✓ Male & Female Teachers
                </div>

                <div className="feature-card">
                  ✓ Worldwide Access
                </div>

                <div className="feature-card">
                  ✓ Progress Tracking
                </div>

              </div>

              <a href="#contact" className="about-btn">
                Start Your Free Trial
              </a>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
