const express = require('express');
const userFavoritePlacesController = require('../controllers/userFavoritePlaces-controller');

const router = express.Router();

router.post('/user/addToFavorites', userFavoritePlacesController.createFavoritePlace);

router.get('/user/userFavoritePlaces/:uid', userFavoritePlacesController.getFavoritePlacesByUserId);

router.delete('/user/deletePlace/:pid', userFavoritePlacesController.deleteFavoritePlace);

module.exports = router;