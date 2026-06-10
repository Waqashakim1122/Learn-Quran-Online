import React from 'react';
import './QuranTranslation.css';
import QuranTranslationImage from '../assetes/Quran-Tranlation-Course.jpg';
import { NavLink } from 'react-router-dom';
import Header from '../MyComponents/Navbar/Header';
import Footer from '../MyComponents/Footer/Footer';


const QuranTranslation = () => {
    return (
      <div>
        <Header/>
       
      <section className="quran-translation py-1">
          <div className="container">
              <div className="row">
                  <div className="col-md-12 text-center mb-4">
                      <h2 className="translation-heading">Quran Translation</h2>
                  </div>
              </div>
              <div className="row mb-5">
                  <div className="col-md-6">
                      <img src={QuranTranslationImage} className="img-fluid" alt="Quran Translation" />
                  </div>
                  <div className="col-md-6">
                      <div className="course-details">
                          <h3>About the Course</h3>
                          <p className="course-description">
                              Our Quran Translation course is designed to help students understand the meanings and interpretations of Quranic verses. It offers a structured curriculum with personalized guidance, ensuring students develop a deep comprehension of the Quran's teachings.
                          </p>
                          <p className="course-description">
                              This course includes comprehensive lessons on translation techniques, context of revelation, and practical applications of the Quranic message. Students benefit from regular assessments, interactive sessions, and community support to enhance their learning journey.
                          </p>
                          <h3>What You Will Learn</h3>
                          <ul className="learn-list">
                              <li>Accurate translation of Quranic verses</li>
                              <li>Context and background of revelations</li>
                              <li>Application of Quranic teachings in daily life</li>
                              <li>Personalized feedback and progress tracking</li>
                              <li>Engaging discussions and group activities</li>
                          </ul>
                          <p className="course-description">
                              By the end of this course, students will have a profound understanding of the Quran's message and its relevance to contemporary issues.
                          </p>
                          <NavLink to="/enroll" className="btn btn-primary enroll-button">Enroll Now</NavLink>

                      </div>
                  </div>
              </div>
          </div>
      </section>
      <Footer/>
  </div>
    );
};

export default QuranTranslation;
