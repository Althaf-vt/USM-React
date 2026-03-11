import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom';
import { logoutAdmin,logoutUser } from '../features/auth/authSlice';
import { useLocation } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {
    const { user, admin } = useSelector((state) => state.auth);

    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith("/admin");

    let session = null;

    if (isAdminRoute) {
    session = admin;
    } else {
    session = user;
    }

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleAdminLogout = () => {
        dispatch(logoutAdmin());
        navigate('/admin/login');
    };

    const handleUserLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar__inner">
                <Link to={isAdminRoute ? '/admin/home' : '/'} className="navbar__brand">UserMS</Link>

                <div className="navbar__links">
                    <Link to={isAdminRoute ? '/admin/home' : '/'} className="navbar__link">Home</Link>

                    {!session && (
                        <>
                            <Link to={isAdminRoute ? '/admin/login' : '/login'} 
                            className="navbar__link">Login</Link>
                            {!isAdminRoute && (
                                <Link to={'/register'} 
                                className="navbar__link navbar__link--accent">
                                    Register
                                </Link>
                            )}
                        </>
                    )}

                    {session && (
                        <>
                            <Link
                                to={isAdminRoute ? '/admin/profile' : '/profile'}
                                className="navbar__link"
                            >
                                Profile
                            </Link>

                            {session.role === 'admin' && (
                                <Link to={'/admin/dashboard'} className="navbar__link">
                                    Dashboard
                                </Link>
                            )}

                            <button
                                onClick={session?.role === 'admin' ? handleAdminLogout : handleUserLogout}
                                className="navbar__logout btn btn--secondary btn--sm"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;