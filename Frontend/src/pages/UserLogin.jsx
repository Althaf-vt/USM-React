import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, reset } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import './UserLogin.css';

function UserLogin() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [formError, setFormError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    const onChange = (e) => {
        setFormError("");
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const onSubmit = (e) => {
        e.preventDefault();
        const email = formData.email.trim();
        const password = formData.password.trim();

        if(!email && !password){
            setFormError("All fields are required");
            return 
        }

        if(!email){
            setFormError("Email field should not be empty");
            return;
        }

        if(!password){
            setFormError("Password field should not be empty");
            return
        }

        if(!emailRegex.test(email)){
            setFormError("Please enter a valid email address");
            return;
        }
        
        setFormError("")
        dispatch(loginUser(formData));
    };

    useEffect(() => {
        if (user) {
            navigate('/');
        }
        
        if (isError) {
            const timer = setTimeout(() => {
                dispatch(reset());
            }, 5000); // 3 seconds

            return () => clearTimeout(timer);
        }

    }, [user, navigate, dispatch, isError]);

    return (
        <div className="page auth-page">
            <div className="auth-card">
                <div className="auth-card__header">
                    <h2 className="auth-card__title">Sign in</h2>
                    <p className="auth-card__subtitle">Enter your credentials to continue</p>
                </div>

                {formError && <p className="alert alert--error">{formError}</p>}
                {!formError &&  isError && <p className="alert alert--error">{message}</p>}

                <form onSubmit={onSubmit} className="auth-card__form">
                    <div className="auth-card__field">
                        <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            onChange={onChange}
                            value={formData.email}
                            className="form-input"
                        />
                    </div>
                    <div className="auth-card__field password-field">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={onChange}
                            className="form-input"
                        />
                        <span
                            className="toggle-password"
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? "🙈" : "👁"}
                        </span>
                    </div>
                    <button type="submit" disabled={isLoading} className="btn btn--primary auth-card__submit">
                        {isLoading ? "Signing in…" : "Sign in"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UserLogin;