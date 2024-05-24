import React, { useState } from 'react';
import { createSubscription } from '../api'; // Здесь необходимо импортировать функцию для создания подписки

const Subscription = () => {
    const [selectedSubscription, setSelectedSubscription] = useState(null);

    const handleSubscriptionChange = (event) => {
        const { value } = event.target;
        setSelectedSubscription(value);
    };

    const handlePayment = async () => {
        if (selectedSubscription) {
            try {
                await createSubscription(selectedSubscription);
            } catch (error) {
                console.error('Error creating subscription:', error.message);
            }
        } else {
            console.error('No subscription selected');
        }
    };

    return (
        <div>
            <h1>Subscription Types</h1>
            <div>
                <input
                    type="radio"
                    id="standard"
                    name="subscription"
                    value="STANDARD"
                    onChange={handleSubscriptionChange}
                />
                <label htmlFor="standard">Standard</label>
            </div>
            <div>
                <input
                    type="radio"
                    id="base"
                    name="subscription"
                    value="BASE"
                    onChange={handleSubscriptionChange}
                />
                <label htmlFor="base">Base</label>
            </div>
            <div>
                <input
                    type="radio"
                    id="premium"
                    name="subscription"
                    value="PREMIUM"
                    onChange={handleSubscriptionChange}
                />
                <label htmlFor="premium">Premium</label>
            </div>
            <button onClick={handlePayment}>Pay</button>
        </div>
    );
};

export default Subscription;
