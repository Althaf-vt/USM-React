import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { reset, updateUserProfile } from '../features/auth/authSlice';
import './UserProfilePage.css';

const UserProfilePage = () => {
    
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [formError, setFormError] = useState("");

    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, [user]);

    const handleNameChange = (e) => {
        setFormError("")
        setName(e.target.value);
        setIsDirty(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if(!file) return;

        setFormError("")

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        if(!allowedTypes.includes(file.type)){
            setFormError("Only JPG, PNG, or WEBP images are allowed");
            return;
        }

        if(file.size > 5 * 1024 * 1024){
            setFormError("Image must be less than 5MB");
            return;
        }
        setFormError("");
        setImage(file);
        setIsDirty(true);
    };

    const nameRegex = /^[A-Za-z_]+$/;

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        if(!name.trim()){
            setFormError("Name cannot be emoty");
            return;
        }

        if(!nameRegex.test(name)){
            setFormError("Name can contain only letters and underscores");
            return;
        }

        if(image && image.size > 5 * 1024 * 1024){
            setFormError("Image must be less than 5MB");
            return;
        }

        formData.append("name", name);
        if (image) {
            formData.append('profileImage', image);
        }

        setFormError("")
        dispatch(updateUserProfile(formData));
        setIsDirty(false);
    };

    useEffect(() => {
        if (isSuccess) {
            setImage(null);

            const timer = setTimeout(() => {
                dispatch(reset());
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [dispatch, isSuccess]);

    return (
        <div className="page profile-page">
            <div className="profile-card">
                <div className="profile-card__header">
                    {user?.profileImage && (
                        <img
                            src={`http://localhost:5000${user.profileImage}?t=${Date.now()}`}
                            alt="profile"
                            width="150"
                            className="profile-card__avatar"
                        />
                    )}
                    <div>
                        <h2 className="profile-card__title">User Profile</h2>
                        <p className="profile-card__role">{user?.role}</p>
                    </div>
                </div>

                {formError && <p className="alert alert--error">{formError}</p>}
                {!formError && isError && <p className="alert alert--error">{message}</p>}
                {isSuccess && <p className="alert alert--success">Profile updated successfully.</p>}

                <form onSubmit={handleSubmit} className="profile-card__form">
                    <div className="profile-card__field">
                        <label className="profile-card__label">Display name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                            className="form-input"
                        />
                    </div>
                    <div className="profile-card__field">
                        <label className="profile-card__label">Profile image</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="profile-card__file-input"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!isDirty || isLoading}
                        className="btn btn--primary profile-card__submit"
                    >
                        {isLoading ? "Updating…" : "Save changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserProfilePage;