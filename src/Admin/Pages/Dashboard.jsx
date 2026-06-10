import React, { useState } from 'react';
import AdminSidebar from '../MyComponents/Sidebar/Sidebar';
import AdminNavbar from '../MyComponents/AdminNavebar/Adminnavbar';
import AdminStats from '../MyComponents/AdminStats/AdminStats';
import { Container, Row, Col, Button } from 'react-bootstrap';

const Dashboard = () => {
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    return (
        <Container fluid>
            <Row>
                <Button
                    className="d-md-none mb-3"
                    onClick={toggleSidebar}
                >
                    Toggle Sidebar
                </Button>
                <Col lg={2} className={`d-md-block ${showSidebar ? 'd-block' : 'd-none'}`}>
                    <AdminSidebar />
                </Col>
                <Col lg={10}>
              
                    <AdminNavbar />
                    <AdminStats/>
                   
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
