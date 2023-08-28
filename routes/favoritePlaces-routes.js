const express = require("express");

const router = express.Router();

const DUMMY_DATA = [
    {
        key: 'p1',
        id: 'p1',
        user: 'u1',
        name: 'Salty Sow',
        photo: 'photo',
        Rating: 4.6,
        userRatingTotal: 2713,
        location: 'United States',
        address: '1201 S Lamar Blvd, Austin, TX 78704, United States'
    }
]

router.get('/:placeId', (req, res, next) =>{
    const placeId = req.params.placeId;
    const place = DUMMY_DATA.find(p => {
        return p.id === placeId;
    })
    res.json({place: place});
})


module.exports = router;