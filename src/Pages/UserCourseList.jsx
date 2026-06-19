import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Form, Modal, Badge } from 'react-bootstrap';
import Header from '../MyComponents/Navbar/Header';
import Footer from '../MyComponents/Footer/Footer';
import supabase from '../lib/supabaseClient';

const UserCourseList = () => {
    const [courses, setCourses] = useState([]);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('danger');
    const [showModal, setShowModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [enrollmentDetails, setEnrollmentDetails] = useState({
        name: '',
        email: '',
        age: '',
        gender: '',
        phoneNumber: '',
        city: ''
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data, error } = await supabase
                    .from('courses')
                    .select('*')
                    .order('created_at', { ascending: true });
                if (error) throw error;
                setCourses(data.map(course => ({ ...course, expanded: false })));
            } catch (error) {
                setMessage('Failed to fetch courses. Please try again.');
                setMessageType('danger');
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleEnrollClick = (course) => {
        setSelectedCourse(course);
        setShowModal(true);
        setMessage('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEnrollmentDetails({ ...enrollmentDetails, [name]: value });
    };

    const handleEnrollmentSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('enrollments')
                .insert([{
                    student_name: enrollmentDetails.name,
                    email: enrollmentDetails.email,
                    phone: enrollmentDetails.phoneNumber,
                    course_id: selectedCourse.id,
                    course_name: selectedCourse.title
                }]);
            if (error) throw error;
            setMessage('Enrollment submitted successfully! We will contact you soon.');
            setMessageType('success');
            setEnrollmentDetails({
                name: '',
                email: '',
                age: '',
                gender: '',
                phoneNumber: '',
                city: ''
            });
            setShowModal(false);
        } catch (error) {
            setMessage('Failed to submit enrollment. Please try again.');
            setMessageType('danger');
        } finally {
            setSubmitting(false);
        }
    };

    const toggleDescription = (courseId) => {
        setCourses(courses.map(course =>
            course.id === courseId ? { ...course, expanded: !course.expanded } : course
        ));
    };

    const getLevelBadge = (level) => {
        const colors = {
            'Beginner': 'success',
            'Intermediate': 'warning',
            'Advanced': 'danger',
            'All Levels': 'info'
        };
        return colors[level] || 'secondary';
    };

    return (
        <>
            <Header />
            <Container className="mt-5 mb-5">
                <Row>
                    <Col>
                        <h3 className="text-center mb-4">Our Courses</h3>
                        {message && (
                            <Alert variant={messageType} onClose={() => setMessage('')} dismissible>
                                {message}
                            </Alert>
                        )}
                        {loading ? (
                            <p className="text-center">Loading courses...</p>
                        ) : (
                            <Row>
                                {courses.map((course) => (
                                    <Col md={4} key={course.id} className="mb-4">
                                        <Card className="h-100 shadow-sm">
                                            <Card.Img
                                                variant="top"
                                                src={course.image_url}
                                                style={{ height: '200px', objectFit: 'cover' }}
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Quran+Course'; }}
                                            />
                                            <Card.Body className="d-flex flex-column">
                                                <Card.Title>{course.title}</Card.Title>
                                                <div className="mb-2">
                                                    {course.level && (
                                                        <Badge bg={getLevelBadge(course.level)} className="me-2">
                                                            {course.level}
                                                        </Badge>
                                                    )}
                                                    {course.duration && (
                                                        <Badge bg="secondary">{course.duration}</Badge>
                                                    )}
                                                </div>
                                                <Card.Text>
                                                    {course.expanded
                                                        ? course.description
                                                        : `${course.description?.slice(0, 100)}...`}
                                                    {' '}
                                                    <Button
                                                        variant="link"
                                                        className="p-0"
                                                        onClick={() => toggleDescription(course.id)}
                                                    >
                                                        {course.expanded ? 'Read Less' : 'Read More'}
                                                    </Button>
                                                </Card.Text>
                                                {course.price && (
                                                    <p className="fw-bold text-primary">{course.price}</p>
                                                )}
                                                <Button
                                                    variant="primary"
                                                    className="mt-auto"
                                                    onClick={() => handleEnrollClick(course)}
                                                >
                                                    Enroll Now
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Col>
                </Row>
            </Container>

            {/* Enrollment Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Enroll in {selectedCourse?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEnrollmentSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your full name"
                                name="name"
                                value={enrollmentDetails.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                name="email"
                                value={enrollmentDetails.email}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Age</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter your age"
                                name="age"
                                value={enrollmentDetails.age}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Gender</Form.Label>
                            <Form.Select
                                name="gender"
                                value={enrollmentDetails.gender}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your phone number"
                                name="phoneNumber"
                                value={enrollmentDetails.phoneNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your city"
                                name="city"
                                value={enrollmentDetails.city}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100"
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit Enrollment'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Footer />
        </>
    );
};

export default UserCourseList;
