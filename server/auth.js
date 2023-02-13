const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const User = require('./models/user');

const port = 7000;
const secretKey = 'secretKey'; // for jwt

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

const url = process.env.MONGO_HOST || 'mongodb://localhost:27017';

mongoose    // connecting to user database
 .connect(url + '/sisDB')
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));

// API for auth service, routes are /register and /login, logout is handled by deleting "token" cookie by frontend
app.get('/', (req, res) => res.send('Auth Service'));

app.post('/auth/register', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    const admin = req.body.admin;

    const newUser = new User(); // creating a user model
    newUser.email = email;
    newUser.password = password; 
    newUser.username = username;
    newUser.admin = admin;

    newUser.save((err, savedUser) => { // adding user to database
        if (err) {
            // validation/ errors
            if (err.code === 11000) {
                return res.status(400).send('Duplicate Email');
            }
            if (err.name === 'ValidationError') {
                return res.status(400).send('Invalid ' + Object.keys(err.errors));
            }
            else {
                return res.status(400).send('Failed to register');
            }
        }
        // maybe create a session here
        return res.status(200).send('User registered');
    });
});

app.post('/auth/login', async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email}, (err, user) => {
        if (err) {
            return res.status(400).send('Error logging in');
        }

        if (!user) { // if invalid email
            return res.status(404).send('No account for that email');
        }

        // validating password
        bcrypt.compare(password, user.password, (err, result) => {
            if (!result) {
                return res.status(400).send('Incorrect password');
            }
            else { // if correct credentials
                const token = jwt.sign({id: user._id, username: user.username, admin: user.admin}, secretKey, {expiresIn: '1h'}); // creating jwt "session"
                res.cookie('token', token, {httpOnly: true, maxAge: 60 * 60 * 1000}); // storing jwt session as a cookie
                return res.status(200).json({username: user.username, admin: user.admin, userID: user._id});
            }
        });
    });
});

// route to log a user out
app.post('/auth/logout', authenticateToken, (req, res) => {
    res.cookie('token', 'token', {maxAge: 0}); // deleting the session cookie
    res.status(200).send('User logged out');
});

// Testing routes to see how to use auth API

app.get('/testAuth', authenticateToken, (req, res) => { // testing if a user is logged in
    res.send('You Are Authorized!');
});

app.get('/testUserID', authenticateToken, (req, res) => { // testing userID(), 
    res.send(userID(req));
});

// Functions useful for valdating / decoding user session

function authenticateToken (req, res, next) { // middleware function to authenticate before accessing protected route
    const token = req.cookies.token; // getting token from cookie
    if (token == null) { // if no session
        return res.status(401).send('No auth token');
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) { // if incorrect auth token
            res.cookie('token', 'token', {maxAge: 0});
            return res.status(403).send('Invalid auth token');
        }
        // req.user = user; 
        next(); // continuing to route
    });
}

function userID (req) { // gets the userID from the session
    const token = req.cookies.token; // getting token from cookie
    let session = jwt.verify(token, secretKey); // decoding JWT
    return session.id;
}


app.listen(port, () => console.log(`Auth Service listening on port ${port}`));