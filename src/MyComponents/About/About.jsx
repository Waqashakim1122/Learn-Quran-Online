import React from 'react'
import './About.css'
import Aboutimg from '../../assetes/about-img.jpg'
import Aboutplybuton from '../../assetes/Play-Button.gif'

const About = ({setPlaystate}) => {
    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 mb-4'>
                    <div className='about-left position-relative'>
                        <img src={Aboutimg} alt="About Us" className='img-fluid about-img' />
                       <button type='btn' onClick={()=>{setPlaystate(true)}}> <img src={Aboutplybuton} alt="Play Button" className='play-icon'  /></button>
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='about-right'>
                        <h2>About Us</h2>
                        <p>Welcome to Learn Quran Online, your go-to platform for accessible and comprehensive Quranic education. Our mission is to make learning the Quran easy and enjoyable for everyone, no matter where you are or your level of experience.</p>
                        <h2>Our Vision</h2>
                        <p>We aim to connect people worldwide with the teachings of the Quran, creating a community of learners who grow in their understanding and spirituality.</p>
                        <h2>Why Choose Us?</h2>
                        <ul>
                            <li>Qualified Instructors: Learn from experienced scholars.</li>
                            <li>Interactive Learning: Use quizzes, forums, and live tutoring to enhance your experience.</li>
                            <li>Personalized Paths: Study at your own pace with customized learning plans.</li>
                            <li>Global Access: Study from anywhere in the world.</li>
                            <li>Progress Tracking: Monitor your learning and set goals.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
