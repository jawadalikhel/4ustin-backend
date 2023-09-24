const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userFavoritePlacesSchema = new Schema({
    name: {type: String},
    photo: {type: String},
    rating: {type: String},
    userRatingTotal: {type: String},
    address: {type: String},
    coordinates: {
        lat: {type: Number},
        lng: {type: Number}
    },
    creator: { type: mongoose.Types.ObjectId, ref: 'User' } // Reference to User model (as an array)
})

module.exports = mongoose.model('UserFavoritePlace', userFavoritePlacesSchema);