import React, { useState, useEffect } from 'react';
import { Container, Col, Row, Card, Table, Alert, Badge } from 'react-bootstrap';
import AdminSidebar from '../MyComponents/Sidebar/Sidebar';
import AdminNavbar from '../MyComponents/AdminNavebar/Adminnavbar';
import supabase from '../../lib/supabaseClient';

const AdminEnrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const { data, error } = await supabase
                    .from('enrollments')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (error) throw error;
                setEnrollments(data);
            } catch (error) {
                setMessage('Failed to fetch enrollments. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchEnrollments();
    }, []);

    return (
        <>
            <AdminNavbar />
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
                                            <h3 className="text-center mb-4">
                                                Enrollments
                                                <Badge bg="primary" className="ms-2">
                                                    {enrollments.length}
                                                </Badge>
                                            </h3>
                                            {message && (
                                                <Alert variant="danger">{message}</Alert>
                                            )}
                                            {loading ? (
                                                <p className="text-center">Loading enrollments...</p>
                                            ) : enrollments.length === 0 ? (
                                                <p className="text-center text-muted">No enrollments yet.</p>
                                            ) : (
                                                <Table striped bordered hover responsive>
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Name</th>
                                                            <th>Email</th>
                                                            <th>Phone</th>
                                                            <th>Course</th>
                                                            <th>Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {enrollments.map((enrollment, index) => (
                                                            <tr key={enrollment.id}>
                                                                <td>{index + 1}</td>
                                                                <td>{enrollment.student_name}</td>
                                                                <td>{enrollment.email}</td>
                                                                <td>{enrollment.phone}</td>
                                                                <td>{enrollment.course_name}</td>
                                                                <td>
                                                                    {new Date(enrollment.created_at).toLocaleDateString()}
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

export default AdminEnrollments;
