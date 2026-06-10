import React, { useState, useEffect } from 'react';
import { Container, Col, Row, Card, Table, Alert } from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from '../MyComponents/Sidebar/Sidebar';
import AdminNavbar from '../MyComponents/AdminNavebar/Adminnavbar';

const AdminEnrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const response = await axios.get('https://665e97541e9017dc16f093eb.mockapi.io/Enrollments');
                setEnrollments(response.data);
            } catch (error) {
                setMessage('Failed to fetch enrollments. Please try again.');
            }
        };

        fetchEnrollments();
    }, []);

    return (
        <>
            <AdminNavbar/>
         <Container fluid className="p-0">
                <Row className="m-0">
                    <Col md={3} className="sidebar-column">
                        <AdminSidebar />
                    </Col>
                    <Col sm={9} className="main-content">
                        <Container className="mt-5">
                            <Row>
                                <Col>
                                    <Card>
                                        <Card.Body>
                                            <h3 className="text-center mb-4">Enrollments</h3>
                                            {message && <Alert variant="danger">{message}</Alert>}
                                            <Table striped bordered hover responsive>
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Phone</th>
                                                        <th>Age</th>
                                                        <th>Gender</th>
                                                        <th>City</th>
                                                        <th>Course</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {enrollments.map((enrollment, index) => (
                                                        <tr key={enrollment.id}>
                                                            <td>{index + 1}</td>
                                                            <td>{enrollment.name}</td>
                                                            <td>{enrollment.email}</td>
                                                            <td>{enrollment.phoneNumber}</td>
                                                            <td>{enrollment.age}</td>
                                                            <td>{enrollment.gender}</td>
                                                            <td>{enrollment.city}</td>
                                                            <td>{enrollment.courseTitle}</td>
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

export default AdminEnrollments;
