
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, InputGroup, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (email === 'Admin123@gamil.com' && password === 'Ad12') {
            login();
            navigate('/dashboard');
        } else {
            setError('Invalid email or password. Please try again.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container className="admin-login-container">
            <Row className="w-100">
                <Col lg={6} className="d-none d-lg-block">
                    <div className="login-image"></div>
                </Col>
                <Col lg={6} md={8} sm={12} className="mx-auto">
                    <Card className="shadow-lg">
                        <Card.Body>
                            <h3 className="text-center mb-4 text-primary">Admin Login</h3>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="adminFormEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="adminFormPassword">
                                    <Form.Label>Password</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <Button
                                            variant="outline-secondary"
                                            onClick={togglePasswordVisibility}
                                            className="toggle-password-btn"
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </Button>
                                    </InputGroup>
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100 mb-3">
                                    Login
                                </Button>

                                <div className="d-flex justify-content-between">
                                    <Link to="/">Go Back to Home</Link>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminLogin;
