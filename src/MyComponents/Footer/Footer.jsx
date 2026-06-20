import React from "react";
import logo from "../../assetes/navbar-logo.png";
import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-top-line"></div>
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo-patch">
              <img src={logo} alt="Learn Quran Online" />
            </div>
            <p>
              Empowering students worldwide with authentic Quranic
              education through experienced teachers, structured
              courses, and flexible online learning.
            </p>
            <a href="/courses" className="footer-btn">
              Book Free Trial
            </a>
          </div>

          {/* Links */}
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/About">About Us</a></li>
              <li><a href="/courses">Courses</a></li>
              <li><a href="/ContactUs">Contact</a></li>
            </ul>
          </div>

          {/* Courses */}
          <div className="footer-column">
            <h4>Courses</h4>
            <ul>
              <li><a href="/courses">Noorani Qaida</a></li>
              <li><a href="/courses">Quran Reading</a></li>
              <li><a href="/courses">Tajweed Course</a></li>
              <li><a href="/courses">Hifz Program</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-column">
            <h4>Contact</h4>
            <ul>
              <li>info@learnquranonline.com</li>
              <li>+44 7123 456789</li>
              <li>Available Worldwide</li>
            </ul>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p>© {year} Learn Quran Online. All Rights Reserved.</p>
          <div className="footer-social">
            <a href="/" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="/" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c2.7 0 3 0 4.1.1 1.1 0 1.8.2 2.2.4.5.2.9.5 1.3.9.4.4.6.7.9 1.3.2.4.4 1.1.4 2.2.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c0 1.1-.2 1.8-.4 2.2-.2.5-.5.9-.9 1.3-.4.4-.7.6-1.3.9-.4.2-1.1.4-2.2.4-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-1.1 0-1.8-.2-2.2-.4-.5-.2-.9-.5-1.3-.9-.4-.4-.6-.7-.9-1.3-.2-.4-.4-1.1-.4-2.2C2 15 2 14.7 2 12s0-3 .1-4.1c0-1.1.2-1.8.4-2.2.2-.5.5-.9.9-1.3.4-.4.7-.6 1.3-.9.4-.2 1.1-.4 2.2-.4C8 2 8.3 2 11 2zm0 1.8c-2.6 0-2.9 0-4 .1-1 0-1.5.2-1.8.3-.5.2-.8.4-1.1.7-.3.3-.5.6-.7 1.1-.1.3-.3.8-.3 1.8-.1 1-.1 1.3-.1 4s0 2.9.1 4c0 1 .2 1.5.3 1.8.2.5.4.8.7 1.1.3.3.6.5 1.1.7.3.1.8.3 1.8.3 1 .1 1.3.1 4 .1s2.9 0 4-.1c1 0 1.5-.2 1.8-.3.5-.2.8-.4 1.1-.7.3-.3.5-.6.7-1.1.1-.3.3-.8.3-1.8.1-1 .1-1.3.1-4s0-2.9-.1-4c0-1-.2-1.5-.3-1.8-.2-.5-.4-.8-.7-1.1-.3-.3-.6-.5-1.1-.7-.3-.1-.8-.3-1.8-.3-1-.1-1.3-.1-4-.1zm0 4.5a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4zm0 1.8a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8zm5.9-2a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0z"/></svg>
            </a>
            <a href="/" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.2s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C15.7 4 12 4 12 4h0s-3.7 0-6.7.2c-.4 0-1.3.1-2.1.9-.6.6-.8 2.1-.8 2.1S2.2 9 2.2 10.8v1.4C2.2 14 2.4 15.8 2.4 15.8s.2 1.5.8 2.1c.8.8 1.8.8 2.3.9 1.7.2 7.1.2 7.1.2s3.7 0 6.7-.2c.4 0 1.3-.1 2.1-.9.6-.6.8-2.1.8-2.1s.2-1.8.2-3.6v-1.4c0-1.8-.2-3.6-.2-3.6zM9.9 14.6V8.4l5.4 3.1z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
