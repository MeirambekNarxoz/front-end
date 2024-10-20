import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

import '../css/login.css';

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
                // Cookies.set('token', response.token, { expires: 7 });
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
        <div className="login-page">
            <div className="ring">
                <i style={{ '--clr': '#00ff0a' }}></i>
                <i style={{ '--clr': '#ff0057' }}></i>
                <i style={{ '--clr': '#fffd44' }}></i>
                <div className="login">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit} className="login-form" method="post">
                        <NotificationContainer />
                        {window.history.replaceState({}, "")}

                        <div className="inputBx">
                            <input id="email" type="text" name="email" placeholder="Email" value={credentials.email} onChange={handleChange} />
                        </div>
                        <div className="inputBx">
                            <input id="password" type="password" name="password" placeholder="Password" value={credentials.password} onChange={handleChange} />
                        </div>
                        <div className="inputBx">
                            <input type="submit" value="Sign in" />
                        </div>
                        <div className="links">
                            <Link to="/register">Signup</Link>
                            <Link to="/">Back</Link>
                        </div>
                        {message != null && (
                            <h4 className="alert alert-danger">{message}</h4>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
