import React from 'react';
import './Contact.css';
import Msgicon from '../../assetes/images.jpg';
import Mailicon from '../../assetes/mail icon.png';
import Phoneicon from '../../assetes/telephone icon.png';
import Adressicon from '../../assetes/location icon.png';

const Contact = () => {
    return (
        
        
            <div className='contact container'> 
            <div className='row'>
                <div className='contact-col col-md-6'>
                    <h3>Send Us A Message <img src={Msgicon} alt="Message Icon" /></h3>
                    <p>We are here to help you with any questions or support you need. Reach out to us through any of the following methods, and we'll be happy to assist you.</p>
                    <ul>
                        <li><img src={Mailicon} alt="Mail Icon" /> waqashakim443@gmail.com</li>
                        <li><img src={Phoneicon} alt="Phone Icon" /> +923021119181</li>
                        <li><img src={Adressicon} alt="Address Icon" /> Shujabad, District Multan Pakistan</li>
                    </ul>
                </div>
                
                <div className='contact-col col-md-6'>
                    <form>
                        <label>Your Name</label>
                        <input type="text" name='name' placeholder='Enter Your Name' required />
                        <label>Your Mobile Number</label>
                        <input type="tel" name='phone' placeholder='Enter Your Mobile Number' required />
                        <label>Your Email</label>
                        <input type="email" name='email' placeholder='Enter Your Email' required />
                        <label>Write Your Message Here</label>
                        <textarea name="message" rows="6" placeholder='Enter Your Message' required></textarea>
                        <button type='submit' className='btn btn-primary'>Submit Now</button>
                    </form>
                    <span></span>
                </div>
           
            </div>
        </div>
    );
};

export default Contact;
