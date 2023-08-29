const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String, require: true},
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true, minLength: 6},
    places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'UserFavoritePlace' }]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);