const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const Listing = require('./models/listing');
const Resize = require('./models/resize');
const redis = require('redis');
// let fs = require('fs');

const port = 8000; //changed to 8000
const secretKey = 'secretKey'; // for jwt

const KafkaProducer = require('./KafkaProducer.js');
const producer = new KafkaProducer('my_topic');
producer.connect(() => console.log('Connected to Kafka'));

const app = express();
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
// app.use(express.json());

const url = process.env.MONGO_HOST || 'mongodb://localhost:27017';

mongoose    // connecting to user database
 .connect(url + '/sisDB')
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));

const client = redis.createClient({ host: process.env.REDIS_HOST || 'localhost' }); // conncting to redis
console.log('Redis connected!');

app.get('/', (req, res) => res.send('Listing Service'));

// route to get all listings for feed / home page
app.get('/listing/getAll', (req, res) => {
    Listing.find((err, doc) => {
        if (err)
            return res.status(400).send('Error retrieving listings');
        res.status(200).json(doc); // sending the listings in JSON array
    });
});

// route to get an individual listing
app.get('/listing/get/:id', (req, res) => {
    const { id } = req.params // retreive the id from the url
    if (id.length !== 24)
        return res.status(400).send('Invalid listing id');

    Listing.findById(id, (err, doc) => { // finding a single listing
        if (err)
            return res.status(400).send('Error retrieving listing');
        if (doc == null)
            return res.status(400).send('No listing found!') // no listing for the corresponding id
        res.status(200).json(doc); // sending the listing as a JSON obj
    });
});

app.post('/listing/upload', authenticateToken, (req, res) => {
    const userId = userID(req);

    // only storing fields from hw, can always add more
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const type = req.body.type;
    const imageInfo = req.body.imageInfo;
    const thumbnailUrl = req.body.thumbnailUrl;

    const newList = new Listing(); // creating a listing model
    newList.userID = userId;
    newList.title = title;
    newList.description = description;
    newList.price = price;
    newList.type = type;
    newList.image = imageInfo;
    newList.thumbnail = thumbnailUrl;

    // newList.image.data = fs.readFileSync(image);
    // newList.image.contentType = 'image/png';

    newList.save((err, listing) => { // add listing to db
        if(err)
            return res.status(400).send('Error uploading listing');
        client.publish('listing', 'Listings updated');
        res.status(200).send({listingId: listing._id});
    });
 });

// route to edit a listing
app.post('/listing/edit/:id', authenticateToken, (req, res) => {
    // Should check User ID to make sure edited listing belongs to user
    const userId = userID(req);

    const { id } = req.params // retreive the id from the url

    // find corresponding document matching the id
    Listing.findOne({_id: id,  userID: userId}, (err, doc) => { // checking id from collection and checking correct user is editing
        if (err) {
            console.error(err)
            return res.status(400).send('Error editing listing!') // database error
        } else if (doc == null) {
            return res.status(400).send('No listing found!') // no listing for the corresponding id
        }
        else {
            // if there is a listing
            Listing.updateOne({ _id: id}, // updating the entry for that id
                {
                    // if there is a new value, use the new value, otherwise, we're keeping the old value
                    title: 'title' in req.body ? req.body.title : doc.title,
                    description: 'description' in req.body ? req.body.description : doc.description,
                    price: 'price' in req.body ? parseFloat(req.body.price) : doc.price,
                    type: 'type' in req.body ? req.body.type : doc.type,
                    image: 'image' in req.body ? req.body.image : doc.image

                    // should also update thumbnail if image is updated
                }, (err, _) => {
                if (err) {
                    console.log(err)
                    return res.status(400).send('Error editing listing!') // database error 
                }
                else {
                    client.publish('listing', 'Listings updated');
                    return res.status(200).send('Successfully edited the listing!')  
                }
            })  
        }
    })
});

// adding a listing to test deleting it
app.post('/listing/testCreate', authenticateToken, (req, res) => {
    const userId = userID(req); // getting the user from session

    const newListing = new Listing(); // creating a user model
    newListing.userID = userId;
    newListing.thumbnail = 'smallPicture';
    newListing.image = 'picture';
    newListing.type = 'test';
    newListing.price = 1;
    newListing.description = 'test';
    newListing.title= 'test';

    newListing.save((err, newListing) => { // adding user to database
        if(err){
            console.log(err);
            return res.send(err);
        }
        client.publish('listing', 'Listings updated');
        res.send('listingID: ' + newListing._id);
    });
});

// route to delete a listing
app.post('/listing/delete/:id', authenticateToken, (req, res) => {
    const userId = userID(req); // getting the user from session
    const { id } = req.params; // retreive the id from the url

    Listing.findOne({ _id: id,  userID: userId}, (err, doc) => { // checking if listing exists before deleting
        if (err)
            return res.status(400).send('Error finding listing'); // if error finding listing
        if (doc === null)
            return res.status(404).send('Listing not found'); // if listing doesnt exist in db
        
        // if listing exists, delete it
        Listing.deleteOne({ _id: id,  userID: userId}, (err) => { // finding listing by that user
            if(err) {
                console.log(err);
                return res.status(400).send('Error deleting listing'); // if error deleting
            }
            client.publish('listing', 'Listings updated');
            res.status(200).send('Deleted listing ' + id);
        });
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

// route for uploading a resized image
app.post('/listing/upload_resized', (req, res) => {

    // getting the parameters from the body
    const original = req.body.original;
    const resized = req.body.resized;
    const dimension = req.body.dimension;

    const newDocument = new Resize(); // creating a resized image model
    newDocument.original = original;
    newDocument.resized = resized;
    newDocument.dimension = dimension;
    
    // adding a document to the database for each image uploaded
    newDocument.save((err, newDoc) => { 
        if(err){
            console.log(err);
            return res.send(err);
        }
        res.send('documnent ID: ' + newDoc._id);
    });
});

// route for sending to Kafka queue
app.post('/listing/kafka_send', (req, res) => {

    // getting the parameters from the body
    const original = req.body.original;
    const resized = req.body.resized;
    const dimension = req.body.dimension;

    // send to kafka queue
    producer.send(JSON.stringify({
        original,
        resized,
        dimension
    }));

    res.send('sent to kafka queue');
    
});

app.listen(port, () => console.log(`Listing Service listening on port ${port}`));
