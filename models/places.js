const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placesSchema = new Schema({
    location: {
        lat: {type: Number},
        lon: {type: Number}
    },
    queryFor: {type: String},
    cityName: {type: String}
})

module.exports = mongoose.model('Places', placesSchema);