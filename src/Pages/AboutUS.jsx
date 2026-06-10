import React from 'react';
import OurVision from '../assetes/about-page4.jpg'
import OurCourses from '../assetes/about-page2.jpg'
import OurInstructors from '../assetes/about-page.jpg'
import WhyChooseUs from '../assetes/about-page3.jpg'
import JoinUsToday from '../assetes/about-page5.jpg'
import Header from '../MyComponents/Navbar/Header';
import Footer from '../MyComponents/Footer/Footer';

const AboutUS = () => {
    return (
        <>
        <Header/>
            <section className='About py-5'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 text-center mb-5'>
                            <h1 className="display-4 mb-4">About Us</h1>
                            <p className="lead">
                                Welcome to [online learning Quran], your trusted destination for online Quran learning. Our mission is to make the teachings of the Quran accessible to everyone, regardless of their location or schedule.
                            </p>
                        </div>
                    </div>
                    <div className='row align-items-center mb-5'>
                        <div className='col-md-6'>
                            <div className='About-item'>
                                <i className='fa fa-book'></i>
                                <h3 className="mb-3">Our Vision</h3>
                                <p className="text-muted mb-4">We believe in the transformative power of the Quran. Our vision is to create a global community of learners who are passionate about understanding and living by the principles of the Quran. By leveraging the power of technology, we aim to bridge the gap between traditional Quranic education and modern-day convenience.</p>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <img src={OurVision} alt="Our Vision" className="img-fluid rounded" />
                        </div>
                    </div>
                    <div className='row align-items-center mb-5'>
                        <div className='col-md-6 order-md-2'>
                            <div className='About-item'>
                                <i className='fa fa-globe'></i>
                                <h3 className="mb-3">Our Courses</h3>
                                <p className="text-muted mb-4">At [Your Website Name], we offer a comprehensive range of courses designed to cater to learners of all ages and levels. Whether you are a beginner taking your first steps in Quranic learning or an advanced student seeking to deepen your understanding, we have the right course for you. Our curriculum includes:</p>
                                <ul className="list-unstyled">
                                    <li>Quran Recitation (Tajweed)</li>
                                    <li>Quran Memorization (Hifz)</li>
                                    <li>Quran Translation and Tafsir</li>
                                    <li>Islamic Studies</li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-md-6 order-md-1'>
                            <img src={OurCourses} alt="Our Courses" className="img-fluid rounded" />
                        </div>
                    </div>
                    <div className='row align-items-center mb-5'>
                        <div className='col-md-6'>
                            <div className='About-item'>
                                <i className='fa fa-pencil'></i>
                                <h3 className="mb-3">Our Instructors</h3>
                                <p className="text-muted mb-4">Our team of experienced and certified instructors is dedicated to providing high-quality education. They bring a wealth of knowledge and a deep understanding of the Quran, ensuring that you receive the best guidance and support in your learning journey. Each instructor is carefully selected for their expertise, teaching skills, and commitment to fostering a positive and inclusive learning environment.</p>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <img src={OurInstructors} alt="Our Instructors" className="img-fluid rounded" />
                        </div>
                    </div>
                    <div className='row align-items-center mb-5'>
                        <div className='col-md-6 order-md-2'>
                            <div className='About-item'>
                                <i className='fa fa-pencil'></i>
                                <h3 className="mb-3">Why Choose Us?</h3>
                                <ul className="list-unstyled mb-4">
                                    <li><b>Flexible Learning:</b> Learn at your own pace, from the comfort of your home. Our online platform is available 24/7, allowing you to schedule classes at times that suit you best.</li>
                                    <li><b>Interactive Sessions:</b> Engage in live, interactive sessions with your instructors. Ask questions, seek clarification, and participate in discussions to enhance your understanding.</li>
                                    <li><b>Personalized Attention:</b> Benefit from one-on-one or small group classes tailored to your specific needs and goals.</li>
                                    <li><b>Affordable:</b> We offer competitive pricing and a variety of packages to fit your budget, ensuring that quality Quranic education is accessible to all.</li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-md-6 order-md-1'>
                            <img src={WhyChooseUs} alt="Why Choose Us" className="img-fluid rounded" />
                        </div>
                    </div>
                    <div className='row align-items-center mb-5'>
                        <div className='col-md-6'>
                            <div className='About-item'>
                                <i className='fa fa-pencil'></i>
                                <h3 className="mb-3">Join Us Today!</h3>
                                <p className="text-muted mb-4">Embark on a spiritual journey with [Your Website Name] and experience the joy of learning the Quran. Sign up for a free trial class and discover how our innovative approach can help you achieve your learning objectives.</p>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <img src={JoinUsToday} alt="Join Us Today" className="img-fluid rounded" />
                        </div>
                    </div>
                </div>
                <div className='About-1 text-center py-5 bg-light'>
                    <h1 className="display-4 mb-4 text-primary">Thank You!</h1>
                    <p className="lead">
                        Thank you for choosing [Your Website Name]. Together, let's deepen our connection with the Quran and enrich our lives with its timeless wisdom.
                    </p>
                </div>
            </section>
            <Footer/>
            </>
    );
}

export default AboutUS;
