const express = require("express");
const router = express.Router();

const Places = require('../models/places');
const placesController = require('../controllers/places-controllers')

router.post('/fetchPlaces', placesController.fetchNearbyPlaces);

module.exports = router;