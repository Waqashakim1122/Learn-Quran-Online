import React from 'react';
import './NooraniQaida.css';
import NooraniQaidaImage from '../assetes/Noorani-Qaida.jpg';
import { NavLink } from 'react-router-dom';
import Header from '../MyComponents/Navbar/Header';
import Footer from '../MyComponents/Footer/Footer';


const NooraniQaida = () => {
    return (
        <div>
            <Header/>
            <section className="noorani-qaida ">
                <div className="container p-0">
                    <div className="row">
                        <div className="col-md-12 text-center mb-4">
                            <h2 className="qaida-heading">Noorani Qaida</h2>
                        </div>
                    </div>
                    <div className="row mb-5">
                        <div className="col-md-6">
                            <img src={NooraniQaidaImage} className="img-fluid" alt="Noorani Qaida" />
                        </div>
                        <div className="col-md-6">
                            <div className="course-details">
                                <h3>About the Course</h3>
                                <p className="course-description">
                                    Our Noorani Qaida course is designed to help students learn the basics of Quranic recitation. It offers a structured curriculum with personalized guidance, ensuring students develop strong foundational skills and pronunciation.
                                </p>
                                <p className="course-description">
                                    This course includes comprehensive lessons on Arabic alphabets, correct pronunciation (Tajweed), and understanding basic Quranic verses. Students benefit from regular assessments, interactive sessions, and community support to facilitate their learning journey.
                                </p>
                                <h3>What You Will Learn</h3>
                                <ul className="learn-list">
                                    <li>Arabic alphabets and their pronunciation</li>
                                    <li>Basic rules of Tajweed for proper recitation</li>
                                    <li>Foundational skills for Quranic recitation</li>
                                    <li>Personalized feedback and progress tracking</li>
                                    <li>Engaging activities and group discussions</li>
                                </ul>
                                <p className="course-description">
                                    By the end of this course, students will have a solid foundation in Quranic recitation and will be prepared to advance to more complex studies.
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

export default NooraniQaida;
