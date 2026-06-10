import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <div className='Footer container-fluid bg-dark text-light py-o '>
      <div className='row'>
        <div className='col-md-6'>
          <p>© 2024 Learning Quran Online. All rights reserved.</p>
        </div>
        <div className='col-md-6'>
          <ul className='list-inline text-md-end'>
            <li className='list-inline-item'><a href='#'>Terms of Service</a></li>
            <li className='list-inline-item'><a href='#'>Privacy Policy</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Footer;

