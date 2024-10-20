import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUserByID, updateUser, getAllSubscriptions, processPayment } from '../api';
import { NotificationContainer, NotificationManager } from 'react-notifications';

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
        const fetchUserData = async () => {
            try {
                const userData = await getUserByID(id);
                setUser({
                    ...userData,
                    subscribtion: userData.subscribtion ? userData.subscribtion.id : ''
                });
                setBalance(userData.balans || 0);
                setSubscriptionType(userData.subscribtion ? userData.subscribtion.name : '');
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
    }, [id]);

    useEffect(() => {
        if (user.subscribtion) {
            const selectedSubscription = subscriptions.find(sub => sub.id === parseInt(user.subscribtion));
            if (selectedSubscription) {
                setSubscriptionType(selectedSubscription.name);
            }
        }
    }, [user.subscribtion, subscriptions]);

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        try {
            const isPasswordEmpty = user.newpassword.trim() === '';
            const updatedUser = {
                firstname: user.firstname,
                lastname: user.lastname,
                age: user.age,
                email: user.email,
                subscribtion: { id: user.subscribtion }
            };
            if (!isPasswordEmpty) {
                updatedUser.password = user.newpassword;
            }
            await updateUser(id, updatedUser); 
            navigate("/Profile", { state: { message: 'Profile updated successfully.', title: 'Update Successful' } });
        } catch (error) {
            setUser({
                ...user,
                newpassword: ''
            });
        }
    };

    const handlePayment = async () => {
        try {
            const selectedSubscription = subscriptions.find(sub => sub.id === parseInt(user.subscribtion));
            if (!selectedSubscription) {
                throw new Error('Selected subscription not found');
            }

         
            const amount = selectedSubscription.amount;
            const result = await processPayment(id, selectedSubscription.name, amount);

            setBalance(prevBalance => prevBalance - amount);
            setUser({
                ...user,
                subscribtion: selectedSubscription.id
            });
            setSubscriptionType(selectedSubscription.name);

            NotificationManager.success('Payment processed successfully', 'Success', 3000);
        } catch (error) {
            console.error('Payment processing error:', error);
            setPaymentMessage('Error processing payment');
            NotificationManager.error('Error processing payment', 'Error', 3000);
        }
    };

    useEffect(() => {
        if (paymentMessage != null && paymentMessage === 'Payment processed successfully') {
            NotificationManager.success(paymentMessage, 'Success', 3000);
        } else if (paymentMessage != null) {
            NotificationManager.error(paymentMessage, 'Error', 3000);
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
                                {window.history.replaceState({}, "")}
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
