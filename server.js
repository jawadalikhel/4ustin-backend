const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

// routes
const PlacesRoutes = require('./routes/places-routes');
const UsersRoutes = require('./routes/users-routes');
const UserFavoritePlaces = require('./routes/userFavoritePlaces-routes');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next()
})

app.use('/api/places' ,PlacesRoutes);
app.use('/api/users-auth', UsersRoutes);
app.use('/api/favorites', UserFavoritePlaces);


// if a route is not found then throw this error
app.use((req, res, next) =>{
    const error = new Error('Could not find this route,', 404);
    throw error;
});

app.use((error, req, res, next) =>{
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occured!'});
});

// const url = process.env.mongodbConnectionString;
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@4ustin-cluster.cdmdgjq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const PORT = 5000;
mongoose
    .connect(url, 
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
        app.listen(PORT, () => console.log("Server up and running, Connected to DB"));
    })
    .catch((error) => console.log(error))
