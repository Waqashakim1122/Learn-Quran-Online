import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';
import AdminNavbar from '../MyComponents/AdminNavebar/Adminnavbar';
import AdminSidebar from '../MyComponents/Sidebar/Sidebar';
import supabase from '../../lib/supabaseClient';
import './CourseList.css';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [message, setMessage] = useState('');
    const [editingCourse, setEditingCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

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
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;
        try {
            const { error } = await supabase
                .from('courses')
                .delete()
                .eq('id', id);
            if (error) throw error;
            setCourses(courses.filter(course => course.id !== id));
            setMessage('Course deleted successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to delete course. Please try again.');
            setTimeout(() => setMessage(''), 3000);
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
            const { error } = await supabase
                .from('courses')
                .update({
                    title: courseToSave.title,
                    description: courseToSave.description,
                    image_url: courseToSave.image_url,
                    duration: courseToSave.duration,
                    level: courseToSave.level,
                    price: courseToSave.price
                })
                .eq('id', courseId);
            if (error) throw error;
            setMessage('Course updated successfully!');
            setEditingCourse(null);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to update course. Please try again.');
            setTimeout(() => setMessage(''), 3000);
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
                                            {message && (
                                                <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>
                                                    {message}
                                                </Alert>
                                            )}
                                            {loading ? (
                                                <p className="text-center">Loading courses...</p>
                                            ) : (
                                                <Table striped bordered hover responsive>
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Title</th>
                                                            <th>Description</th>
                                                            <th>Duration</th>
                                                            <th>Level</th>
                                                            <th>Price</th>
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
                                                                    ) : course.title}
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
                                                                        ) : course.description
                                                                    ) : (
                                                                        course.description?.slice(0, 100) ?? ''
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
                                                                            name="duration"
                                                                            value={course.duration}
                                                                            onChange={(e) => handleInputChange(e, course.id)}
                                                                        />
                                                                    ) : course.duration}
                                                                </td>
                                                                <td>
                                                                    {editingCourse === course.id ? (
                                                                        <Form.Control
                                                                            type="text"
                                                                            name="level"
                                                                            value={course.level}
                                                                            onChange={(e) => handleInputChange(e, course.id)}
                                                                        />
                                                                    ) : course.level}
                                                                </td>
                                                                <td>
                                                                    {editingCourse === course.id ? (
                                                                        <Form.Control
                                                                            type="text"
                                                                            name="price"
                                                                            value={course.price}
                                                                            onChange={(e) => handleInputChange(e, course.id)}
                                                                        />
                                                                    ) : course.price}
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
                                            )}
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
