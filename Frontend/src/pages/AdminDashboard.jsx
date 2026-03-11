import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Swal from "sweetalert2";
import {
    addUser, clearUserError, editUser,
    fetchUsers, removeUser, setPage, setSearch
} from '../features/users/userSlice';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [editingUser, setEditingUser] = useState(null);
    const [editData, setEditData] = useState({ name: "", email: "", role: "user" });
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const { users, isLoading, isError, message, search, page, pages } = useSelector(
        (state) => state.users
    );

    const [searchInput, setSearchInput] = useState(search);

    const [formData, setFormData] = useState({
        name: "", email: "", password: "", role: "user",
    });

    const [formError, setFormError] = useState("");
    const [editFormError, setEditFormError] = useState("");

    useEffect(() => {
        dispatch(fetchUsers(search));
    }, [dispatch, search, page]);

    const handleDelete = (id) => {
        Swal.fire({
            title: "Delete user?",
            text: "This action cannot be undone.",
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            icon: undefined,
            customClass: {
                popup: "swal-popup",
                title: "swal-title",
                htmlContainer: "swal-text",
                confirmButton: "swal-confirm",
                cancelButton: "swal-cancel",
            },
            buttonsStyling: false,
        }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await dispatch(removeUser(id));

            if (removeUser.fulfilled.match(res)) {
                
                if(users.length === 1 && page > 1){
                    dispatch(setPage(page - 1));
                }else{
                    dispatch(fetchUsers());
                }
            }
        }
    });
    };

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handleChange = (e) => {
        setFormError("");
        setFormData({ ...formData, [e.target.name]: e.target.value });
        dispatch(clearUserError());
    };

    const handleEditClick = (user) => {
        setEditingUser(user._id);
        setEditData({ name: user.name, email: user.email, role: user.role });
    };

    const handleEditChange = (e) => {
        setEditFormError("");
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const nameRegex = /^[A-Za-z_]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/;
    
    const handleUpdate = async (id) => {

        const name = editData.name.trim();
        const email = editData.email.trim();

        if(!name){
            setEditFormError("Name cannot be empty");
            return;
        }
        if(name.length < 3){
            setEditFormError("Name must be atleast 3 characters");
            return
        }

        if(!nameRegex.test(name)){
            setEditFormError("Name can contain only letters and underscores");
            return;
        }
        if(!email){
            setEditFormError("Please enter a valid email");
            return;
        }

        if(!emailRegex.test(email)){
            setEditFormError("Please enter a valid email address");
            return;
        }
        setEditFormError("");

        const result = await dispatch(editUser({id, userData: editData}))
        if(editUser.fulfilled.match(result)){
            setEditingUser(null);
        }
    };


    const handleCreate = async (e) => {
        e.preventDefault();

        const name = formData.name.trim();
        const email = formData.email.trim();
        const password = formData.password.trim();

        if(!name || !email || !password){
            setFormError("All fields are required");
            return;
        }

        if(name.length < 3){
            setFormError("Name must be atleast 3 characters");
            return;
        }

        if(!nameRegex.test(name)){
            setFormError("Name can contain only letters and underscores");
            return;
        }

        if (!emailRegex.test(email)) {
            setFormError("Please enter a valid email address");
            return;
        }

        if(password.length < 6){
            setFormError("Password must be at least 6 characters");
            return;
        }

        if (!passwordRegex.test(password)) {
            setFormError(
                "Password must contain at least 1 uppercase letter, 1 number, and 1 special character"
            );
            return;
        }

        setFormError("")
        const result = await dispatch(addUser(formData))
        if(addUser.fulfilled.match(result)){
            setFormData({ name: "", email: "", password: "", role: "user" });

            dispatch(fetchUsers());
        }

    };

    useEffect(()=>{
        const timer = setTimeout(()=>{
            const cleanedSearch = searchInput.trim()

            dispatch(setSearch(cleanedSearch));
            dispatch(setPage(1));
        },400)

        return () => clearTimeout(timer);
    },[searchInput, dispatch])

    return (
        <div className="page admin-dashboard">
            <h2 className="admin-dashboard__heading">Admin Dashboard</h2>

            {/* Create User Form */}
            <section className="admin-dashboard__section">
                <h3 className="admin-dashboard__section-title">Create User</h3>
                {isLoading && <p className="admin-dashboard__loading">Loading…</p>}
                {formError && <p className="alert alert--error">{formError}</p>}
                {!formError&& isError && <p className="alert alert--error">{message}</p>}

                <form onSubmit={handleCreate} className="admin-dashboard__form">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                    <div className="auth-card__field password-field">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
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
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="form-input form-select"
                        disabled
                    >
                        <option value="user">User</option>
                    </select>
                    <button type="submit" className="btn btn--primary">Create</button>
                </form>
            </section>

            {/* Search */}
            <section className="admin-dashboard__section search-wrapper">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by name or email"
                        value={searchInput}
                        onChange={handleSearchChange}
                        className="form-input admin-dashboard__search"
                    />
                    {searchInput && (
                        <span
                            className="search-clear"
                            onClick={() => setSearchInput("")}
                        >
                            ✕
                        </span>
                    )}
                </div>
            </section>

            {/* User List */}
            <section className="admin-dashboard__section">
                <div className="user-list">
                    {isLoading && <p className="admin-dashboard__loading">Searching…</p>}
                    {!isLoading && users.length === 0 && (
                        <p className="admin-dashboard__loading">
                            No users found.
                        </p>
                    )}
                    {users.map((user) => (
                        <div key={user._id} className="user-list__item">
                            {editFormError && editingUser === user._id && (
                                <p className="alert alert--error">{editFormError}</p>
                            )}
                            {!editFormError && isError && editingUser === user._id && (
                                <p className="alert alert--error">{message}</p>
                            )}
                            {editingUser === user._id ? (
                                <div className="user-list__edit-row">
                                    <input
                                        name="name"
                                        value={editData.name}
                                        onChange={handleEditChange}
                                        className="form-input user-list__edit-input"
                                    />
                                    <input
                                        name="email"
                                        value={editData.email}
                                        onChange={handleEditChange}
                                        className="form-input user-list__edit-input"
                                    />
                                    <select
                                        name="role"
                                        value={editData.role}
                                        onChange={handleEditChange}
                                        className="form-input form-select user-list__edit-select"
                                        disabled
                                    >
                                        <option value="user">User</option>
                                        {/* <option value="admin">Admin</option> */}
                                    </select>
                                    <div className="user-list__actions">
                                        <button onClick={() => handleUpdate(user._id)} className="btn btn--primary btn--sm">Save</button>
                                        <button onClick={() => setEditingUser(null)} className="btn btn--secondary btn--sm">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="user-list__view-row">
                                    <div className="user-list__info">
                                        <span className="user-list__name">{user.name}</span>
                                        <span className="user-list__email">{user.email}</span>
                                        {/* <span className={`user-list__badge user-list__badge--${user.role}`}>{user.role}</span> */}
                                    </div>
                                    <div className="user-list__actions">
                                        <button onClick={() => handleEditClick(user)} className="btn btn--secondary btn--sm">Edit</button>
                                        <button onClick={() => handleDelete(user._id)} className="btn btn--danger btn--sm">Delete</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Pagination */}
            {pages > 1 && (
                <div className="pagination">
                    {[...Array(pages).keys()].map((x) => (
                        <button
                            key={x + 1}
                            onClick={() => dispatch(setPage(x + 1))}
                            className={`pagination__btn${page === x + 1 ? ' pagination__btn--active' : ''}`}
                        >
                            {x + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;