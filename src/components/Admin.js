import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export default function ADMIN() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate("/login", { state: { message: 'You need to login first.', title: 'Login Required' } });
            return;
        } 
        const decodedToken = jwtDecode(token);
        const userAuthorities = decodedToken.authorities;
        if (userAuthorities !== "ADMIN") { 
            navigate("/profile", { state: { message: 'You are not authorized.', title: 'Unauthorized' } });
        }
        
        const fetchData = async () => {
            try {
                if (location.state) {
                    NotificationManager.success(location.state.message, location.state.title, 3000);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                NotificationManager.error("Failed to fetch data", "Error", 3000);
            }
        };
    
        fetchData();
    }, [location.state, navigate]);
    

    const handleLogout = () => {
        Cookies.remove('token');
        navigate("/", { state: { message: 'You have been logged out successfully.', title: 'Logout Successful' } });
    }

    return (
        <>
            <NotificationContainer />
            <Link to="/users" className="btn btn-secondary mr-2">GetAllUsers</Link>
            <Link to="/createfilms" className="btn btn-secondary">CreateFilms</Link>
            <Link to="/creategenre" className="btn btn-secondary">CreateGenre</Link>
            <div className="mt-4">
                <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            </div>
        </>
    );
}
