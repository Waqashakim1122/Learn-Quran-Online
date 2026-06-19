import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import AdminSidebar from '../Sidebar/Sidebar';
import AdminNavbar from '../AdminNavebar/Adminnavbar';
import supabase from '../../../lib/supabaseClient';

const AddCourse = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [duration, setDuration] = useState('');
    const [level, setLevel] = useState('');
    const [price, setPrice] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('info');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const { error } = await supabase
                .from('courses')
                .insert([{
                    title,
                    description,
                    image_url: imageURL,
                    duration,
                    level,
                    price
                }]);

            if (error) throw error;

            setMessage('Course added successfully!');
            setMessageType('success');
            setTitle('');
            setDescription('');
            setImageURL('');
            setDuration('');
            setLevel('');
            setPrice('');
        } catch (error) {
            setMessage('Failed to add course. Please try again.');
            setMessageType('danger');
        } finally {
            setLoading(false);
        }
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
                        <Container className="mt-5">
                            <Row className="justify-content-center">
                                <Col lg={8}>
                                    <Card>
                                        <Card.Body>
                                            <h3 className="text-center mb-4">Add New Course</h3>
                                            {message && (
                                                <Alert variant={messageType} onClose={() => setMessage('')} dismissible>
                                                    {message}
                                                </Alert>
                                            )}
                                            <Form onSubmit={handleSubmit}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Course Title</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="e.g. Quran Nazra"
                                                        value={title}
                                                        onChange={(e) => setTitle(e.target.value)}
                                                        required
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
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

                                                <Form.Group className="mb-3">
                                                    <Form.Label>Course Image URL</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="e.g. https://images.unsplash.com/..."
                                                        value={imageURL}
                                                        onChange={(e) => setImageURL(e.target.value)}
                                                        required
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label>Duration</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="e.g. 3 Months"
                                                        value={duration}
                                                        onChange={(e) => setDuration(e.target.value)}
                                                        required
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label>Level</Form.Label>
                                                    <Form.Select
                                                        value={level}
                                                        onChange={(e) => setLevel(e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select Level</option>
                                                        <option value="Beginner">Beginner</option>
                                                        <option value="Intermediate">Intermediate</option>
                                                        <option value="Advanced">Advanced</option>
                                                        <option value="All Levels">All Levels</option>
                                                    </Form.Select>
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label>Price</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="e.g. $20/month"
                                                        value={price}
                                                        onChange={(e) => setPrice(e.target.value)}
                                                        required
                                                    />
                                                </Form.Group>

                                                <Button
                                                    variant="primary"
                                                    type="submit"
                                                    className="w-100"
                                                    disabled={loading}
                                                >
                                                    {loading ? 'Adding Course...' : 'Add Course'}
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
