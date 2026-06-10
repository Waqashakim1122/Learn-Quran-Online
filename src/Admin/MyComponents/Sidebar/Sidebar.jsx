import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faUsers, faPlus } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const AdminSidebar = ({ showSidebar, toggleSidebar }) => {
    return (
        <nav id="sidebar" className={`bg-light vh-100 position-fixed d-flex flex-column justify-content-between p-3 ${showSidebar ? 'show' : ''}`}>
            <div>
                <div className="sidebar-header mb-3">
                    <h3>Admin Panel</h3>
                </div>
                <ul className="list-unstyled components">
                    <li className="mb-3 p-2 rounded">
                        <NavLink to="/dashboard" className="nav-link text-dark d-flex align-items-center" onClick={toggleSidebar}>
                            <FontAwesomeIcon icon={faChartLine} className="me-2" />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li className="mb-3 p-2 rounded">
                        <NavLink to="/enrollments" className="nav-link text-dark d-flex align-items-center" onClick={toggleSidebar}>
                            <FontAwesomeIcon icon={faUsers} className="me-2" />
                            <span>View Enrollments</span>
                        </NavLink>
                    </li>
                    <li className="mb-3 p-2 rounded">
                        <NavLink to="/courselist" className="nav-link text-dark d-flex align-items-center" onClick={toggleSidebar}>
                            <FontAwesomeIcon icon={faChartLine} className="me-2" />
                            <span>Courses List</span>
                        </NavLink>
                    </li>
                    <li className="mb-3 p-2 rounded">
                        <NavLink to="/addCourse" className="nav-link text-dark d-flex align-items-center" onClick={toggleSidebar}>
                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                            <span>Add Courses</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default AdminSidebar;
