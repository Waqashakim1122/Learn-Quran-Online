import React from 'react';
import { NavLink } from 'react-router-dom';
import QuranMemorizationImage from '../assetes/jmb21015060l-1.jpg'; 
import './QuranMemorization.css'; 
import Header from '../MyComponents/Navbar/Header';
import Footer from '../MyComponents/Footer/Footer';


const QuranMemorization = () => {
    return (
        <>
        <Header/>
        <section className="quran-memorization py-1">
        <div className="container">
            <div className="row">
                <div className="col-md-12 text-center mb-4">
                    <h2 className="memorization-heading">Quran Memorization</h2>
                </div>
            </div>
            <div className="row mb-5">
                <div className="col-md-6">
                    <img src={QuranMemorizationImage} className="img-fluid" alt="Quran Memorization" />
                </div>
                <div className="col-md-6">
                    <div className="course-details">
                        <h3>About the Course</h3>
                        <p className="course-description">
                            Our Quran Memorization course is designed to help students of all ages and levels memorize the Quran efficiently and accurately. It offers a structured curriculum with personalized guidance, ensuring students develop strong memorization skills and deepen their spiritual connection with the Quran.
                        </p>
                        <p className="course-description">
                            This course includes comprehensive lessons on memorization techniques, correct pronunciation (Tajweed), and understanding Quranic verses. Students benefit from regular assessments, interactive sessions, and community support to facilitate their Quranic learning journey.
                        </p>
                        <h3>What You Will Learn</h3>
                        <ul className="learn-list">
                            <li>Effective Quran memorization strategies</li>
                            <li>Rules of Tajweed for proper Quran recitation</li>
                            <li>Meanings and interpretations of Quranic verses</li>
                            <li>Personalized feedback and progress tracking</li>
                            <li>Engaging activities and group discussions</li>
                        </ul>
                        <p className="course-description">
                            By the end of this course, students will not only have memorized significant portions of the Quran but will also have a deeper understanding of its teachings and applications in their daily lives.
                        </p>
                        <NavLink to="/enroll" className="btn btn-primary enroll-button">Enroll Now</NavLink>

                    </div>
                </div>
            </div>
        </div>
    </section>
    <Footer/>
    </>
    );
}

export default QuranMemorization;
