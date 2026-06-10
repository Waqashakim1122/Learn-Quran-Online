import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import Header from '../MyComponents/Navbar/Header';
import Footer from '../MyComponents/Footer/Footer';

const UserCourseList = () => {
    const [courses, setCourses] = useState([]);
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
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
                const response = await axios.get('https://665e97541e9017dc16f093eb.mockapi.io/Courses');
                setCourses(response.data);
            } catch (error) {
                setMessage('Failed to fetch courses. Please try again.');
            }
        };

        fetchCourses();
    }, []);

    const handleEnrollClick = (course) => {
        setSelectedCourse(course);
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEnrollmentDetails({
            ...enrollmentDetails,
            [name]: value
        });
    };

    const handleEnrollmentSubmit = async (e) => {
        e.preventDefault();
        const enrollmentData = {
            ...enrollmentDetails,
            courseId: selectedCourse.id,
            courseTitle: selectedCourse.title
        };

        try {
            const response = await axios.post('https://665e97541e9017dc16f093eb.mockapi.io/Enrollments', enrollmentData);
            if (response.status === 200 || response.status === 201) {
                setMessage('Enrollment submitted successfully!');
                setEnrollmentDetails({
                    name: '',
                    email: '',
                    age: '',
                    gender: '',
                    phoneNumber: '',
                    city: ''
                });
                setShowModal(false);
            } else {
                setMessage('Failed to submit enrollment. Please try again.');
            }
        } catch (error) {
            setMessage('Failed to submit enrollment. Please try again.');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const toggleDescription = (courseId) => {
        const updatedCourses = courses.map(course => {
            if (course.id === courseId) {
                return {
                    ...course,
                    expanded: !course.expanded
                };
            }
            return course;
        });
        setCourses(updatedCourses);
    };

    return (
        <>
            <Header />
            <Container className="mt-5">
                <Row>
                    <Col>
                        <h3 className="text-center mb-4">Available Courses</h3>
                        {message && <Alert variant="danger">{message}</Alert>}
                        <Row>
                            {courses.map((course) => (
                                <Col md={4} key={course.id} className="mb-4">
                                    <Card className="h-100">
                                        <Card.Img variant="top" src={course.imageURL} style={{ height: '200px', objectFit: 'cover' }} />
                                        <Card.Body>
                                            <Card.Title>{course.title}</Card.Title>
                                            <Card.Text>
                                                {course.expanded ? course.description : `${course.description.slice(0, 100)}...`}
                                                {' '}
                                                <Button
                                                    variant="link"
                                                    onClick={() => toggleDescription(course.id)}
                                                >
                                                    {course.expanded ? 'Read Less' : 'Read More'}
                                                </Button>
                                            </Card.Text>
                                            <Button variant="primary" onClick={() => handleEnrollClick(course)}>Enroll</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Container>

            {/* Modal for Enrollment */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Enroll in {selectedCourse ? selectedCourse.title : 'Course'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEnrollmentSubmit}>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your name"
                                name="name"
                                value={enrollmentDetails.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                value={enrollmentDetails.email}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formAge">
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
                        <Form.Group className="mb-3" controlId="formGender">
                            <Form.Label>Gender</Form.Label>
                            <Form.Control
                                as="select"
                                name="gender"
                                value={enrollmentDetails.gender}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPhoneNumber">
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
                        <Form.Group className="mb-3" controlId="formCity">
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
                        <Form.Control type="hidden" name="courseId" value={selectedCourse ? selectedCourse.id : ''} />
                        <Form.Control type="hidden" name="courseTitle" value={selectedCourse ? selectedCourse.title : ''} />
                        <Button variant="primary" type="submit" className="w-100">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Footer />
        </>
    );
};

export default UserCourseList;
