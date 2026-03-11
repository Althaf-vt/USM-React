import React from 'react'
import { useSelector } from 'react-redux'
import './HomePage.css';

const HomePage = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="page home-page">
            <div className="home-page__hero">
                <h1 className="home-page__title">
                    {user ? `Welcome back, ${user.name}.` : 'User Management System'}
                </h1>
                <p className="home-page__subtitle">
                    {user
                        ? `You're signed in as ${user.role}.`
                        : 'Please log in or register to continue.'}
                </p>
            </div>
        </div>
    );
};

export default HomePage;