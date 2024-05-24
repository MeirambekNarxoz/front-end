import React from 'react';
import './css/style.css';

export default function NAV() {
    return (
        <nav className="navbar navbar-default">
            <div className="container">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a className="navbar-brand" href="/">REGISTER and Login Module</a>
                </div>
                <div className="collapse navbar-collapse" id="navbar-collapse">
                    <ul className="nav navbar-nav">
                        <li className="active"><a href="/">Home</a></li>
                        <li><a href="/login">Login</a></li>
                        <li><a href="/register">Register</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
