import { Link, useNavigate, useParams } from "react-router-dom"; 
import { useState, useEffect } from "react";
import { getUserByID, updateUser } from '../api';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import '../css/style.css';

export default function ProfileUser() {
    const navigate = useNavigate();
    const { id } = useParams(); 
    const [user, setUser] = useState({
        firstname: '',
        lastname: '',
        age: '',
        email: '',
        newpassword: ''
    });
    const [message, setMessage] = useState(null);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate("/login", { state: { message: 'You need to login first.', title: 'Login Required' } });
            return;
        }
        const fetchUserData = async () => {
            try {
                const userData = await getUserByID(id);
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [id]);

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        try {
            const isPasswordEmpty = user.newpassword.trim() === '';
            await updateUser(id, isPasswordEmpty ? 
                {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    age: user.age,
                    email: user.email
                }
                : user 
            ); 
            navigate("/Profile", { state: { message: 'Profile updated successfully.', title: 'Update Successful' } });
        } catch (error) {
            setUser({
                ...user,
                newpassword: ''
            });
        }
    }

    useEffect(() => {
        if (message != null) {
            NotificationManager.error('Error updating profile:', message, 3000);
        }
    }, [message]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    }
    
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 col-md-offset-3">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h1 className="panel-title">Update Profile</h1>
                        </div>
                        <div className="panel-body">
                            <form onSubmit={handleSubmit} className="my-custom-form">
                                <NotificationContainer />
                                <div className="form-group">
                                    <label htmlFor="lastname">Last Name</label>
                                    <input id="lastname" className="form-control" name="lastname" placeholder="Enter Last Name" value={user.lastname} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="firstname">First Name</label>
                                    <input id="firstname" className="form-control" name="firstname" placeholder="Enter First Name" value={user.firstname} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="age">Age</label>
                                    <input id="age" type="text" name="age" className="form-control" placeholder="Enter Age" value={user.age} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input id="email" type="email" name="email" className="form-control" placeholder="Enter Email" value={user.email} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input id="password" type="password" name="newpassword" className="form-control" placeholder="Enter Password" value={user.newpassword} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <button type="submit" className="btn btn-success">Update</button>
                                    <Link to="/Profile" className="btn btn-info pull-right">Back</Link>
                                </div>
                                {message && (
                                    <h4 className="alert alert-danger">{message}</h4>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
