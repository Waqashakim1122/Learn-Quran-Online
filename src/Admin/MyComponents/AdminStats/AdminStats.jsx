import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import './AdminStats.css'; 

const AdminStats = () => {
    const [courseCount, setCourseCount] = useState(0);
    const [enrollmentCount, setEnrollmentCount] = useState(0);
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [showCourses, setShowCourses] = useState(false);
    const [showEnrollments, setShowEnrollments] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const courseResponse = await axios.get('https://665e97541e9017dc16f093eb.mockapi.io/Courses');
                setCourseCount(courseResponse.data.length);
                setCourses(courseResponse.data);

                const enrollmentResponse = await axios.get('https://665e97541e9017dc16f093eb.mockapi.io/Enrollments');
                setEnrollmentCount(enrollmentResponse.data.length);
                setEnrollments(enrollmentResponse.data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };

        fetchStats();
    }, []);

    const toggleCourses = () => {
        setShowCourses(!showCourses);
    };

    const toggleEnrollments = () => {
        setShowEnrollments(!showEnrollments);
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col md={6}>
                    <Card className="text-center shadow mb-4">
                        <Card.Body>
                            <Card.Title className="stats-title">Number of Courses</Card.Title>
                            <Card.Text className="stats-count">{courseCount}</Card.Text>
                            <Button variant="secondary" size="sm" onClick={toggleCourses} className="toggle-btn">
                                {showCourses ? 'Hide Courses' : 'Show Courses'}
                            </Button>
                            {showCourses && (
                                <ul className="list-unstyled mt-3">
                                    {courses.map(course => (
                                        <li key={course.id}>
                                            <strong>{course.title}</strong>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="text-center shadow mb-4">
                        <Card.Body>
                            <Card.Title className="stats-title">Number of Enrollments</Card.Title>
                            <Card.Text className="stats-count">{enrollmentCount}</Card.Text>
                            <Button variant="secondary" size="sm" onClick={toggleEnrollments} className="toggle-btn">
                                {showEnrollments ? 'Hide Enrollments' : 'Show Enrollments'}
                            </Button>
                            {showEnrollments && (
                                <ul className="list-unstyled mt-3">
                                    {enrollments.map(enrollment => (
                                        <li key={enrollment.id}>
                                            <strong>{enrollment.studentName}</strong> enrolled in <strong>{enrollment.courseTitle}</strong>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminStats;
