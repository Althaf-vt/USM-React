import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [formError, setFormError] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    const onChange = (e) => {
        setFormError("")
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const nameRegex = /^[A-Za-z_]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/;

    const onSubmit = (e) => {
        e.preventDefault();

        const name = formData.name.trim();
        const email = formData.email.trim();
        const password = formData.password.trim();
        const confirmPassword = formData.confirmPassword.trim();

        if(!name || !email || !password || !confirmPassword){
            setFormError("All fields are required");
            return
        }

        if(name.length < 3){
            setFormError("Name must be atleast 3 characters");
            return;
        }

        if(!nameRegex.test(name)){
            setFormError("Name can contain only letters and underscores");
            return;
        }

        if(!emailRegex.test(email)){
            setFormError("Please enter a valid email address");
            return;
        }

        if(password.length < 6 ){
            setFormError('Password must be at least 6 characters');
            return
        }

        if(!passwordRegex.test(password)){
            setFormError(
                "Password must contain at least 1 uppercase letter, 1 number, and 1 special character"
            );
            return;
        }
        
        if(password !== confirmPassword){
            setFormError("Passwords do not match");
            return
        }
        setFormError("");
        dispatch(register(formData));
    };

    useEffect(() => {
        if (isSuccess) {
            navigate('/login');
        }
        return () => {
            dispatch(reset());
        };
    }, [isSuccess, navigate, dispatch]);

    // useEffect(()=> {
    //     return () => {
    //         setFormError("")
    //     }
    // },[formData])

    return (
        <div className="page auth-page">
            <div className="auth-card">
                <div className="auth-card__header">
                    <h2 className="auth-card__title">Create account</h2>
                    <p className="auth-card__subtitle">Fill in the details below to get started</p>
                </div>

                {formError && <p className="alert alert--error">{formError}</p>}

                {isError && !formError && (
                    <p className="alert alert--error">{message}</p>
                )}

                <form onSubmit={onSubmit} className="auth-card__form">
                    <div className="auth-card__field">
                        <input
                            type="text"
                            onChange={onChange}
                            placeholder="Name"
                            name="name"
                            value={formData.name}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="auth-card__field">
                        <input
                            onChange={onChange}
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="auth-card__field password-field">
                        <input
                            type={showPassword ? "text" : "password"}
                            onChange={onChange}
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            required
                            className="form-input"
                        />
                        <span
                            className="toggle-password"
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? "🙈" : "👁"}
                        </span>
                    </div>
                    <div className="auth-card__field password-field">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            onChange={onChange}
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            required
                            className="form-input"
                        />
                        <span
                            className="toggle-password"
                            onClick={() => setShowConfirmPassword(prev => !prev)}
                        >
                            {showConfirmPassword ? "🙈" : "👁"}
                        </span>
                    </div>
                    <button type="submit" disabled={isLoading} className="btn btn--primary auth-card__submit">
                        {isLoading ? "Creating account…" : "Create account"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;