import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert, Badge } from 'react-bootstrap';
import AdminSidebar from '../MyComponents/Sidebar/Sidebar';
import AdminNavbar from '../MyComponents/AdminNavebar/Adminnavbar';
import supabase from '../../lib/supabaseClient';

const AdminContactSubmissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const { data, error } = await supabase
                    .from('contact_messages')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (error) throw error;
                setSubmissions(data);
            } catch (error) {
                setMessage('Failed to fetch messages. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchSubmissions();
    }, []);

    return (
        <>
            <AdminNavbar />
            <Container fluid className="p-0">
                <Row className="m-0">
                    <Col md={3} className="sidebar-column">
                        <AdminSidebar />
                    </Col>
                    <Col md={9} className="main-content">
                        <Container className="mt-5">
                            <Row>
                                <Col>
                                    <Card>
                                        <Card.Body>
                                            <h3 className="text-center mb-4">
                                                Contact Messages
                                                <Badge bg="primary" className="ms-2">
                                                    {submissions.length}
                                                </Badge>
                                            </h3>
                                            {message && (
                                                <Alert variant="danger">{message}</Alert>
                                            )}
                                            {loading ? (
                                                <p className="text-center">Loading messages...</p>
                                            ) : submissions.length === 0 ? (
                                                <p className="text-center text-muted">No messages yet.</p>
                                            ) : (
                                                <Table striped bordered hover responsive>
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Name</th>
                                                            <th>Email</th>
                                                            <th>Phone</th>
                                                            <th>Message</th>
                                                            <th>Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {submissions.map((submission, index) => (
                                                            <tr key={submission.id}>
                                                                <td>{index + 1}</td>
                                                                <td>{submission.name}</td>
                                                                <td>{submission.email}</td>
                                                                <td>{submission.phone || '-'}</td>
                                                                <td style={{ maxWidth: '300px' }}>
                                                                    {submission.message}
                                                                </td>
                                                                <td>
                                                                    {new Date(submission.created_at).toLocaleDateString()}
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

export default AdminContactSubmissions;
