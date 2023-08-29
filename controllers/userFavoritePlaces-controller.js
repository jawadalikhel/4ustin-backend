const { validationResult } = require('express-validator');
const UserFavoritePlace = require('../models/userFavoritePlace');
const HttpError = require('../models/http-error');
const { default: mongoose } = require('mongoose');

const createFavoritePlace = async (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(
            new HttpError('Invalid data passed, please check your data.', 422)
        )
    };

    const {name, photo, rating, userRatingTotal, address, coordinates, creator} = req.body;
    const createdFavPlace = new UserFavoritePlace({
        name,
        photo,
        rating,
        userRatingTotal,
        address,
        coordinates,
        creator
    })

    try {
        await createdFavPlace.save()
    } catch (err) {
        console.log(err, "<----- errr")
        const error = new HttpError(
            'Adding Place to Favorites faild, please try again.', 500
        )
        // to stop the code execution incase we have an error
        // if we don't add next(error) the code execution will continue even if we have an error
        return next(error);
    }
    res.status(201).json({favoritePlaces: createdFavPlace});

}

const getFavoritePlacesByUserId = async (req, res, next) =>{
    const userId = req.params.uid;
    console.log(userId, "<----- userId")
    let places;
    try {
        places = await UserFavoritePlace.find({creator: userId})
        console.log(places, "<------")
    } catch (err) {
        const error = new HttpError(
            'Getting users favorite places failed, please try again.', 500
        )
        return next(error);
    }

    if(!places){
        return next(
            new HttpError('Cound not find user favorites for the provided user id', 404)
        )
    }
    // we use the getters to make sure that the underscore from our id property is removed
    res.json({places: places.map(place => place.toObject({getters: true}))});
}

const deleteFavoritePlace = async (req, res, next) =>{
    const placeId = req.params.pid;

    let place;
    try {
        // populate() allows us to refer to a document stored in another Collection and to work
        // with data in that existing document of that other collection
        place = await UserFavoritePlace.findById(placeId).populate('creator');
        console.log(place, "<----- place 1")
    } catch (err) {
        const error = new HttpError(
            'Something went wronng, could not delete place.', 500
        )
        return next(error);
    }

    if(!place){
        const error = new HttpError('Could not find favorite place for this id.', 404)
        return next(error);
    }

    try {
        // sess is the current session
        const sess = await mongoose.startSession();
        // 
        sess.startTransaction();
        // remove place from the UserFavoritePlace collection
        await place.deleteOne({ session: sess });
        // remoce place from the user collection
        // Ensure the place.creator is populated and the UserFavoritePlace array is an array of ObjectIds
        if (place.creator && Array.isArray(place.creator.UserFavoritePlace)) {
            // Remove the place reference from the user's UserFavoritePlace array
            const placeIndex = place.creator.UserFavoritePlace.indexOf(place._id);
            if (placeIndex !== -1) {
                place.creator.UserFavoritePlace.splice(placeIndex, 1);
                await place.creator.save({ session: sess });
            }
        }

        await sess.commitTransaction();
    } catch (err) {
        console.log(err, "<---- err")
        return next(err);
    }

    res.status(200).json({message: 'Deleted place.'})
}




exports.getFavoritePlacesByUserId = getFavoritePlacesByUserId;
exports.createFavoritePlace = createFavoritePlace;
exports.deleteFavoritePlace = deleteFavoritePlace;