import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { getAllUsers, deleteUser } from '../api';
import { NotificationManager, NotificationContainer } from 'react-notifications';
import { jwtDecode } from 'jwt-decode';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [authorities, setAuthorities] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate("/login", { state: { message: 'You need to login first.', title: 'Login Required' } });
            return;
        }
        
        const decodedToken = jwtDecode(token);
        const userAuthorities = decodedToken.authorities;
        setAuthorities(userAuthorities);

        if (userAuthorities !== "ADMIN") {
            navigate("/profile", { state: { message: 'You are not authorized.', title: 'Unauthorized' } });
            return;
        }

        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                setUsers(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUsers();
    }, [navigate]);

    const confirmDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                if (authorities === "ADMIN") {
                    const deletedUserDetails = users.find(user => user.id === userId);
                    await deleteUser(userId);
                    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                    NotificationManager.success(`${deletedUserDetails.firstname} ${deletedUserDetails.lastname} was deleted`, 'Deleted', { timeOut: 3000 });
                } else {
                    NotificationManager.error("You do not have permission to delete users", "Permission Denied", 3000);
                }
            } catch (error) {
                NotificationManager.error('Error deleting user:', `${error.message}`, { timeOut: 3000 });
            }
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="container">
            <NotificationContainer />
            {window.history.replaceState({},"")}
            <div className="col-md-6">
                <h2 className="text-info mb-4">Users</h2>
                {users.map((user) => (
                    <div key={user.id} className="color mb-3">
                        <>FirstName: {user.firstname} <br/>lastname: {user.lastname}<br/> Email: {user.email}</>

                        { user.role !=="ADMIN" &&(
                            <button className="btn btn-danger ml-3" onClick={() => confirmDelete(user.id)}>Delete</button>
                        )
                        }
                    </div>
                ))}
            </div>
            <span className="pull-right"><Link to="/ADMIN" className="btn btn-info">Back</Link></span>
        </div>
    );
};

export default AllUsers;
