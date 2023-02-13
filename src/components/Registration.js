import React from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Image, Form, Button } from 'react-bootstrap';
import '../css/forms.css';

const backendUrl = 'http://localhost:7000';

const Registration = (props) => {
  const validator = require('validator');

  const [username, setUsername] = React.useState('');
  const [validUsername, setValidUsername] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [validEmail, setValidEmail] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [validPassword, setValidPassword] = React.useState(false);
  const [admin, setAdmin] = React.useState();

  const axiosToRegistration = () => {
    const body = {
      email: email,
      password: password,
      username: username,
      admin: admin
    }

    axios.post('/auth/register', body)
      .then((res) => {
        console.log("Success: ", res);
        props.history.push("/Login");
      })
      .catch((err) => {
        console.log("Fail: ", err);
      })
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setValidUsername(e.target.value.length >= 1);
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setValidEmail(validator.isEmail(e.target.value));
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setValidPassword(e.target.value.length >= 4);
  }

  const handleAdminChange = (e) => {
    setAdmin(e.target.value);
  }

  const handleSubmit = () => {
    axiosToRegistration();
  }

  return (
    <div className="form-container" style={{ padding: "50px", marginTop: "75px" }}>
      <h4 className="form-heading" style={{ marginBottom: "20px" }}>Enter your information and start listing now!</h4>

      <Form style={{ minWidth: "300px" }}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Choose a username" onChange={handleUsernameChange} value={username} />
          {validUsername ?
            <div style={{ color: "Green", fontSize: ".875em", fontStyle: "italic" }}>
              Username is valid.
            </div>
            :
            <div style={{ color: "Red", fontSize: ".875em", fontStyle: "italic" }}>
              * Username needs to contain at least one character.
            </div>
          }
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="text" placeholder="Enter your email" onChange={handleEmailChange} value={email} />
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
          <Form.Control type="password" placeholder="Password" onChange={handlePasswordChange} value={password} />
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

        <Form.Group className="mb-3" controlId="formAdmin">
          <Form.Select onChange={handleAdminChange} value={admin}>
            <option>Select Admin or User</option>
            <option value='true'>Admin</option>
            <option value='false'>User</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="button" onClick={handleSubmit}>
          Submit
        </Button>

        <p className="form-input-reg">
          Already have an account? Login{" "}
          <Link className="login-link" to="/login">
            here.
          </Link>
        </p>
      </Form>

    </div>
  )

}

export default Registration;