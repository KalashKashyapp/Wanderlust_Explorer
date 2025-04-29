const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.searchListings = async (req, res) => {
    let { location } = req.query;

    if (!location) {
        const allListings = await Listing.find({});
        req.flash("error", "Please enter a destination to search.");
        //return res.redirect("/listings", { allListings });
        return res.render("listings/index.ejs", { allListings });
    }

    const input = location.trim().toLowerCase(); // 🟡 Normalize input

    const allListings = await Listing.find({
        $or: [
            { location: { $regex: input, $options: "i" } },
            { country: { $regex: input, $options: "i" } }
        ]
    });

    if (allListings.length === 0) {
        req.flash("error", "No place exist for this destination .");
        return res.redirect("/listings");
    }

    res.render("listings/index.ejs", { allListings, location });
};


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({             //yahan pe nested "populate fn" ko use kiya jisse ki har ek review ka author aajaye.
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you've requested for does not exist!");
        res.redirect("/listings");
    }
    if (
        !listing.geometry ||
        !listing.geometry.type ||
        !listing.geometry.coordinates ||
        listing.geometry.coordinates.length !== 2 ||
        (listing.geometry.coordinates[0] === 0 && listing.geometry.coordinates[1] === 0)
    ) {
        // Try to geocode location + country dynamically
        const place = `${listing.location}, ${listing.country}`;
        const response = await geocodingClient
            .forwardGeocode({ query: place, limit: 1 })
            .send();

        if (response.body.features && response.body.features.length > 0) {
            listing.geometry = response.body.features[0].geometry;
        } else {
            // fallback default location (e.g., New York or some central city)
            listing.geometry = {
                type: "Point",
                coordinates: [-74.006, 40.7128], // NYC coords example
            };
            req.flash("warning", "Location data not available, showing default location");
        }
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        })
        .send();

    //Agar koi invalid ya galat location daal di.
    if (response.body.features.length === 0) {
        req.flash("error", "Invalid location entered! Please enter a valid location.");
        return res.redirect("/listings/new");
    }

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing); //hamne ab new.ejs me form me jo data fields the unko 'listing' object ki key bana di.
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save(); //jaise he hamarimlisting create hui uske bad ek flash msg de denge.
    console.log(savedListing);

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Requested listing doesn't exists!😥");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "No Such destination exist!");
        return res.redirect("/listings");
    }

    const oldLocation = listing.location; // Save old location before updating

    // Update basic fields
    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = req.body.listing.location;
    listing.country = req.body.listing.country;

    // If a new image is uploaded
    if (typeof req.file !== "undefined") {
        const url = req.file.path;
        const filename = req.file.filename;
        listing.image = { url, filename };
    }

    // If the location has changed, update geometry (coordinates)
    if (oldLocation !== req.body.listing.location) {
        const geoData = await geocodingClient
            .forwardGeocode({
                query: req.body.listing.location,
                limit: 1,
            })
            .send();

        if (geoData.body.features.length > 0) {
            listing.geometry = geoData.body.features[0].geometry;
        } else {
            listing.geometry = {
                type: "Point",
                coordinates: [-74.006, 40.7128], // fallback to NYC
            };
        }
    }

    await listing.save();
    req.flash("success", "destination Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;  //sabse pahle id ko extract kiya.
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};