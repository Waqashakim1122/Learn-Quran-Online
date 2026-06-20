import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../MyComponents/Navbar/Header';
import Footer from '../MyComponents/Footer/Footer';
import supabase from '../lib/supabaseClient';
import './ContactUs.css';

const INTERESTS = ['Quran Nazra', 'Hifz', 'Tajweed', 'Not sure yet'];

const ContactUs = () => {
  useEffect(() => {
    document.title = 'Contact Us — Learn Quran Online | Online Quran Academy';

    const setMeta = (selector, attr, content) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement('meta');
        const match = selector.match(/\[(.+?)="(.+?)"\]/);
        if (match) tag.setAttribute(match[1], match[2]);
        document.head.appendChild(tag);
      }
      tag.setAttribute(attr, content);
    };

    setMeta(
      'meta[name="description"]',
      'content',
      'Contact Learn Quran Online to ask about courses, schedules, or pricing. Our team replies within 24 hours and offers a free trial class with no obligation.'
    );
    setMeta('meta[property="og:title"]', 'content', 'Contact Us — Learn Quran Online');
    setMeta(
      'meta[property="og:description"]',
      'content',
      'Questions before you enroll? Reach our team directly — replies within 24 hours, no pressure.'
    );
    setMeta('meta[property="og:type"]', 'content', 'website');
    setMeta('meta[property="og:url"]', 'content', 'https://learn-quran-online-kappa.vercel.app/ContactUs');
    setMeta('meta[name="twitter:card"]', 'content', 'summary');
    setMeta('meta[name="twitter:title"]', 'content', 'Contact Us — Learn Quran Online');
    setMeta(
      'meta[name="twitter:description"]',
      'content',
      'Reach our team directly to ask about courses, schedules, or pricing.'
    );

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://learn-quran-online-kappa.vercel.app/ContactUs');

    let ld = document.getElementById('contact-page-ld-json');
    if (!ld) {
      ld = document.createElement('script');
      ld.type = 'application/ld+json';
      ld.id = 'contact-page-ld-json';
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact Learn Quran Online',
      url: 'https://learn-quran-online-kappa.vercel.app/ContactUs',
      mainEntity: {
        '@type': 'EducationalOrganization',
        name: 'Learn Quran Online',
        email: 'info@learnquranonline.com',
        telephone: '+44 7123 456789',
        areaServed: ['United Kingdom', 'United States', 'Worldwide'],
      },
    });
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [interest, setInterest] = useState(INTERESTS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setAlert({ show: false, type: '', message: '' });

    try {
      const { error } = await supabase.from('contact_messages').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          interest: interest,
        },
      ]);

      if (error) throw error;

      setAlert({
        show: true,
        type: 'success',
        message: 'Thank you! Your message has been sent. We will get back to you within 24 hours.',
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
      setInterest(INTERESTS[0]);
    } catch (error) {
      setAlert({
        show: true,
        type: 'danger',
        message: 'Failed to send message. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <main>
        <section className="contact-hero" aria-labelledby="contact-hero-heading">
          <div className="contact-hero-pattern" aria-hidden="true"></div>

          <nav className="contact-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
            <span aria-current="page">Contact Us</span>
          </nav>

          <div className="contact-eyebrow">
            <span className="contact-eyebrow-line"></span>
            Speak With Our Academy
            <span className="contact-eyebrow-line"></span>
          </div>
          <h1 id="contact-hero-heading" className="contact-hero-title">
            Questions Before You Enroll?
          </h1>
          <p className="contact-hero-subtitle">
            Our team will help you choose the right course and schedule — no obligation, no
            pressure.
          </p>

          <div className="contact-cred-strip">
            <div className="contact-cred-item">
              <span className="contact-cred-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </span>
              <span>Replies within<br />24 hours</span>
            </div>
            <div className="contact-cred-item">
              <span className="contact-cred-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </span>
              <span>Answered by<br />real teachers</span>
            </div>
            <div className="contact-cred-item">
              <span className="contact-cred-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </span>
              <span>No-pressure<br />conversation</span>
            </div>
          </div>
        </section>

        <section className="contact-body-wrap" aria-label="Contact form and information">
          <div className="contact-body-area">
            <div className="contact-left">
              <span className="contact-left-label">Before you write</span>
              <h2 className="contact-left-title">Answers to common questions</h2>

              <div className="contact-qa-list">
                <div className="contact-qa-item">
                  <div className="contact-qa-q">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9 12l2 2 4-4" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    How does the free trial work?
                  </div>
                  <p className="contact-qa-a">
                    One live class with a certified teacher — no payment details required, no
                    obligation to continue.
                  </p>
                </div>
                <div className="contact-qa-item">
                  <div className="contact-qa-q">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9 12l2 2 4-4" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    Can I keep the same teacher?
                  </div>
                  <p className="contact-qa-a">
                    Yes. Once matched, you keep the same teacher for every class going forward.
                  </p>
                </div>
                <div className="contact-qa-item">
                  <div className="contact-qa-q">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9 12l2 2 4-4" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    What ages do you teach?
                  </div>
                  <p className="contact-qa-a">
                    Young children through adults — every class is matched to age and current
                    level.
                  </p>
                </div>
              </div>

              <div className="contact-direct-box">
                <a href="tel:+447123456789" className="contact-direct-row">
                  <span className="contact-direct-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.8 2.1z" />
                    </svg>
                  </span>
                  <span className="contact-direct-text">
                    <strong>Phone</strong>
                    <span>+44 7123 456789</span>
                  </span>
                </a>
                <a href="mailto:info@learnquranonline.com" className="contact-direct-row">
                  <span className="contact-direct-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 6l-10 7L2 6" />
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                    </svg>
                  </span>
                  <span className="contact-direct-text">
                    <strong>Email</strong>
                    <span>info@learnquranonline.com</span>
                  </span>
                </a>
                <div className="contact-direct-row contact-direct-row-static">
                  <span className="contact-direct-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </span>
                  <span className="contact-direct-text">
                    <strong>Hours</strong>
                    <span>Mon–Sat, 9 AM–9 PM (PKT)</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="contact-right">
              <span className="contact-right-label">Send a message</span>
              <h2 className="contact-right-title">Tell Us What You Need</h2>
              <p className="contact-right-sub">A member of our team will respond directly to your enquiry.</p>

              {alert.show && (
                <div
                  className={`contact-alert contact-alert-${alert.type}`}
                  role="alert"
                  aria-live="polite"
                >
                  {alert.message}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="contact-interest-row">
                  <label id="interest-label">I'm interested in</label>
                  <div className="contact-interest-pills" role="radiogroup" aria-labelledby="interest-label">
                    {INTERESTS.map((item) => (
                      <button
                        type="button"
                        key={item}
                        role="radio"
                        aria-checked={interest === item}
                        className={`contact-pill ${interest === item ? 'contact-pill-active' : ''}`}
                        onClick={() => setInterest(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="contact-two-col">
                  <div className="contact-field-group">
                    <label htmlFor="name">Full name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="contact-field-group">
                    <label htmlFor="email">Email address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="contact-field-group">
                  <label htmlFor="phone">Phone number</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="+44 7123 456789"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="contact-field-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    placeholder="Tell us how we can help..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="contact-submit-row">
                  <button type="submit" className="contact-submit-btn" disabled={submitting}>
                    {submitting ? 'Sending...' : 'Send Message'}
                    {!submitting && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                  <span className="contact-submit-note">Typical response time: 24 hours</span>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ContactUs;
