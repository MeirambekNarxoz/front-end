import { Link, useNavigate, useParams } from "react-router-dom"; 
import { useState, useEffect } from "react";
import { getUserByID, updateUser, getAllSubscriptions, processPayment } from '../api';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import {jwtDecode} from "jwt-decode";

export default function ProfileUser() {
    const navigate = useNavigate();
    const { id } = useParams(); 
    const [balance, setBalance] = useState(0);
    const [subscriptions, setSubscriptions] = useState([]);
    const [user, setUser] = useState({
        firstname: '',
        lastname: '',
        age: '',
        email: '',
        newpassword: '',
        subscribtion: ''
    });
    const [subscriptionType, setSubscriptionType] = useState('');
    const [message, setMessage] = useState(null);
    const [paymentMessage, setPaymentMessage] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate("/login", { state: { message: 'You need to login first.', title: 'Login Required' } });
            return;
        }
    
        const decodedToken = jwtDecode(token);
        const balance = decodedToken.Balans;
        const subscriptionType = decodedToken.SUBSCRIBTION;
    
        setBalance(balance || 0);
        setSubscriptionType(subscriptionType || '');
    
        const fetchUserData = async () => {
            try {
                const userData = await getUserByID(id);
                setUser({
                    ...userData,
                    subscribtion: userData.subscribtion ? userData.subscribtion.id : ''
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
    
        const fetchSubscriptions = async () => {
            try {
                const subscriptionsData = await getAllSubscriptions();
                setSubscriptions(subscriptionsData);
            } catch (error) {
                console.error("Error fetching subscriptions:", error.message);
            }
        };
    
        fetchUserData();
        fetchSubscriptions();
    }, [id, navigate]);
    
    const handleSubmit = async (ev) => {
        ev.preventDefault();
        try {
            const isPasswordEmpty = user.newpassword.trim() === '';
            await updateUser(id, isPasswordEmpty ? 
                {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    age: user.age,
                    email: user.email,
                    subscribtion: user.subscribtion
                }
                : user 
            ); 
            navigate("/Profile", { state: { message: 'Profile updated successfully.', title: 'Update Successful' } });
        } catch (error) {
            setMessage('Error updating profile');
            setUser({
                ...user,
                newpassword: ''
            });
        }
    }

    const handlePayment = async () => {
        try {
            const selectedSubscription = subscriptions.find(sub => sub.id === parseInt(user.subscribtion));
            if (!selectedSubscription) {
                throw new Error('Selected subscription not found');
            }
            const amount = selectedSubscription.amount;
            const result = await processPayment(id, amount, selectedSubscription.name);

            await updateUser(id, {
                ...user,
                subscribtion: selectedSubscription.id
            });

            setPaymentMessage(result);
        } catch (error) {
            console.error('Payment processing error:', error);
            setPaymentMessage('Error processing payment');
        }
    };

    useEffect(() => {
        if (message != null) {
            NotificationManager.error('Error updating profile:', message, 3000);
        }
    }, [message]);

    useEffect(() => {
        if (paymentMessage != null) {
            NotificationManager.info('Payment Status:', paymentMessage, 3000);
        }
    }, [paymentMessage]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h3 className="card-title">Update Profile</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <NotificationContainer />
                                <div className="form-group">
                                    <label htmlFor="lastname">Last Name</label>
                                    <input id="lastname" className="form-control" name="lastname" placeholder="Enter Last Name" value={user.lastname || ''} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="firstname">First Name</label>
                                    <input id="firstname" className="form-control" name="firstname" placeholder="Enter First Name" value={user.firstname || ''} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="age">Age</label>
                                    <input id="age" type="text" name="age" className="form-control" placeholder="Enter Age" value={user.age || ''} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input id="email" type="email" name="email" className="form-control" placeholder="Enter Email" value={user.email || ''} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input id="password" type="password" name="newpassword" className="form-control" placeholder="Enter Password" value={user.newpassword || ''} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="subscribtion">Current Subscription</label>
                                    <p id="subscribtion" className="form-control-plaintext">{subscriptionType}</p>
                                </div>
                                <div className="form-group">
                                    <label>Balance: {balance}</label>
                                </div>
                                <div className="form-group">
                                    <button type="submit" className="btn btn-success">Update</button>
                                    <Link to="/Profile" className="btn btn-info float-right">Back</Link>
                                </div>
                                {message && (
                                    <div className="alert alert-danger mt-3">{message}</div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h3 className="card-title">Purchase Subscription</h3>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label htmlFor="subscribtionPurchase">Subscription Type</label>
                                <select id="subscribtionPurchase" name="subscribtionPurchase" className="form-control" value={user.subscribtion || ''} onChange={(e) => setUser({ ...user, subscribtion: e.target.value })}>
                                    <option value="" disabled>Select a subscription</option>
                                    {subscriptions.map(subscription => (
                                        <option key={subscription.id} value={subscription.id}>
                                            {subscription.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <button onClick={handlePayment} className="btn btn-primary">Pay for Subscription</button>
                            </div>
                            {paymentMessage && (
                                <div className="alert alert-info mt-3">{paymentMessage}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
