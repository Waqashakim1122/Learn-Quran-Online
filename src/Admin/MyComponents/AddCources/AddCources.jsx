import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

import AdminSidebar from '../Sidebar/Sidebar';
import AdminNavbar from '../AdminNavebar/Adminnavbar';

const AddCourse = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [instructor, setInstructor] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const courseData = { title, description, instructor, imageURL };

        try {
            const response = await axios.post('https://665e97541e9017dc16f093eb.mockapi.io/Courses', courseData);
            if (response.status === 200 || response.status === 201) {
                setMessage('Course added successfully!');
                setTitle('');
                setDescription('');
                setInstructor('');
                setImageURL('');
            }
        } catch (error) {
            setMessage('Failed to add course. Please try again.');
        }
    };

    return (
        <>
          <AdminNavbar/>
            <Container fluid>
                <Row>
                    <Col md={3} className="sidebar-column">
                        <AdminSidebar />
                    </Col>
                    <Col md={9} className="main-content">
                        <Container className="mt-5">
                            <Row className="justify-content-center">
                                <Col lg={8}>
                                    <Card>
                                        <Card.Body>
                                            <h3 className="text-center mb-4">Add New Course</h3>
                                            {message && <Alert variant="info">{message}</Alert>}
                                            <Form onSubmit={handleSubmit}>
                                                <Form.Group className="mb-3" controlId="formCourseTitle">
                                                    <Form.Label>Course Title</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter course title"
                                                        value={title}
                                                        onChange={(e) => setTitle(e.target.value)}
                                                        required
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3" controlId="formCourseDescription">
                                                    <Form.Label>Course Description</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        placeholder="Enter course description"
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        required
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3" controlId="formInstructor">
                                                    <Form.Label>Instructor</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter instructor name"
                                                        value={instructor}
                                                        onChange={(e) => setInstructor(e.target.value)}
                                                        required
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3" controlId="formImageURL">
                                                    <Form.Label>Course Image URL</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter image URL"
                                                        value={imageURL}
                                                        onChange={(e) => setImageURL(e.target.value)}
                                                        required
                                                    />
                                                </Form.Group>

                                                <Button variant="primary" type="submit" className="w-100">
                                                    Add Course
                                                </Button>
                                            </Form>
                                        </Card.Body>
                                    </Card>
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
