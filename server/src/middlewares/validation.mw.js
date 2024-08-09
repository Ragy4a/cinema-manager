const {
    yup,
    COUNTRY_VALIDATION_SCHEMA,
    LOCATION_VALIDATION_SCHEMA,
    PERSON_VALIDATION_SCHEMA,
    GENRE_VALIDATION_SCHEMA,
    MOVIE_VALIDATION_SCHEMA,
    STUDIO_VALIDATION_SCHEMA,
    MOVIE_ACTOR_VALIDATION_SCHEMA,
    MOVIE_DIRECTOR_VALIDATION_SCHEMA
} = require('../utils/validationSchemas');

const validateSchema = (schema) => async (req, res, next) => {
    const { body } = req;
    try {
        await schema.validate(body, { abortEarly: false });
        next();
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ errors: error.errors });
    }
};

module.exports.validateCountry = validateSchema(COUNTRY_VALIDATION_SCHEMA);
module.exports.validateLocation = validateSchema(LOCATION_VALIDATION_SCHEMA);
module.exports.validatePerson = validateSchema(PERSON_VALIDATION_SCHEMA);
module.exports.validateGenre = validateSchema(GENRE_VALIDATION_SCHEMA);
module.exports.validateMovie = validateSchema(MOVIE_VALIDATION_SCHEMA);
module.exports.validateStudio = validateSchema(STUDIO_VALIDATION_SCHEMA);
module.exports.validateMovieActor = validateSchema(MOVIE_ACTOR_VALIDATION_SCHEMA);
module.exports.validateMovieDirector = validateSchema(MOVIE_DIRECTOR_VALIDATION_SCHEMA);