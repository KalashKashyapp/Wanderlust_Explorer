const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //agar ham kisi route pe gaye (new ya edit ya update) but ham login nhi hai toh login hone ke baad ham usi route pe ajaye jispe ham jana chah rahe the.
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create a listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "🚫 Whoops! Looks like you can't edit a listing you don't own.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

/* Hamne ek middleware banaya hai jo listing ko validate krega. this is for server-side validation.*/ 
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body); 
    //req.body ko listing scehma se validate krake hamne error ko nikala or phir check kraya ki agar error hai toh ham ek custom error show kara de.
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else {
        next();
    }
};

/* Hamne ek middleware banaya hai jo Reviews ko validate krega. this is for server-side validation.*/ 
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body); 
    //req.body ko Review scehma se validate krake hamne error ko nikala or phir check kraya ki agar error hai toh ham ek custom error show kara de.
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "🚫 Whoops! Looks like you can't delete this review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};