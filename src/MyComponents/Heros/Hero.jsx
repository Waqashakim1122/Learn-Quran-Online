import React from 'react'
import { NavLink } from 'react-router-dom';
import './Hero.css'

const Hero = () => {
  return (
    <div className='Hero Container text-center'>
      <div className='Hero-Text'>
        <p className='Hero-eyebrow'>Trusted by families across the UK & USA</p>
        <h1 className='Bislella'>بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</h1>
        <h4>Most Sought-After Online Quran Academy in UK & USA</h4>
        <h1 className='Hero-Title'>Online Quran Classes</h1>
        <p className='Hero-Subtext'>
          Quran Nazra, Hifz, & Qaida Classes with Tajweed for Men, Women & Kids.
        </p>
        <div className='Hero-CTAs'>
          <NavLink className='btn site-cta-btn' to='/courses' role='button'>
            Book Free Trial
          </NavLink>
          <NavLink className='btn Hero-secondary-btn' to='/About' role='button'>
            Learn More
          </NavLink>
        </div>
      </div>
    </div>
  )
}
export default Hero
