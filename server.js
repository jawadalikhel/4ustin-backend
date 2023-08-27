const express = require('express');
const bodyParser = require('body-parser');
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();
app.use(bodyParser.json());

app.use('/api/places' ,placesRoutes);
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

app.listen(5000, ()=>{
    console.log('Server Running On Port 5000');
});