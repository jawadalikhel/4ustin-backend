const { validationResult } = require('express-validator');
const User = require('../models/user');
const HttpError = require('../models/http-error');
const { default: mongoose } = require('mongoose');
const userFavoritePlace = require('../models/userFavoritePlace');

// Handling the creation of a favorite place
const addFavoritePlace = async (req, res, next) =>{
    try {
        // Validating request data using express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new HttpError('Invalid data passed, please check your data.', 422);
        }

        // Extracting and destructuring data from the request body
        const {
            name,
            photo,
            rating,
            userRatingTotal,
            address,
            coordinates,
            creator
        } = req.body;

        const createdFavPlace = new userFavoritePlace({
            name,
            photo,
            rating,
            userRatingTotal,
            address,
            coordinates,
            creator
        })

        let user;
        try {
            user = await User.findById(creator);
        } catch (err) {
            const error = new HttpError(
                'Adding to Favorite place failed, please try again', 500
            )
            return next(error);
        }

        // if user is not in our DB
        if(!user){
            const error = new HttpError('Could not find user for provided id', 404);
            return next(error);
        }

        try {
            const sess = await mongoose.startSession();
            sess.startTransaction();
            await createdFavPlace.save({session: sess});
            user.favoritePlaces.push(createdFavPlace);
            await user.save({session: sess});
            await sess.commitTransaction();
            
        } catch (error) {
            console.log(error, "<---- error with saving to userFavorites")
        }

        // Sending a response indicating success
        res.status(201).json({ favoritePlaces: createdFavPlace });
    } catch (err) {
        console.error(err, "<----- errr");
        // Stopping the code execution in case of an error
        const error = new HttpError('Adding Place to Favorites failed, please try again.', 500);
        return next(error);
    }
}

// Retrieving favorite places based on user ID
const getFavoritePlacesByUserId = async (req, res, next) =>{
    try {
        const userId = req.params.uid; // Extracting user ID from request parameters
        // Finding user's favorite places in the database
        const places = await userFavoritePlace.find({ creator: userId });

        if (!places) {
            return next(
                new HttpError('Cound not find OR there are no user favorites for the provided user id', 404)
            )
        }
        
        // Converting places to a format suitable for response and sending
        // Converting places to a format suitable for response and sending
        // we use the getters to make sure that the underscore from our id property is removed
        res.json({
            favoritePlaces: places.map(place => place.toObject({ getters: true })),
            message: "Found favorite places"
        });
    } catch (err) {
        console.error(err);
        const error = new HttpError(
            'Getting users favorite places failed, please try again.', 500
        );
        return next(error);
    }
}

// Deleting a favorite place
const deleteFavoritePlace = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;

    try {
        // Find the place to be deleted and populate the 'creator' field
        place = await userFavoritePlace.findById(placeId).populate('creator');

        if (!place) {
            const error = new HttpError('Could not find favorite place for this id.', 404);
            return next(error);
        }
        // Start a transaction using the mongoose session
        const sess = await mongoose.startSession();
        sess.startTransaction();
        // Remove the place from the userFavoritePlace collection
        await place.deleteOne({ session: sess });

        place.creator.favoritePlaces.pull(placeId);
        await place.creator.save({ session: sess });      

        // Commit the transaction
        await sess.commitTransaction();

        // Sending a response indicating successful deletion
        res.status(200).json({ message: 'Deleted place.' });
    } catch (err) {
        console.error(err);
        return next(err);
    }
};



exports.getFavoritePlacesByUserId = getFavoritePlacesByUserId;
exports.addFavoritePlace = addFavoritePlace;
exports.deleteFavoritePlace = deleteFavoritePlace;