const express = require('express');
const userFavoritePlacesController = require('../controllers/userFavoritePlaces-controller');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.use(checkAuth); //// every route below is protected by the checkAuth middleware, so only user's that are login have access to these routes for their accounts

router.post('/user/addToFavorites', userFavoritePlacesController.addFavoritePlace);

router.get('/user/userFavoritePlaces/:uid', userFavoritePlacesController.getFavoritePlacesByUserId);

router.delete('/user/deletePlace/:pid', userFavoritePlacesController.deleteFavoritePlace);

module.exports = router;