const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

/* Yeh hamne passportLocalMongoose ko as a plugin isliye use kiya kynki yeh automatically hamre liye username , hashing , salting & hash password in sabko implement kr deta hai. */
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
