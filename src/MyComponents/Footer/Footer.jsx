import React from "react";
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
            <h2>Learn Quran Online</h2>

            <p>
              Empowering students worldwide with authentic Quranic
              education through experienced teachers, structured
              courses, and flexible online learning.
            </p>

            <a href="/contact" className="footer-btn">
              Book Free Trial
            </a>
          </div>

          {/* Links */}
          <div className="footer-column">
            <h4>Quick Links</h4>

            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/courses">Courses</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          {/* Courses */}
          <div className="footer-column">
            <h4>Courses</h4>

            <ul>
              <li><a href="/">Noorani Qaida</a></li>
              <li><a href="/">Quran Reading</a></li>
              <li><a href="/">Tajweed Course</a></li>
              <li><a href="/">Hifz Program</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-column">
            <h4>Contact</h4>

            <ul>
              <li>Email: info@learnquranonline.com</li>
              <li>WhatsApp: +92 XXX XXXXXXX</li>
              <li>Available Worldwide</li>
              <li>24/7 Support</li>
            </ul>
          </div>

        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p>
            © {year} Learn Quran Online. All Rights Reserved.
          </p>

          <div className="footer-social">
            <a href="/">Facebook</a>
            <a href="/">Instagram</a>
            <a href="/">YouTube</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
