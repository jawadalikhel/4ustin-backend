const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// routes
const favoritePlacesRoutes = require('./routes/favoritePlaces-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();
app.use(bodyParser.json());

app.use('/api/places' ,favoritePlacesRoutes);
app.use('/api/users', usersRoutes);


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

mongoose.
    connect('mongodb+srv://Jawad:cout<<Mongodb20@4ustin-cluster.cdmdgjq.mongodb.net/places?retryWrites=true&w=majority')
    .then(() =>{
        app.listen(5000, ()=>{
            console.log('Server Running On Port 5000 Connected to MondoDB');
        });
    })
    .catch(err =>{
        console.log(err)
    });