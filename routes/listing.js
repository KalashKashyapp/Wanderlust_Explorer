const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })  //ab multer hamari files ko jakar Bydefault hamari cloudinary ki storage me jake store krayga.


//For Searching
router.get('/search', listingController.searchListings);

//Index Route : router ke pas jaise he get req. Aaye hamare root route ke pas toh tab index naam ka callback fn hai jo execute ho jaye.
//Create Route : yeh ek post method ko accept krega aur isse ham apni new listing ko add kr paaynge.
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
);

//New Route :- Hame is new route me ek form milega jisse ham apni new listing ko add kr sakte hain.
router.get("/new",
    isLoggedIn,  
    listingController.renderNewForm
);

//Show Route :- har ek listing ka individually data dekh sakte hain.
//Update Route : Jo listing edit kri hamne usko ab ham update krdenga apne listings route me / database me.
//Delete Route: Apni banayi hui listing ko delete kr sakte hain through id.
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn, 
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete( 
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );     

//Edit Route:- is route me ham apni listing ko edit kr sakte hain jo ki ek post request lega aur phir usko put req. me convert krdega by "method-override" package.
router.get("/:id/edit", 
    isLoggedIn, 
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

module.exports = router;