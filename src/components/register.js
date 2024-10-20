import { Link, useNavigate } from "react-router-dom";
import { useState ,useEffect} from "react";
import { registerUser } from '../api';  
import { NotificationContainer, NotificationManager } from 'react-notifications';
import '../css/register.css';

const RegisterComponent = () => { 
    const navigate = useNavigate();
    const [message, setMessage]  = useState(null)
    const [user, setUser] = useState({
        firstname: '',
        lastname: '',
        age: '',
        email: '',
        password: ''
    });

    const handleLastNameChange = (ev) => {
        setUser({ ...user, lastname: ev.target.value });
    }
    
    const handleFirstNameChange = (ev) => {
        setUser({ ...user, firstname: ev.target.value });
    }

    const handleAgeChange = (ev) => {
        setUser({ ...user, age: ev.target.value });
    }

    const handleEmailChange = (ev) => {
        setUser({ ...user, email: ev.target.value });
    }

    const handlePasswordChange = (ev) => {
        setUser({ ...user, password: ev.target.value });
    }

    const handleSubmit = async (ev) => {
        console.log(user)
        ev.preventDefault();
        if (user.age==null){
            setMessage("Age it should not be empty");
        }
        if(!user.lastname ||!user.firstname  ||!user.email||!user.password ){
            setMessage("All fields are required");
            return;
        }
        if (user.password.length < 6) {
            setMessage("Password must be at least 6 characters");
            return;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(user.email)) {
            setMessage("Please enter a valid email address");
            return;
        }
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
        if (!passwordPattern.test(user.password)) {
            setMessage("Please enter a valid password. Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, and one digit.");
            return;
        }
        try {
            const response = await registerUser(user);  
            if (response.token) {
                navigate("/", { state: { message: user.lastname + " was saved", title: 'Saved Good' } });
            }  
        } catch (error) {
            setUser({
                firstname: '',
                lastname: '',
                age: '',
                email: '',
                password: ''
            });
            setMessage(error.response.data)
        }
    }   
    useEffect(()=>{
        if(message != null){
            NotificationManager.error('Error logging in:', message, 5000);
        }
    }, [message])
    return (
        <div className="register-page">
    <div className="ring">
        <i style={{ '--clr': '#00ff0a' }}></i>
        <i style={{ '--clr': '#ff0057' }}></i>
        <i style={{ '--clr': '#fffd44' }}></i>
        <div className="login White">
            <div className="panel panel-default">
                <h1 className="panel-title">Registration</h1>
                <form onSubmit={handleSubmit} method="post" className="login-form">
                    <NotificationContainer />
                    {window.history.replaceState({}, "")}

                    <div className="inputBx">
                        <label htmlFor="lastname">Last Name</label>
                        <input id="lastname" className="form-control" name="lastname" placeholder="Enter Last Name" value={user.lastname} onChange={handleLastNameChange} />
                    </div>

                    <div className="inputBx">
                        <label htmlFor="firstname">First Name</label>
                        <input id="firstname" className="form-control" name="firstname" placeholder="Enter First Name" value={user.firstname} onChange={handleFirstNameChange} />
                    </div>

                    <div className="inputBx">
                        <label htmlFor="age">Age</label>
                        <input id="age" type="text" name="age" className="form-control" placeholder="Enter Age" value={user.age} onChange={handleAgeChange} />
                    </div>

                    <div className="inputBx">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" name="email" className="form-control" placeholder="Enter Email" value={user.email} onChange={handleEmailChange} />
                    </div>

                    <div className="inputBx">
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" name="password" className="form-control" placeholder="Enter Password" value={user.password} onChange={handlePasswordChange} />
                    </div>

                    <div className="inputBx input">
                        <input type="submit" className="btn" value="Register" />
                        <span className="pull-right">
                            Already registered? <Link to="/login" className="btn">Login</Link>
                        </span>
                        <span className="pull-right">
                            <Link to="/" className="btn">Back</Link>
                        </span>
                    </div>
                    {message != null && (
                        <h4 className="alert alert-danger">{message}</h4>
                    )}
                </form>
            </div>
        </div>
    </div>
    <div className="background-animation"></div>
</div>

    );
};
export default RegisterComponent;
