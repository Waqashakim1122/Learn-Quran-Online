import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import AdminSidebar from '../Sidebar/Sidebar';
import AdminNavbar from '../AdminNavebar/Adminnavbar';
import supabase from '../../../lib/supabaseClient';
import './AddCourse.css';

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

const AddCourse = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type, text }
    const [imageStatus, setImageStatus] = useState('idle'); // idle | loading | ok | error
    const dismissTimer = useRef(null);
    const firstFieldRef = useRef(null);

    useEffect(() => {
        firstFieldRef.current?.focus();
        return () => clearTimeout(dismissTimer.current);
    }, []);

    // Debounced image preview check
    useEffect(() => {
        if (!form.imageURL) {
            setImageStatus('idle');
            return;
        }
        if (!URL_PATTERN.test(form.imageURL.trim())) {
            setImageStatus('error');
            return;
        }
        setImageStatus('loading');
        const timeout = setTimeout(() => {
            const img = new Image();
            img.onload = () => setImageStatus('ok');
            img.onerror = () => setImageStatus('error');
            img.src = form.imageURL.trim();
        }, 400);
        return () => clearTimeout(timeout);
    }, [form.imageURL]);

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

    const validateAll = () => {
        const nextErrors = {};
        Object.keys(form).forEach((key) => {
            const err = validateField(key, form[key]);
            if (err) nextErrors[key] = err;
        });
        return nextErrors;
    };

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
        dismissTimer.current = setTimeout(() => setMessage(null), 6000);
    };

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setErrors({});
        setTouched({});
        setValidated(false);
        setImageStatus('idle');
        firstFieldRef.current?.focus();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);

        const nextErrors = validateAll();
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

    const fieldState = (name) => {
        if (!touched[name]) return {};
        return errors[name] ? { isInvalid: true } : { isValid: true };
    };

    return (
        <>
            <AdminNavbar />
            <Container fluid>
                <Row>
                    <Col md={3} className="sidebar-column">
                        <AdminSidebar />
                    </Col>
                    <Col md={9} className="main-content">
                        <Container className="add-course-page">
                            <Row className="justify-content-center">
                                <Col lg={9} xl={8}>
                                    <div className="add-course-header">
                                        <div>
                                            <span className="add-course-eyebrow">Course Catalog</span>
                                            <h1 className="add-course-title">Add New Course</h1>
                                            <p className="add-course-subtitle">
                                                Create a new course listing for the Learn Quran Online catalog.
                                            </p>
                                        </div>
                                        <Button
                                            className="add-course-back-btn"
                                            onClick={() => navigate('/courselist')}
                                        >
                                            <span aria-hidden="true">&larr;</span> Back to Courses
                                        </Button>
                                    </div>

                                    {message && (
                                        <Alert
                                            variant={message.type}
                                            onClose={() => setMessage(null)}
                                            dismissible
                                            className="add-course-alert"
                                        >
                                            {message.text}
                                        </Alert>
                                    )}

                                    <Row className="g-4">
                                        <Col lg={7}>
                                            <Card className="add-course-card">
                                                <Card.Body>
                                                    <Form noValidate validated={validated} onSubmit={handleSubmit}>

                                                        <fieldset className="form-section">
                                                            <legend className="form-section-title">Course Details</legend>

                                                            <Form.Group className="mb-3" controlId="courseTitle">
                                                                <Form.Label>
                                                                    Course Title <span className="required-mark">*</span>
                                                                </Form.Label>
                                                                <Form.Control
                                                                    ref={firstFieldRef}
                                                                    type="text"
                                                                    name="title"
                                                                    placeholder="e.g. Quran Nazra"
                                                                    value={form.title}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    maxLength={LIMITS.title}
                                                                    {...fieldState('title')}
                                                                />
                                                                <div className="field-footer">
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {errors.title}
                                                                    </Form.Control.Feedback>
                                                                    <span className="char-count">
                                                                        {form.title.length}/{LIMITS.title}
                                                                    </span>
                                                                </div>
                                                            </Form.Group>

                                                            <Form.Group controlId="courseDescription">
                                                                <Form.Label>
                                                                    Course Description <span className="required-mark">*</span>
                                                                </Form.Label>
                                                                <Form.Control
                                                                    as="textarea"
                                                                    rows={4}
                                                                    name="description"
                                                                    placeholder="Describe what students will learn in this course"
                                                                    value={form.description}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    maxLength={LIMITS.description}
                                                                    {...fieldState('description')}
                                                                />
                                                                <div className="field-footer">
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {errors.description}
                                                                    </Form.Control.Feedback>
                                                                    <span className="char-count">
                                                                        {form.description.length}/{LIMITS.description}
                                                                    </span>
                                                                </div>
                                                            </Form.Group>
                                                        </fieldset>

                                                        <fieldset className="form-section">
                                                            <legend className="form-section-title">Media</legend>

                                                            <Form.Group controlId="courseImageURL">
                                                                <Form.Label>
                                                                    Course Image URL <span className="required-mark">*</span>
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="imageURL"
                                                                    placeholder="e.g. https://images.unsplash.com/..."
                                                                    value={form.imageURL}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    {...fieldState('imageURL')}
                                                                />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors.imageURL}
                                                                </Form.Control.Feedback>
                                                                <Form.Text className="field-hint">
                                                                    Paste a direct image link. It updates the preview on the right as you type.
                                                                </Form.Text>
                                                            </Form.Group>
                                                        </fieldset>

                                                        <fieldset className="form-section form-section--last">
                                                            <legend className="form-section-title">Scheduling &amp; Pricing</legend>

                                                            <Row className="g-3">
                                                                <Col sm={4}>
                                                                    <Form.Group controlId="courseDuration">
                                                                        <Form.Label>
                                                                            Duration <span className="required-mark">*</span>
                                                                        </Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            name="duration"
                                                                            placeholder="e.g. 3 Months"
                                                                            value={form.duration}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            {...fieldState('duration')}
                                                                        />
                                                                        <Form.Control.Feedback type="invalid">
                                                                            {errors.duration}
                                                                        </Form.Control.Feedback>
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col sm={4}>
                                                                    <Form.Group controlId="courseLevel">
                                                                        <Form.Label>
                                                                            Level <span className="required-mark">*</span>
                                                                        </Form.Label>
                                                                        <Form.Select
                                                                            name="level"
                                                                            value={form.level}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            {...fieldState('level')}
                                                                        >
                                                                            <option value="">Select Level</option>
                                                                            {LEVEL_OPTIONS.map((lvl) => (
                                                                                <option key={lvl} value={lvl}>{lvl}</option>
                                                                            ))}
                                                                        </Form.Select>
                                                                        <Form.Control.Feedback type="invalid">
                                                                            {errors.level}
                                                                        </Form.Control.Feedback>
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col sm={4}>
                                                                    <Form.Group controlId="coursePrice">
                                                                        <Form.Label>
                                                                            Price <span className="required-mark">*</span>
                                                                        </Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            name="price"
                                                                            placeholder="e.g. $20/month"
                                                                            value={form.price}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            {...fieldState('price')}
                                                                        />
                                                                        <Form.Control.Feedback type="invalid">
                                                                            {errors.price}
                                                                        </Form.Control.Feedback>
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>
                                                        </fieldset>

                                                        <div className="add-course-actions">
                                                            <button
                                                                type="button"
                                                                className="add-course-clear-link"
                                                                onClick={resetForm}
                                                                disabled={loading}
                                                            >
                                                                Clear form
                                                            </button>
                                                            <Button
                                                                variant="primary"
                                                                type="submit"
                                                                className="add-course-submit"
                                                                disabled={loading}
                                                            >
                                                                {loading ? (
                                                                    <>
                                                                        <Spinner
                                                                            as="span"
                                                                            animation="border"
                                                                            size="sm"
                                                                            role="status"
                                                                            aria-hidden="true"
                                                                            className="me-2"
                                                                        />
                                                                        Adding Course&hellip;
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <span className="add-course-submit-icon" aria-hidden="true">+</span>
                                                                        Add Course
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </Form>
                                                </Card.Body>
                                            </Card>
                                        </Col>

                                        <Col lg={5}>
                                            <div className="preview-rail">
                                                <span className="preview-eyebrow">How it will appear</span>
                                                <div className="preview-course-card">
                                                    <div className="preview-image-wrap">
                                                        {imageStatus === 'ok' && (
                                                            <img
                                                                src={form.imageURL.trim()}
                                                                alt={form.title || 'Course preview'}
                                                                className="preview-image"
                                                            />
                                                        )}
                                                        {imageStatus === 'loading' && (
                                                            <div className="preview-placeholder">
                                                                <Spinner animation="border" size="sm" />
                                                                <span>Loading image&hellip;</span>
                                                            </div>
                                                        )}
                                                        {imageStatus === 'error' && (
                                                            <div className="preview-placeholder preview-placeholder--error">
                                                                <span>Image could not be loaded</span>
                                                            </div>
                                                        )}
                                                        {imageStatus === 'idle' && (
                                                            <div className="preview-placeholder">
                                                                <span>Image preview will appear here</span>
                                                            </div>
                                                        )}
                                                        {form.level && (
                                                            <span className="preview-level-pill">{form.level}</span>
                                                        )}
                                                    </div>

                                                    <div className="preview-body">
                                                        <div className="preview-title">
                                                            {form.title || 'Course title'}
                                                        </div>
                                                        {form.duration && (
                                                            <div className="preview-duration">{form.duration}</div>
                                                        )}
                                                        <p className="preview-description">
                                                            {form.description || 'Course description will appear here as you type.'}
                                                        </p>
                                                        <div className="preview-footer">
                                                            <span className="preview-price">
                                                                {form.price || 'Price'}
                                                            </span>
                                                            <span className="preview-cta">Enroll Now</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AddCourse;
