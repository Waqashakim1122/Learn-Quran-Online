import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import OurVisionImg from '../assetes/about-page4.jpg';
import OurCoursesImg from '../assetes/about-page2.jpg';
import OurInstructorsImg from '../assetes/about-page.jpg';
import WhyChooseUsImg from '../assetes/about-page5.jpg';
import Header from '../MyComponents/Navbar/Header';
import Footer from '../MyComponents/Footer/Footer';
import './AboutUS.css';

const AboutUS = () => {
  useEffect(() => {
    document.title = 'About Us — Learn Quran Online | Online Quran Academy';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Learn about Learn Quran Online — a one-on-one online Quran academy offering Tajweed, Hifz, and Translation courses for men, women and kids, with the same certified teacher every class.'
      );
    }
  }, []);

  return (
    <>
      <Header />

      <main>
        <section className="about-hero" aria-labelledby="about-hero-heading">
          <div className="about-hero-pattern" aria-hidden="true"></div>
          <div className="about-hero-eyebrow">
            <span className="about-eyebrow-line"></span>
            About us
            <span className="about-eyebrow-line"></span>
          </div>
          <h1 id="about-hero-heading" className="about-hero-title">
            A personal, one-on-one approach to learning the Quran
          </h1>
          <p className="about-hero-subtitle">
            We connect students of every age with certified teachers, online, in classes built
            around real progress, not just attendance.
          </p>
        </section>

        <div className="about-content">
          <section className="about-row" aria-labelledby="vision-heading">
            <div className="about-row-text">
              <span className="about-label">Our vision</span>
              <h2 id="vision-heading" className="about-row-title">
                Quranic education that fits real life
              </h2>
              <p className="about-row-body">
                We believe consistent, one-on-one attention matters more than flashy features.
                Our goal is simple: connect students with a dedicated teacher, on a schedule
                that actually works for their family, wherever they live in the world.
              </p>
            </div>
            <div className="about-row-image">
              <img
                src={OurVisionImg}
                alt="A copy of the Holy Quran resting open on a wooden stand, lit by warm window light"
                loading="lazy"
                width="600"
                height="450"
              />
            </div>
          </section>

          <section className="about-row about-row-reverse" aria-labelledby="courses-heading">
            <div className="about-row-text">
              <span className="about-label">Our courses</span>
              <h2 id="courses-heading" className="about-row-title">
                A path for every stage
              </h2>
              <p className="about-row-body">
                From a child's first letters to advanced memorization, our curriculum is built
                to grow with the student.
              </p>
              <ul className="about-list">
                <li>Quran recitation (Tajweed)</li>
                <li>Quran memorization (Hifz)</li>
                <li>Translation and Tafsir</li>
                <li>Noorani Qaida for beginners</li>
              </ul>
              <Link to="/courses" className="about-inline-link">
                View all courses
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="about-row-image">
              <img
                src={OurCoursesImg}
                alt="An open Quran beside a stack of Islamic books and a small lantern on a wooden table"
                loading="lazy"
                width="600"
                height="450"
              />
            </div>
          </section>

          <section className="about-row" aria-labelledby="instructors-heading">
            <div className="about-row-text">
              <span className="about-label">Our instructors</span>
              <h2 id="instructors-heading" className="about-row-title">
                Teachers who know how to teach, not just recite
              </h2>
              <p className="about-row-body">
                Every instructor is carefully selected for both their command of Tajweed and
                their ability to explain it clearly, especially to children. You'll meet your
                teacher in a free trial class before committing to anything.
              </p>
            </div>
            <div className="about-row-image">
              <img
                src={OurInstructorsImg}
                alt="A young student following along in a Quran reading book with their finger, guided by a teacher"
                loading="lazy"
                width="600"
                height="450"
              />
            </div>
          </section>

          <section className="about-why" aria-labelledby="why-heading">
            <div className="about-why-intro">
              <span className="about-label">Why choose us</span>
              <h2 id="why-heading" className="about-row-title">
                What makes our classes different
              </h2>
            </div>

            <div className="about-why-grid">
              <div className="about-why-card">
                <span className="about-why-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </span>
                <h3>Flexible scheduling</h3>
                <p>Classes built around your routine, not the other way around — pick the days and times that work.</p>
              </div>

              <div className="about-why-card">
                <span className="about-why-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </span>
                <h3>Same teacher, every class</h3>
                <p>Consistency that lets real progress build week over week, instead of starting over with someone new.</p>
              </div>

              <div className="about-why-card">
                <span className="about-why-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </span>
                <h3>Live, interactive sessions</h3>
                <p>Real two-way classes, not pre-recorded lessons — ask questions and get corrected in the moment.</p>
              </div>

              <div className="about-why-card">
                <span className="about-why-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </span>
                <h3>Learn from anywhere</h3>
                <p>All you need is an internet connection — join your class from the UK, USA, or anywhere in the world.</p>
              </div>
            </div>
          </section>

          <section className="about-final" aria-labelledby="final-image-heading">
            <div className="about-final-image">
              <img
                src={WhyChooseUsImg}
                alt="A student's hand following along the Arabic text while reading from the Quran"
                loading="lazy"
                width="600"
                height="450"
              />
            </div>
            <div className="about-final-text">
              <h2 id="final-image-heading" className="about-row-title">
                Learning that's measured in real ability, not just attendance
              </h2>
              <p className="about-row-body">
                Our teachers track each student's progress class by class, so you always know
                exactly where your child stands and what's coming next.
              </p>
            </div>
          </section>
        </div>

        <section className="about-cta" aria-labelledby="cta-heading">
          <div className="about-cta-pattern" aria-hidden="true"></div>
          <h2 id="cta-heading" className="about-cta-title">
            Start with a free trial class
          </h2>
          <p className="about-cta-subtitle">
            See how our one-on-one classes work, with no commitment required.
          </p>
          <Link to="/courses" className="about-cta-btn">
            Book your free trial
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default AboutUS;
