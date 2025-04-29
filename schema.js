/* Joi is a tool jo hamare Schema ko validate krne ke liye use kiya jata hai. joi ke help se ham ek schema define krte hain jo ki yeh server-side ka scehma hota hai (na ki mongoose ka) or yeh server-side ki listing ko validate krta hai. */ 

const Joi = require('joi');

//Validations for listingSchema
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.alternatives().try(
            Joi.string().allow("", null),
            Joi.object({
                url: Joi.string().allow("", null).required()
            })
        ).default("")
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});