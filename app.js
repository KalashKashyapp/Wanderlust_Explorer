if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");  //this is for creating templates or layouts.
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;
app.locals.mapToken = process.env.MAP_TOKEN;

//call kiya main func. ko
main()
    .then(() => {
       console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

//connect to database "wanderlust".
async function main() {
    await mongoose.connect(dbUrl);
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);        
app.use(express.static(path.join(__dirname, 'public')));  //isse ham static files use kr skte hain jaise css files public folder ki.

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("Error in Mongo Session store", err);
})

/* yeh hame user ke data ko temporarily store karne me help karta hai (jaise login status, cart data, etc.), jab tak user browser band nahi kar deta ya session expire nahi ho jata. */
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    /* Jab browser ko cookie bhejte hai (jisme session ID hoti hai), to usme expiry ya kitne time tak valid rhegi yeh likhte hain.
    "User ka session 7 din tak active rahega — agar user browser band kare, system restart ho ya kuch bhi ho — jab tak 7 din nahi ho jaate, session valid rahega." 
    Iska fayda hai ki user ko baar-baar login nahi karna padega. Jab tak uska session cookie valid hai, wo app me logged in hi rahega. */
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};

//api create kiya.
// app.get("/", (req, res) => {
//     res.send("Hii, You're at the root of the API.");
// });

/* is line ki help se ham Express.js ke app me ek middleware lagate hai jo session ko handle karta hai. */
app.use(session(sessionOptions));

//"Ek request ke liye temporary message store karna, jo agle request me show ho jaye — aur fir delete ho jaye Flash message ek baar use hone ke baad delete ho jata hai..
app.use(flash());

// Isse har ek req. ke liye hamara passport initalize ho jayga.
app.use(passport.initialize()); 
app.use(passport.session());    //Yeh hamne as a middleware isilye use kiya jisse ki har ek req. ko pata ho ki woh konse session ka part hai. 
passport.use(new LocalStrategy(User.authenticate())); /* "Passport ko hamne bataya ki jab koi user login kare username aur password ke saath, toh User.authenticate() function ka use karke check karo ki user valid hai ya nahi." */

/* Serialize ka kaam hai "user ki information ko compress karke session mein store karna.", aur Deserialize ka kaam hai "session mein saved id se wapas pura user object ya user ki details nikalna. "*/
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* Agar req.flash("success") me koi message ho, to usko res.locals.success me save karaya toh jisse success message ko kisi bhi EJS template me show kar sakte hai or phir next ko call krdenge. */
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "sudent2601@gmail.com",
//         username: "kkashyap428"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");  //yeh register fn. hamare database ke andar is fakeuser ko save kra dega with this password.
//     res.send(registeredUser);
// })

app.use("/listings", listingRouter);    //Hum listings router ko /listings path pe mount kar rahe hain. Iska matlab ye hai ki jitne bhi routes listings router ke andar define kiye gaye hain, un sabke aage automatically /listings add ho jayega.
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


// app.all("*", (req, res, next) => {
//     console.log("404 handler reached for:", req.path);
//     next(new ExpressError(404, "Page Not Found!"));
// });

// 404 route handler - catch all unknown routes
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

//Custom error handling "Middleware"
app.use((err, req, res, next) => {
    const {statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("Error", { message });
    // res.status(statusCode).send(message);
});

//Server start karne ke liye.
app.listen(8080, () => {
    console.log("server is listening to port 8080");
});