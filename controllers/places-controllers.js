const axios = require('axios');
const GOOGLE_API = process.env.GOOGLE_PLACES_API;

const fetchNearbyPlaces = async (req, res, next) => {
    // try-catch block to handle any potential errors.
      let places = [];
      try {
        const {lat, lon, queryFor, cityName} = req.body;
        // The "await" keyword indicates that the code will wait for the response before proceeding.
        // const response = await axios.get(`/nearbysearch/json?keyword=${queryForPlace}&location=${latitude},${longitude}&radius=2000&key=${API_KEY}`);
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?location=${lat}%2C${lon}&query=local%20${queryFor}%20in%20${cityName}&radius=5000&key=${GOOGLE_API}`)
        // Using the "reduce" function to process each result in the API response and accumulate data.
        // filteredPlaces in reduce represents the accumulator, which is the value that is gradually built up as the function
        // iterates through the array
        if(response.data.results){
          places = response.data.results.reduce((filteredPlaces, place) =>{
            if(place.rating >= 3.5 && place.user_ratings_total >= 5){
                // Extracting the photo reference from the first photo (if available) for the place.
              const photo = place.photos && place.photos.length > 0 ? place.photos[0].photo_reference : null;
              filteredPlaces.push({
                id: place.place_id,
                name: place.name,
                photo,
                rating: place.rating,
                userRatingTotal: place.user_ratings_total,
                address: place.formatted_address,
                location: place.geometry.location
              });
            }
            return filteredPlaces;
            
          },[]); // The initial value for the "reduce" function is an empty array.
        //   return placesData;
        }else{
          console.log("NO RESULTS FOUND IN THE API RESPONSE FOR PLACES");
        }
      } catch (error) {
        console.log(error, "<---- error in apiServices");
      }
      res.json({places})
    };

    exports.fetchNearbyPlaces = fetchNearbyPlaces;