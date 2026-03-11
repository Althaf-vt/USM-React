import React from 'react'
import { useSelector } from 'react-redux'
import './HomePage.css';

const AdminHomePage = () => {
    const { admin } = useSelector((state) => state.auth);

    return (
        <div className="page home-page">
            <div className="home-page__hero">
                <h1 className="home-page__title">
                    {admin ? `Welcome back, ${admin.name}.` : 'User Management System'}
                </h1>
                <p className="home-page__subtitle">
                    {admin
                        ? `You're signed in as ${admin.role}.`
                        : 'Please log in or register to continue.'}
                </p>
            </div>
        </div>
    );
};

export default AdminHomePage;