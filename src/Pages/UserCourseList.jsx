import React, { useState, useEffect } from 'react';
import Header from '../MyComponents/Navbar/Header';
import Footer from '../MyComponents/Footer/Footer';
import supabase from '../lib/supabaseClient';
import './UserCourseList.css';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600&q=80';

const LEVEL_STYLES = {
  Beginner: { bg: '#E8F3DC', color: '#27500A' },
  Intermediate: { bg: '#FAEEDA', color: '#854F0B' },
  Advanced: { bg: '#FCEBEB', color: '#791F1F' },
  'All Levels': { bg: '#E6F1FB', color: '#185FA5' },
};

const UserCourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loadState, setLoadState] = useState('loading'); // loading | success | error
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [submitState, setSubmitState] = useState('idle'); // idle | submitting | success | error
  const [formError, setFormError] = useState('');
  const [enrollmentDetails, setEnrollmentDetails] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    phoneNumber: '',
    city: '',
  });

  useEffect(() => {
    document.title = 'Courses — Learn Quran Online | Online Quran Academy';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Browse our online Quran courses: Nazra, Hifz, Tajweed and Translation. One-on-one classes for men, women and kids, taught by certified teachers.'
      );
    }
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: true });
        if (error) throw error;
        setCourses(data || []);
        setLoadState('success');
      } catch (error) {
        setLoadState('error');
      }
    };
    fetchCourses();
  }, []);

  const handleEnrollClick = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
    setSubmitState('idle');
    setFormError('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEnrollmentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnrollmentSubmit = async (e) => {
    e.preventDefault();
    setSubmitState('submitting');
    setFormError('');
    try {
      const { error } = await supabase.from('enrollments').insert([
        {
          student_name: enrollmentDetails.name,
          email: enrollmentDetails.email,
          phone: enrollmentDetails.phoneNumber,
          course_id: selectedCourse.id,
          course_name: selectedCourse.title,
        },
      ]);
      if (error) throw error;
      setSubmitState('success');
      setEnrollmentDetails({ name: '', email: '', age: '', gender: '', phoneNumber: '', city: '' });
    } catch (error) {
      setSubmitState('error');
      setFormError('We could not submit your enrollment. Please check your connection and try again.');
    }
  };

  return (
    <>
      <Header />

      <section className="courses-page" aria-labelledby="courses-heading">
        <div className="courses-pattern" aria-hidden="true"></div>

        <div className="courses-intro">
          <div className="courses-eyebrow">
            <span className="courses-eyebrow-line"></span>
            Our courses
            <span className="courses-eyebrow-line"></span>
          </div>
          <h1 id="courses-heading" className="courses-title">
            A structured path for every learner
          </h1>
          <p className="courses-subtitle">
            Each course is taught one-on-one by a certified teacher, with the same instructor every session.
          </p>
        </div>

        {loadState === 'loading' && (
          <div className="courses-grid" aria-busy="true" aria-live="polite">
            {[1, 2, 3].map((i) => (
              <div className="course-card course-card-skeleton" key={i} aria-hidden="true">
                <div className="skeleton-image"></div>
                <div className="skeleton-body">
                  <div className="skeleton-line skeleton-line-short"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line skeleton-line-medium"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {loadState === 'error' && (
          <div className="courses-status courses-status-error" role="alert">
            <p>We could not load our courses right now. Please refresh the page or try again shortly.</p>
          </div>
        )}

        {loadState === 'success' && courses.length === 0 && (
          <div className="courses-status">
            <p>New courses are being added soon. Please check back, or contact us to ask about availability.</p>
          </div>
        )}

        {loadState === 'success' && courses.length > 0 && (
          <div className="courses-grid">
            {courses.map((course, index) => {
              const levelStyle = LEVEL_STYLES[course.level] || LEVEL_STYLES['All Levels'];
              return (
                <article className="course-card" key={course.id}>
                  {index === 1 && courses.length > 1 && (
                    <span className="course-ribbon">Most popular</span>
                  )}
                  <div className="course-image-wrap">
                    <img
                      src={course.image_url || FALLBACK_IMAGE}
                      alt={`Students learning in the ${course.title} course`}
                      className="course-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                      }}
                    />
                    <div className="course-image-overlay"></div>
                    {course.level && (
                      <span
                        className="course-level-badge"
                        style={{ background: '#fff', color: levelStyle.color }}
                      >
                        {course.level}
                      </span>
                    )}
                    <h2 className="course-card-title">{course.title}</h2>
                  </div>

                  <div className="course-card-body">
                    <p className="course-description">{course.description}</p>

                    <div className="course-meta">
                      {course.duration && (
                        <span className="course-meta-item">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 7v5l3 3" />
                          </svg>
                          {course.duration}
                        </span>
                      )}
                      <span className="course-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                        </svg>
                        1-on-1
                      </span>
                    </div>

                    <div className="course-footer">
                      {course.price && (
                        <span className="course-price">
                          {course.price.replace(/\/.*$/, '')}
                          <span className="course-price-unit">/mo</span>
                        </span>
                      )}
                      <button
                        type="button"
                        className="course-enroll-btn"
                        onClick={() => handleEnrollClick(course)}
                      >
                        Enroll
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {showModal && (
        <div
          className="enroll-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="enroll-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="enroll-modal">
            <button
              type="button"
              className="enroll-modal-close"
              onClick={closeModal}
              aria-label="Close enrollment form"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>

            {submitState === 'success' ? (
              <div className="enroll-success">
                <div className="enroll-success-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <h2>Enrollment submitted</h2>
                <p>Thank you. We will contact you soon to confirm your schedule for {selectedCourse?.title}.</p>
                <button type="button" className="enroll-success-btn" onClick={closeModal}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2 id="enroll-modal-title" className="enroll-modal-title">
                  Enroll in {selectedCourse?.title}
                </h2>
                <p className="enroll-modal-subtitle">
                  Fill in your details and we will reach out to confirm your first class.
                </p>

                <form onSubmit={handleEnrollmentSubmit} className="enroll-form" noValidate>
                  <div className="enroll-field">
                    <label htmlFor="enroll-name">Full name</label>
                    <input
                      id="enroll-name"
                      type="text"
                      name="name"
                      value={enrollmentDetails.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="enroll-field">
                    <label htmlFor="enroll-email">Email address</label>
                    <input
                      id="enroll-email"
                      type="email"
                      name="email"
                      value={enrollmentDetails.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="enroll-field-row">
                    <div className="enroll-field">
                      <label htmlFor="enroll-age">Age</label>
                      <input
                        id="enroll-age"
                        type="number"
                        name="age"
                        min="3"
                        max="100"
                        value={enrollmentDetails.age}
                        onChange={handleInputChange}
                        placeholder="Age"
                        required
                      />
                    </div>
                    <div className="enroll-field">
                      <label htmlFor="enroll-gender">Gender</label>
                      <select
                        id="enroll-gender"
                        name="gender"
                        value={enrollmentDetails.gender}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="enroll-field">
                    <label htmlFor="enroll-phone">Phone number</label>
                    <input
                      id="enroll-phone"
                      type="tel"
                      name="phoneNumber"
                      value={enrollmentDetails.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  <div className="enroll-field">
                    <label htmlFor="enroll-city">City</label>
                    <input
                      id="enroll-city"
                      type="text"
                      name="city"
                      value={enrollmentDetails.city}
                      onChange={handleInputChange}
                      placeholder="Enter your city"
                      required
                    />
                  </div>

                  {formError && (
                    <p className="enroll-form-error" role="alert">{formError}</p>
                  )}

                  <button type="submit" className="enroll-submit-btn" disabled={submitState === 'submitting'}>
                    {submitState === 'submitting' ? 'Submitting...' : 'Submit enrollment'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default UserCourseList;
