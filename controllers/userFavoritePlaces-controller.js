const { validationResult } = require('express-validator');
const UserFavoritePlace = require('../models/userFavoritePlace');
const HttpError = require('../models/http-error');
const { default: mongoose } = require('mongoose');

// Handling the creation of a favorite place
const createFavoritePlace = async (req, res, next) =>{
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

        // Creating and saving a new instance of UserFavoritePlace model
        const createdFavPlace = await UserFavoritePlace.create({
            name,
            photo,
            rating,
            userRatingTotal,
            address,
            coordinates,
            creator
        });

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
        const places = await UserFavoritePlace.find({ creator: userId });

        if (!places || places.length === 0) {
            return next(
                new HttpError('Cound not find OR there are no user favorites for the provided user id', 404)
            )
        }
        // Converting places to a format suitable for response and sending
        // Converting places to a format suitable for response and sending
        // we use the getters to make sure that the underscore from our id property is removed
        res.json({
            places: places.map(place => place.toObject({ getters: true }))
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
const deleteFavoritePlace = async (req, res, next) =>{
    try {
        // Extracting place ID from request parameters
        const placeId = req.params.pid;

        // Finding the place to be deleted and populating the 'creator' field
        // populate() allows us to refer to a document stored in another Collection and to work
        // with data in that existing document of that other collection
        const place = await UserFavoritePlace.findById(placeId).populate('creator');

        if (!place) {
            const error = new HttpError('Could not find favorite place for this id.', 404)
            return next(error);
        }

        // Starting a transaction using the mongoose session
        const sess = await mongoose.startSession();
        sess.startTransaction();

        // Removing the place from the UserFavoritePlace collection
        await place.deleteOne({ session: sess });

        // Ensure the place.creator is populated and the UserFavoritePlace array is an array of ObjectIds
        if (place.creator && Array.isArray(place.creator.UserFavoritePlace)) {
            // Removing the place reference from the user's UserFavoritePlace array
            const placeIndex = place.creator.UserFavoritePlace.indexOf(place._id);
            if (placeIndex !== -1) {
                place.creator.UserFavoritePlace.splice(placeIndex, 1);
                await place.creator.save({ session: sess });
            }
        }

        // Committing the transaction
        await sess.commitTransaction();

        // Sending a response indicating successful deletion
        res.status(200).json({ message: 'Deleted place.' });
    } catch (err) {
        console.error(err);
        return next(err);
    }
}




exports.getFavoritePlacesByUserId = getFavoritePlacesByUserId;
exports.createFavoritePlace = createFavoritePlace;
exports.deleteFavoritePlace = deleteFavoritePlace;