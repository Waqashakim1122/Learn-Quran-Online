
import { NavLink } from 'react-router-dom';
import React, { useState } from 'react';
import './QuranRecitation.css';
import QuranRecitationImage from '../assetes/Quran-Reactation-Course.webp';
import EnrollmentForm from '../MyComponents/EnrollForm/EnrollmentForm ';
import Header from '../MyComponents/Navbar/Header';
import Footer from '../MyComponents/Footer/Footer';

const QuranRecitation = () => {
  

  return (
    <div>
        <Header/>
      <section className="quran-recitation py-1">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center mb-4">
              <h2 className="recitation-heading">Quran Recitation</h2>
            </div>
          </div>
          <div className="row mb-5">
            <div className="col-md-6">
              <img src={QuranRecitationImage} className="img-fluid" alt="Quran Recitation" />
            </div>
            <div className="col-md-6">
              <div className="course-details">
                <h3>About the Course</h3>
                <p className="course-description">
                  Our Quran Recitation course focuses on mastering the art of proper Quranic recitation (Tajweed). It offers structured lessons with expert guidance to help students improve their pronunciation, fluency, and understanding of Tajweed rules.
                </p>
                <p className="course-description">
                  This course includes practical exercises, personalized feedback, and interactive sessions to enhance students' recitation skills. Whether you're a beginner or advanced learner, this course is designed to elevate your Quranic reading abilities.
                </p>
                <h3>What You Will Learn</h3>
                <ul className="learn-list">
                  <li>Correct pronunciation and articulation (Makharij)</li>
                  <li>Rules of Tajweed and their application</li>
                  <li>Fluency in reciting various Quranic verses</li>
                  <li>Memorization of key surahs and their meanings</li>
                  <li>Regular practice routines and assessments</li>
                </ul>
                <p className="course-description">
                  By the end of this course, students will confidently recite Quranic verses with proper Tajweed, improving their spiritual connection and understanding of the Quran.
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

export default QuranRecitation;
