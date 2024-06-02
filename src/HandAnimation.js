import React from 'react';
import './css/HandAnimation.css';

const HandAnimation = () => {
    return (
        <div className="hand-container">
            <div className="hand">
                <div className="finger"></div>
                <div className="finger"></div>
                <div className="finger"></div>
                <div className="finger"></div>
                <div className="palm"></div>      
                <div className="thumb"></div>
            </div>
        </div>
    );
}

export default HandAnimation;
