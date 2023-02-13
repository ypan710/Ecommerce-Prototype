import React from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Container, Row, Col, Image, Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import '../css/forms.css';
import { 
    setUserId, 
    setUsername, 
    setAdminStatus,
    setLoggedinStatus,
    setUserInformation } from '../redux/actions/userInfoActions';

const Login = (props) => {
    const validator = require('validator');
    const dispatch = useDispatch();

    const [email, setEmail] = React.useState('');
    const [validEmail, setValidEmail] = React.useState(false);
    const [password, setPassword] = React.useState('');
    const [validPassword, setValidPassword] = React.useState(false);

    const axiosToLogin = () => {
        const body = {
            email: email,
            password: password,
        }

        axios.post('/auth/login', body)
        .then((res) => {
            console.log("Success: ", res);
            let inOneHour = 1/24; // setting session to expire in 1 hour
            Cookies.set('session', JSON.stringify({username: res.data.username, userID: res.data.userID, admin: res.data.admin}), { expires: inOneHour });

            dispatch(setUserId(res.data.userID));
            dispatch(setUsername(res.data.username));
            dispatch(setAdminStatus(res.data.admin));
            dispatch(setLoggedinStatus(true));
            props.history.push("/");
        })
        .catch((err) => {
            console.log("Fail: ", err);
            dispatch(setLoggedinStatus(false));
        })
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setValidEmail(validator.isEmail(e.target.value));
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setValidPassword(e.target.value.length >= 4);
    }

    const handleSubmit = () => {
        axiosToLogin();
    }

  return (
    <div className="form-container" style={{ padding: "50px", marginTop: "75px" }}>
        <h2 className="form-heading" style={{ marginBottom: "20px" }}>Welcome Back!</h2>

        <Form style={{ minWidth: "300px" }}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="text" placeholder="Enter your email" onChange={handleEmailChange} value ={email}/>
                {validEmail ? 
                <div style={{ color: "Green", fontSize: ".875em", fontStyle: "italic" }}>
                    Email is valid.
                </div>
                :
                <div style={{ color: "Red", fontSize: ".875em", fontStyle: "italic" }}>
                    * Please enter a valid email.
                </div>
                }   
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={handlePasswordChange} value ={password}/>
                {validPassword ? 
                <div style={{ color: "Green", fontSize: ".875em", fontStyle: "italic" }}>
                    Password is valid.
                </div>
                :
                <div style={{ color: "Red", fontSize: ".875em", fontStyle: "italic" }}>
                    * Password must be at least 4 characters.
                </div>
                }   
            </Form.Group>
            <Button variant="primary" type="button" onClick={handleSubmit}>
                Submit
            </Button>
        </Form>
        <p className="form-input-reg">
            Don't have an account yet? Register{" "}
            <Link className="login-link" to="/registration">
            here.
            </Link>
        </p>
        </div>
  )
  
}

export default Login;