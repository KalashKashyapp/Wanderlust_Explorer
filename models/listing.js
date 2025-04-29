const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },    
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,    /*isme ham sare reviews ki object id ko array me store karaynge.*/ 
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        },
      },
    // category: {
    //     type: String,
    //     enum: [
    //         "Trending",
    //         "Rooms",
    //         "Iconic cities",
    //         "Farms",
    //         "Mansion",
    //         "Mountain",
    //         "Castle",
    //         "Pools",
    //         "Camping",
    //         "Caves",
    //         "Arctic"
    //     ],
    //     required: true
    // }     
});

//yeh ek mongoose middleware banaya hamne.
listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews }});
    }
    //Agar listing exist karti hai, toh jo listing ke review array ke andar jitni bhi reviews id hain toh unki ek list bana lenge or agar is _id ka part hogi toh woh sare reviews delete kr denge.
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;