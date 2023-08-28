const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userFavoritePlacesSchema = new Schema({
    name: {type: String},
    photo: {type: String},
    rating: {type: String},
    userRatingTotal: {type: String},
    address: {type: String},
    location: {
        lat: {type: Number},
        lng: {type: Number}
    }
})

module.exports = mongoose.model('UserFavoritePlaces', userFavoritePlacesSchema);