import React, { useState } from 'react';
import Header from '../MyComponents/Navbar/Header';
import Footer from '../MyComponents/Footer/Footer';
import supabase from '../lib/supabaseClient';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setAlert({ show: false, type: '', message: '' });

        try {
            const { error } = await supabase
                .from('contact_messages')
                .insert([{
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message
                }]);

            if (error) throw error;

            setAlert({
                show: true,
                type: 'success',
                message: 'Thank you! Your message has been sent. We will get back to you soon.'
            });
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            setAlert({
                show: true,
                type: 'danger',
                message: 'Failed to send message. Please try again.'
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Header />
            <section className="contact-us bg-light py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h1 className="text-center mb-5 text-primary">Contact Us</h1>
                        </div>
                    </div>

                    {alert.show && (
                        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                            {alert.message}
                            <button type="button" className="btn-close" onClick={() => setAlert({ show: false })}></button>
                        </div>
                    )}

                    <div className="row">
                        {/* Left Column - Get in Touch */}
                        <div className="col-md-4 mb-4">
                            <div className="card shadow border-primary h-100">
                                <div className="card-body">
                                    <h3 className="text-center mb-4 text-primary">Get in Touch</h3>
                                    <p className="text-secondary mb-4">
                                        For any inquiries or support, feel free to contact us:
                                    </p>
                                    <p className="mb-2">
                                        <strong>📞 Phone:</strong><br />
                                        +44 7123 456789
                                    </p>
                                    <p className="mb-2">
                                        <strong>📧 Email:</strong><br />
                                        info@learnquranonline.com
                                    </p>
                                    <p className="mb-2">
                                        <strong>📍 Address:</strong><br />
                                        Multan, Punjab, Pakistan
                                    </p>
                                    <p className="mb-2">
                                        <strong>🕐 Hours:</strong><br />
                                        Monday - Saturday<br />
                                        9:00 AM - 9:00 PM (PKT)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Contact Form */}
                        <div className="col-md-8">
                            <div className="card shadow border-primary">
                                <div className="card-body">
                                    <h3 className="text-center mb-4 text-primary">Send Us a Message</h3>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group mb-3">
                                            <label htmlFor="name" className="text-secondary fw-bold">Full Name</label>
                                            <input
                                                type="text"
                                                className="form-control mt-1"
                                                id="name"
                                                name="name"
                                                placeholder="Enter your full name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="email" className="text-secondary fw-bold">Email Address</label>
                                            <input
                                                type="email"
                                                className="form-control mt-1"
                                                id="email"
                                                name="email"
                                                placeholder="Enter your email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="phone" className="text-secondary fw-bold">Phone Number (Optional)</label>
                                            <input
                                                type="text"
                                                className="form-control mt-1"
                                                id="phone"
                                                name="phone"
                                                placeholder="Enter your phone number"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="message" className="text-secondary fw-bold">Message</label>
                                            <textarea
                                                className="form-control mt-1"
                                                id="message"
                                                name="message"
                                                rows="5"
                                                placeholder="Enter your message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100"
                                            disabled={submitting}
                                        >
                                            {submitting ? 'Sending...' : 'Send Message'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default ContactUs;
