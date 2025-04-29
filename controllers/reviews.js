
const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req, res) => {
    //Review dene ke liye sabse pahla step yeh hai ki ham listing ko access krenge.
    let listing = await Listing.findById(req.params.id);
    //then listing ko accsess krne ke baad ham jo show.ejs me form banaya hai review dene ke liye jo ki ek object banaya hai toh usse jo data ayga usko newReview me store kra denge.
    let newReview = new Review(req.body.review);
    //user._id jo ki ek user ki id hai woh user ab author hoga newRview ka.
    newReview.author = req.user._id;
    //phir listing.js me hamne reviews naam ka array banaya hai jinme comment or rating store hogi toh is array me ham apne newReview ko add krdenge.
    listing.reviews.push(newReview);
    //phir ham apne database me save krlenge.
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
/* Yahan $pull operator use kiya gaya hai taaki reviews array se specific reviewId ko hata sake — sirf wahi value jo match kare, usi ko remove karta hai. Ye short aur efficient tarika hai array cleanup ka. */
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};