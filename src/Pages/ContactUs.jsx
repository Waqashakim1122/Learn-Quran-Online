import React from 'react';
import Header from '../MyComponents/Navbar/Header';
import Footer from '../MyComponents/Footer/Footer';

const ContactUs = () => {
    return (
        <>
        <Header/>
        <section className="contact-us  bg-light">
            <div className="container">
                <div className="row">
                    {/* Main Heading */}
                    <div className="col-12">
                        <h1 className="text-center mb-5 text-primary">Contact Us</h1>
                    </div>
                </div>
                <div className="row">
                    {/* Left Column - Get in Touch Section */}
                    <div className="col-md-4 mb-4">
                        <div className="card shadow border-primary">
                            <div className="card-body">
                                <h3 className="text-center mb-4 text-primary">Get in Touch</h3>
                                <p className="text-secondary mb-4">
                                    For any inquiries or support:
                                </p>
                                <p className="mb-1">
                                    <strong>Phone:</strong> +123456789<br />
                                    <strong>Email:</strong> info@example.com<br />
                                    <strong>Address:</strong> 123 Main Street, Cityville, Country
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Right Column - Contact Form */}
                    <div className="col-md-8">
                        <div className="card shadow border-primary">
                            <div className="card-body">
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="name" className="text-secondary">Name</label>
                                        <input type="text" className="form-control" id="name" placeholder="Enter your name" required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email" className="text-secondary">Email address</label>
                                        <input type="email" className="form-control" id="email" placeholder="Enter your email" required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="message" className="text-secondary">Message</label>
                                        <textarea className="form-control" id="message" rows="5" placeholder="Enter your message" required></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <Footer/>
        </>
    );
}

export default ContactUs;
