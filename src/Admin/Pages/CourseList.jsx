import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';
import AdminNavbar from '../MyComponents/AdminNavebar/Adminnavbar';
import AdminSidebar from '../MyComponents/Sidebar/Sidebar';
import './CourseList.css'


const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [message, setMessage] = useState('');
    const [editingCourse, setEditingCourse] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('https://665e97541e9017dc16f093eb.mockapi.io/Courses');
                setCourses(response.data.map(course => ({
                    ...course,
                    expanded: false
                })));
            } catch (error) {
                setMessage('Failed to fetch courses. Please try again.');
                setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
            }
        };

        fetchCourses();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://665e97541e9017dc16f093eb.mockapi.io/Courses/${id}`);
            setCourses(courses.filter(course => course.id !== id));
            setMessage('Course deleted successfully!');
            setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
        } catch (error) {
            setMessage('Failed to delete course. Please try again.');
            setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
        }
    };

    const toggleDescription = (courseId) => {
        setCourses(courses.map(course =>
            course.id === courseId ? { ...course, expanded: !course.expanded } : course
        ));
    };

    const handleEditClick = (course) => {
        setEditingCourse(course.id);
    };

    const handleSaveClick = async (courseId) => {
        const courseToSave = courses.find(course => course.id === courseId);
        try {
            await axios.put(`https://665e97541e9017dc16f093eb.mockapi.io/Courses/${courseId}`, courseToSave);
            setMessage('Course updated successfully!');
            setEditingCourse(null);
            setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
        } catch (error) {
            setMessage('Failed to update course. Please try again.');
            setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
        }
    };

    const handleInputChange = (e, courseId) => {
        const { name, value } = e.target;
        setCourses(courses.map(course =>
            course.id === courseId ? { ...course, [name]: value } : course
        ));
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
                        <Container fluid className="mt-5">
                            <Row>
                                <Col>
                                    <Card>
                                        <Card.Body>
                                            <h3 className="text-center mb-4">Courses List</h3>
                                            {message && <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>{message}</Alert>}
                                            <Table striped bordered hover responsive>
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Title</th>
                                                        <th>Description</th>
                                                        <th>Instructor</th>
                                                        <th>Image URL</th>
                                                        <th>Edit</th>
                                                        <th>Delete</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {courses.map((course, index) => (
                                                        <tr key={course.id}>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                {editingCourse === course.id ? (
                                                                    <Form.Control
                                                                        type="text"
                                                                        name="title"
                                                                        value={course.title}
                                                                        onChange={(e) => handleInputChange(e, course.id)}
                                                                    />
                                                                ) : (
                                                                    course.title
                                                                )}
                                                            </td>
                                                            <td>
                                                                {course.expanded ? (
                                                                    editingCourse === course.id ? (
                                                                        <Form.Control
                                                                            as="textarea"
                                                                            rows={3}
                                                                            name="description"
                                                                            value={course.description}
                                                                            onChange={(e) => handleInputChange(e, course.id)}
                                                                        />
                                                                    ) : (
                                                                        course.description
                                                                    )
                                                                ) : (
                                                                    course.description?.slice(0, 100) ?? '' // Ensure description is defined
                                                                )}
                                                                {' '}
                                                                <Button
                                                                    variant="link"
                                                                    className="text-black read-more-btn"
                                                                    onClick={() => toggleDescription(course.id)}
                                                                >
                                                                    {course.expanded ? 'Read Less' : 'Read More'}
                                                                </Button>
                                                            </td>
                                                            <td>
                                                                {editingCourse === course.id ? (
                                                                    <Form.Control
                                                                        type="text"
                                                                        name="instructor"
                                                                        value={course.instructor}
                                                                        onChange={(e) => handleInputChange(e, course.id)}
                                                                    />
                                                                ) : (
                                                                    course.instructor
                                                                )}
                                                            </td>
                                                            <td>
                                                                {editingCourse === course.id ? (
                                                                    <Form.Control
                                                                        type="text"
                                                                        name="imageURL"
                                                                        value={course.imageURL}
                                                                        onChange={(e) => handleInputChange(e, course.id)}
                                                                    />
                                                                ) : (
                                                                    course.imageURL
                                                                )}
                                                            </td>
                                                            <td className="text-center">
                                                                {editingCourse === course.id ? (
                                                                    <Button variant="success" onClick={() => handleSaveClick(course.id)}>
                                                                        <FontAwesomeIcon icon={faSave} />
                                                                    </Button>
                                                                ) : (
                                                                    <Button variant="info" onClick={() => handleEditClick(course)}>
                                                                        <FontAwesomeIcon icon={faEdit} />
                                                                    </Button>
                                                                )}
                                                            </td>
                                                            <td className="text-center">
                                                                <Button variant="danger" onClick={() => handleDelete(course.id)}>
                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
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

export default CourseList;
