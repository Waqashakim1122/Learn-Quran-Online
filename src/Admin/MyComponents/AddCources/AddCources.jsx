import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../Sidebar/Sidebar';
import AdminNavbar from '../AdminNavebar/Adminnavbar';
import supabase from '../../../lib/supabaseClient';
import './AddCourse.css';

/* ============================================================
   Constants
============================================================ */

const LIMITS = {
    title: 80,
    description: 500,
};

const LEVEL_OPTIONS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

const EMPTY_FORM = {
    title: '',
    description: '',
    imageURL: '',
    duration: '',
    level: '',
    price: '',
};

const URL_PATTERN = /^https?:\/\/.+\.[a-z]{2,}(\/.*)?$/i;

const IMAGE_PREVIEW_DEBOUNCE_MS = 400;
const MESSAGE_AUTO_DISMISS_MS = 6000;

/* ============================================================
   Field-level validation — pure function, reused for
   onChange / onBlur / onSubmit checks.
============================================================ */

const validateField = (name, value) => {
    switch (name) {
        case 'title':
            if (!value.trim()) return 'Course title is required.';
            if (value.length > LIMITS.title) return `Title must be ${LIMITS.title} characters or fewer.`;
            return '';
        case 'description':
            if (!value.trim()) return 'Course description is required.';
            if (value.trim().length < 20) return 'Description should be at least 20 characters.';
            if (value.length > LIMITS.description) return `Description must be ${LIMITS.description} characters or fewer.`;
            return '';
        case 'imageURL':
            if (!value.trim()) return 'Course image URL is required.';
            if (!URL_PATTERN.test(value.trim())) return 'Enter a valid image URL (starting with http:// or https://).';
            return '';
        case 'duration':
            if (!value.trim()) return 'Duration is required.';
            return '';
        case 'level':
            if (!value) return 'Select a level.';
            return '';
        case 'price':
            if (!value.trim()) return 'Price is required.';
            return '';
        default:
            return '';
    }
};

const validateAll = (form) => {
    const nextErrors = {};
    Object.keys(form).forEach((key) => {
        const err = validateField(key, form[key]);
        if (err) nextErrors[key] = err;
    });
    return nextErrors;
};

/* ================= ICONS (same set as Enrollments) ================= */

const IconArrowLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
);

const IconPlus = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const IconSpinner = () => (
    <svg className="ac-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M21 12a9 9 0 11-9-9" strokeLinecap="round" />
    </svg>
);

const IconAlertCircle = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const IconCheckCircle = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="16 9 11 14 8 11" />
    </svg>
);

const IconClose = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const AddCourse = () => {
    const navigate = useNavigate();

    const [showSidebar, setShowSidebar] = useState(false);
    const toggleSidebar = () => setShowSidebar((prev) => !prev);

    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success' | 'danger', text }
    const [imageStatus, setImageStatus] = useState('idle'); // idle | loading | ok | error

    const dismissTimer = useRef(null);
    const firstFieldRef = useRef(null);

    // Guards the image preview against out-of-order network responses:
    // only the *latest* requested URL is allowed to update imageStatus.
    const imageRequestId = useRef(0);

    useEffect(() => {
        firstFieldRef.current?.focus();
        return () => clearTimeout(dismissTimer.current);
    }, []);

    // Debounced image preview check
    useEffect(() => {
        const trimmed = form.imageURL.trim();

        if (!trimmed) {
            setImageStatus('idle');
            return;
        }

        if (!URL_PATTERN.test(trimmed)) {
            setImageStatus('error');
            return;
        }

        setImageStatus('loading');

        const requestId = ++imageRequestId.current;

        const timeout = setTimeout(() => {
            const img = new Image();

            img.onload = () => {
                if (imageRequestId.current === requestId) setImageStatus('ok');
            };
            img.onerror = () => {
                if (imageRequestId.current === requestId) setImageStatus('error');
            };

            img.src = trimmed;
        }, IMAGE_PREVIEW_DEBOUNCE_MS);

        return () => clearTimeout(timeout);
    }, [form.imageURL]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (touched[name]) {
            setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    };

    const showMessage = (type, text) => {
        clearTimeout(dismissTimer.current);
        setMessage({ type, text });
        dismissTimer.current = setTimeout(() => setMessage(null), MESSAGE_AUTO_DISMISS_MS);
    };

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setErrors({});
        setTouched({});
        setImageStatus('idle');
        firstFieldRef.current?.focus();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const nextErrors = validateAll(form);
        setErrors(nextErrors);
        setTouched({ title: true, description: true, imageURL: true, duration: true, level: true, price: true });

        if (Object.keys(nextErrors).length > 0) {
            showMessage('danger', 'Please fix the highlighted fields before submitting.');
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('courses')
                .insert([{
                    title: form.title.trim(),
                    description: form.description.trim(),
                    image_url: form.imageURL.trim(),
                    duration: form.duration.trim(),
                    level: form.level,
                    price: form.price.trim(),
                }]);

            if (error) throw error;

            showMessage('success', `"${form.title.trim()}" was added successfully.`);
            resetForm();
        } catch (error) {
            showMessage('danger', error?.message || 'Failed to add course. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fieldClass = (name) => {
        if (!touched[name]) return 'ac-input';
        return errors[name] ? 'ac-input invalid' : 'ac-input valid';
    };

    return (
        <div className="ac-page">

            <AdminNavbar />

            <div className="ac-body">

                <AdminSidebar
                    showSidebar={showSidebar}
                    toggleSidebar={toggleSidebar}
                />

                <main className="ac-main">

                    <button
                        type="button"
                        className="ac-mobile-menu"
                        onClick={toggleSidebar}
                        aria-label="Toggle navigation menu"
                    >
                        ☰ Menu
                    </button>

                    {/* ================= HEADER ================= */}

                    <div className="ac-header">

                        <div>
                            <h1>Add New Course</h1>
                            <p>Create a new course listing for the Learn Quran Online catalog.</p>
                        </div>

                        <button
                            type="button"
                            className="ac-back-btn"
                            onClick={() => navigate('/courselist')}
                        >
                            <IconArrowLeft />
                            Back to Courses
                        </button>

                    </div>

                    {/* ================= ALERT ================= */}

                    {message && (
                        <div className={`ac-alert ${message.type}`} role="alert">
                            {message.type === 'success' ? <IconCheckCircle /> : <IconAlertCircle />}
                            <span>{message.text}</span>
                            <button
                                type="button"
                                className="ac-alert-close"
                                onClick={() => setMessage(null)}
                                aria-label="Dismiss message"
                            >
                                <IconClose />
                            </button>
                        </div>
                    )}

                    {/* ================= FORM + PREVIEW ================= */}

                    <div className="ac-grid">

                        <div className="ac-form-card">

                            <form onSubmit={handleSubmit} noValidate>

                                <fieldset className="ac-section">

                                    <legend>Course Details</legend>

                                    <div className="ac-field">
                                        <label htmlFor="courseTitle">
                                            Course Title <span className="ac-required">*</span>
                                        </label>
                                        <input
                                            ref={firstFieldRef}
                                            id="courseTitle"
                                            type="text"
                                            name="title"
                                            placeholder="e.g. Quran Nazra"
                                            value={form.title}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            maxLength={LIMITS.title}
                                            className={fieldClass('title')}
                                        />
                                        <div className="ac-field-footer">
                                            {touched.title && errors.title ? (
                                                <span className="ac-field-error">{errors.title}</span>
                                            ) : <span />}
                                            <span className="ac-char-count">{form.title.length}/{LIMITS.title}</span>
                                        </div>
                                    </div>

                                    <div className="ac-field">
                                        <label htmlFor="courseDescription">
                                            Course Description <span className="ac-required">*</span>
                                        </label>
                                        <textarea
                                            id="courseDescription"
                                            rows={4}
                                            name="description"
                                            placeholder="Describe what students will learn in this course"
                                            value={form.description}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            maxLength={LIMITS.description}
                                            className={fieldClass('description')}
                                        />
                                        <div className="ac-field-footer">
                                            {touched.description && errors.description ? (
                                                <span className="ac-field-error">{errors.description}</span>
                                            ) : <span />}
                                            <span className="ac-char-count">{form.description.length}/{LIMITS.description}</span>
                                        </div>
                                    </div>

                                </fieldset>

                                <fieldset className="ac-section">

                                    <legend>Media</legend>

                                    <div className="ac-field">
                                        <label htmlFor="courseImageURL">
                                            Course Image URL <span className="ac-required">*</span>
                                        </label>
                                        <input
                                            id="courseImageURL"
                                            type="text"
                                            name="imageURL"
                                            placeholder="e.g. https://images.unsplash.com/..."
                                            value={form.imageURL}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={fieldClass('imageURL')}
                                        />
                                        {touched.imageURL && errors.imageURL ? (
                                            <span className="ac-field-error">{errors.imageURL}</span>
                                        ) : (
                                            <span className="ac-field-hint">
                                                Paste a direct image link. It updates the preview on the right as you type.
                                            </span>
                                        )}
                                    </div>

                                </fieldset>

                                <fieldset className="ac-section ac-section--last">

                                    <legend>Scheduling &amp; Pricing</legend>

                                    <div className="ac-field-row">

                                        <div className="ac-field">
                                            <label htmlFor="courseDuration">
                                                Duration <span className="ac-required">*</span>
                                            </label>
                                            <input
                                                id="courseDuration"
                                                type="text"
                                                name="duration"
                                                placeholder="e.g. 3 Months"
                                                value={form.duration}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={fieldClass('duration')}
                                            />
                                            {touched.duration && errors.duration && (
                                                <span className="ac-field-error">{errors.duration}</span>
                                            )}
                                        </div>

                                        <div className="ac-field">
                                            <label htmlFor="courseLevel">
                                                Level <span className="ac-required">*</span>
                                            </label>
                                            <select
                                                id="courseLevel"
                                                name="level"
                                                value={form.level}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={fieldClass('level')}
                                            >
                                                <option value="">Select Level</option>
                                                {LEVEL_OPTIONS.map((lvl) => (
                                                    <option key={lvl} value={lvl}>{lvl}</option>
                                                ))}
                                            </select>
                                            {touched.level && errors.level && (
                                                <span className="ac-field-error">{errors.level}</span>
                                            )}
                                        </div>

                                        <div className="ac-field">
                                            <label htmlFor="coursePrice">
                                                Price <span className="ac-required">*</span>
                                            </label>
                                            <input
                                                id="coursePrice"
                                                type="text"
                                                name="price"
                                                placeholder="e.g. $20/month"
                                                value={form.price}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={fieldClass('price')}
                                            />
                                            {touched.price && errors.price && (
                                                <span className="ac-field-error">{errors.price}</span>
                                            )}
                                        </div>

                                    </div>

                                </fieldset>

                                <div className="ac-form-actions">

                                    <button
                                        type="button"
                                        className="ac-clear-link"
                                        onClick={resetForm}
                                        disabled={loading}
                                    >
                                        Clear form
                                    </button>

                                    <button
                                        type="submit"
                                        className="ac-submit-btn"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <IconSpinner />
                                                Adding Course&hellip;
                                            </>
                                        ) : (
                                            <>
                                                <IconPlus />
                                                Add Course
                                            </>
                                        )}
                                    </button>

                                </div>

                            </form>

                        </div>

                        {/* ================= LIVE PREVIEW ================= */}

                        <div className="ac-preview-rail">

                            <span className="ac-preview-eyebrow">How it will appear</span>

                            <div className="ac-preview-card">

                                <div className="ac-preview-image-wrap">

                                    {imageStatus === 'ok' && (
                                        <img
                                            src={form.imageURL.trim()}
                                            alt={form.title || 'Course preview'}
                                            className="ac-preview-image"
                                        />
                                    )}

                                    {imageStatus === 'loading' && (
                                        <div className="ac-preview-placeholder">
                                            <IconSpinner />
                                            <span>Loading image&hellip;</span>
                                        </div>
                                    )}

                                    {imageStatus === 'error' && (
                                        <div className="ac-preview-placeholder error">
                                            <span>Image could not be loaded</span>
                                        </div>
                                    )}

                                    {imageStatus === 'idle' && (
                                        <div className="ac-preview-placeholder">
                                            <span>Image preview will appear here</span>
                                        </div>
                                    )}

                                    {form.level && (
                                        <span className="ac-preview-level-pill">{form.level}</span>
                                    )}

                                </div>

                                <div className="ac-preview-body">

                                    <div className="ac-preview-title">
                                        {form.title || 'Course title'}
                                    </div>

                                    {form.duration && (
                                        <div className="ac-preview-duration">{form.duration}</div>
                                    )}

                                    <p className="ac-preview-description">
                                        {form.description || 'Course description will appear here as you type.'}
                                    </p>

                                    <div className="ac-preview-footer">
                                        <span className="ac-preview-price">
                                            {form.price || 'Price'}
                                        </span>
                                        <span className="ac-preview-cta">Enroll Now</span>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </main>

            </div>

        </div>
    );
};

export default AddCourse;
