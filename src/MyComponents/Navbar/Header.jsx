import React from 'react'
import { NavLink } from 'react-router-dom';
import logo from '../../assetes/navbar-logo.png';

const Header = () => {
    

    return (
        <nav className="navbar navbar-expand-md text-bg-light p-1 sticky-top">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">
                    <img className="img-fluid" src={logo} alt="Logo" width="150" height="80"/>
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link active" aria-current="page" to="/">
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link active" aria-current="page" to="/About">
                                About
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link active" aria-current="page" to="/courses">
                                Courses 
                            </NavLink>
                        </li>
                       
                        <li className="nav-item">
                            <NavLink className="nav-link active" aria-current="page" to="/ContactUs">
                                Contact
                            </NavLink>
                        </li>
                        <li className="nav-item d-md-none">
                            <NavLink className="btn btn-dark w-100" to="/enroll" role="button">
                                Free Trial
                            </NavLink>
                        </li>
                    </ul>
                    <NavLink className="btn btn-dark d-none d-md-inline-block" to="/courses" role="button">
                        Free Trial
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Header;
