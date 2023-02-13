const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const Inquiry = require('./models/inquiry');
const Response = require('./models/response');
const redis = require('redis');

const port = 9000;
const secretKey = 'secretKey'; // for jwt

const app = express();
app.use(cookieParser());
app.use(express.json());

const url = process.env.MONGO_HOST || 'mongodb://localhost:27017';

mongoose    // connecting to user database
 .connect(url + '/sisDB')
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));

const client = redis.createClient({ host: process.env.REDIS_HOST || 'localhost' }); // conncting to redis
console.log('Redis connected!');

app.get('/', (req, res) => res.send('Inquiry Service'));

// get all inquiries for a listing
app.get('/inquiry/getAll/:id', authenticateToken, (req, res) => {
    const { id } = req.params // retreive the id from the url

    Inquiry.find({ listingID: id }, (err, doc) => { // checking if listing exists before getting
        if (err)
            return res.status(400).send('Error retrieving inquiries');
        res.status(200).json(doc); // sending the listings in JSON array
    });
});

// get all inquiries for admin
app.get('/inquiry/adminGetAllInquiries', authenticateToken, (req, res) => {

    Inquiry.find((err, doc) => {
        if (err)
            return res.status(400).send('Error retrieving all inquiries');
        res.status(200).json(doc); // sending the inquiries in JSON array
    });
});

// get all responses for admin
app.get('/inquiry/adminGetAllResponse', authenticateToken, (req, res) => {

    Response.find((err, doc) => {
        if (err) 
            return res.status(400).send('Error retrieving all responses')
        res.status(200).json(doc); // sending the responses in JSON array
    });
});

// get all inquiries from a single user
app.get('/inquiry/getAllInquiriesByUser', authenticateToken, (req, res) => {
    const userId = userID(req)

    Inquiry.find({ userID: userId }, (err, doc) => {
        if (err)
            return res.status(400).send('Error retrieving all inquiries by user');
        res.status(200).json(doc); // sending the inquiries in JSON array
    });
});

// get all responses from a single user
app.get('/inquiry/getAllResponsesByUser', authenticateToken, (req, res) => {
    const userId = userID(req)

    Response.find({ userID: userId }, (err, doc) => {
        if (err) 
            return res.status(400).send('Error retrieving all responses by user')
        res.status(200).json(doc); // sending the responses in JSON array
    });
});

// post a inquiry message to a lisitng
app.post('/inquiry/send/:id', authenticateToken, (req, res) => {
    const { id } = req.params // retreive the id from the url
    const userId = userID(req); // getting userID
    const username = userName(req); // getting userID

    const message = req.body.message; // message being sent

    const newInq = new Inquiry(); // creating a inquiry
    newInq.listingID = id;
    newInq.userID = userId;
    newInq.message = message;
    newInq.username = username;

    newInq.save((err, savedInq) => { // adding inquiry to database
        if (err)
            return res.status(400).send('Failed to send inquiry');
        client.publish('inquiry', 'Inquiries updated');
        res.status(200).send('Inquiry sent');
    });
});

// delete an inquiry
app.post('/inquiry/delete/:id', authenticateToken, (req, res) => {
    const userId = userID(req); // getting the user from session
    const { id } = req.params; // retreive the id from the url

    Inquiry.findOne({ _id: id,  userID: userId}, (err, doc) => { // checking if inquiry exists before deleting
        if (err)
            return res.status(400).send('Error finding inquiry'); // if error finding inquiry
        if (doc === null)
            return res.status(404).send('Inquiry not found'); // if inquiry doesnt exist in db
        
        // if inquiry exists, delete it
        Inquiry.deleteOne({ _id: id,  userID: userId}, (err) => { // finding inquiry by that user
            if(err) {
                console.log(err);
                return res.status(400).send('Error deleting inquiry'); // if error deleting
            }
            client.publish('inquiry', 'inquiry updated');
            res.status(200).send('Deleted inquiry ' + id);
        });
    });
});

// get all responses for a user's listing (for who posted it/ admin)
app.get('/inquiry/getAllResponses/:id', authenticateToken, (req, res) => {
    const { id } = req.params // retreive the listing id from the url

    Response.find({ listingID: id }, (err, doc) => { // checking if listing exists before getting responses
        if (err)
            return res.status(400).send('Error retrieving responses');
        res.status(200).json(doc); // sending the responses in JSON array
    });
});

// get all responses responding to a user (:recipientID) (for who is viewing/ inquiring)
app.get('/inquiry/getResponses/:id/:recipientID', authenticateToken, (req, res) => {
    const { id } = req.params // retreive the listing id from the url

    Response.find({ listingID: id, recipientID: recipientID }, (err, doc) => { // checking if listing exists before getting responses
        if (err)
            return res.status(400).send('Error retrieving responses');
        res.status(200).json(doc); // sending the responses in JSON array
    });
});

// post a response to an listing for an inquiry
// params - /listingID/inquiryID/inquiryID
app.post('/inquiry/respond/:id/:inquiryID/:recipientID', authenticateToken, (req, res) => {
    const { id, inquiryID, recipientID } = req.params // retreive the id from the url
    const userId = userID(req); // getting userID
    const username = userName(req); // getting userID

    const message = req.body.message; // message being sent

    const newRes = new Response(); // creating a response to an inquiry
    newRes.listingID = id;
    newRes.inquiryID = inquiryID;
    newRes.recipientID = recipientID;
    newRes.userID = userId;
    newRes.message = message;
    newRes.username = username;

    newRes.save((err, savedRes) => { // adding response to database
        if (err)
            return res.status(400).send('Failed to send response');
        client.publish('inquiry', 'Responses updated');
        res.status(200).send('Response sent');
    });
});

// EVERYTHING BELOW IS FROM THE BOTTOM OF AUTH.JS
// can also import this func and testAuth but copy/pasting for now
// must be logged in to upload a listing

// Functions useful for valdating / decoding user session

function userID (req) { // gets the userID from the session
    const token = req.cookies.token; // getting token from cookie
    let session = jwt.verify(token, secretKey); // decoding JWT
    return session.id;
}

function userName (req) { // gets the userID from the session
    const token = req.cookies.token; // getting token from cookie
    let session = jwt.verify(token, secretKey); // decoding JWT
    return session.username;
}

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

app.listen(port, () => console.log(`Inquiry Service listening on port ${port}`));