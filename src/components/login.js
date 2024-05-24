import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';


const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState(null);

    const handleChange = (ev) => {
        const { name, value } = ev.target;
        setCredentials({ ...credentials, [name]: value });
    }

    const handleSubmit = async (ev) => {
        ev.preventDefault();

        if (!credentials.email || !credentials.password) {
            setMessage("All fields are required");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(credentials.email)) {
            setMessage("Please enter a valid email address");
            return;
        }

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
        if (!passwordPattern.test(credentials.password)) {
            setMessage("Please enter a valid password. Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, and one digit.");
            return;
        }

        try {
            const response = await loginUser(credentials);
            if (response.token) {
                Cookies.set('token', response.token, { expires: 7 });
                const authorities = jwtDecode(response.token).authorities;
                localStorage.setItem('token', response.token);
                const redirectPath = authorities === "ADMIN" ? "/ADMIN" : "/Profile";
                navigate(redirectPath, { state: { message: 'You have been logged in successfully.', title: 'Login Successful' } });
            } else {
                NotificationManager.error('Invalid username or password', 'Error logging in', 3000);
            }
        } catch (error) {
            console.error('Error logging in:', error.message);
            NotificationManager.error("Authentication failed!", "Error", 3000);
            setCredentials({
                email: '',
                password: ''
            });
        }
    }

    useEffect(() => {
        if (message != null) {
            NotificationManager.error('Error logging in:', message, 3000);
        }
    }, [message])

    return (
        <div>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <h1 className="text-center">User Login Page</h1>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit} className="my-custom-form" method="post">
                                    <NotificationContainer />
                                   {window.history.replaceState({},"")}

                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input id="email" type="text" className="form-control" name="email" placeholder="Enter Email" value={credentials.email} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <input id="password" type="password" className="form-control" name="password" placeholder="Enter Password" value={credentials.password} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" className="btn btn-primary btn-block" name="login-submit" id="login-submit">Log In</button>
                                    </div>
                                    <div className="form-group text-center">
                                        <span>New user? <Link to="/register" className="btn btn-link">Register</Link></span>
                                        <Link to="/" className="btn btn-link">Back</Link>
                                    </div>
                                    {message != null && (
                                        <h4 className="alert alert-danger">{message}</h4>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
