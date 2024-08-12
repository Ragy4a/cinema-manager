const yup = require('yup');

const TITLE_CHECK = yup.string().required('The title is required');
const URL = yup.string().nullable().notRequired();
const ID_CHECK = yup.number().integer('Id must be integer').positive('Id must be positive').required('Id is required')


const PAGINATION_SCHEMA = yup.object().shape({
    limit: yup.number().min(1).max(100).required(),
    offset: yup.number().min(0).required()
});

const COUNTRY_VALIDATION_SCHEMA = yup.object().shape({
    title: TITLE_CHECK,
    abbreviation: yup.string().required('The abbreviation is required')
});

const LOCATION_VALIDATION_SCHEMA = yup.object().shape({
    title: yup.string().required('Title is required'),
    country: yup.string().required('Country is required'),
});

const PERSON_VALIDATION_SCHEMA = yup.object().shape({
    first_name: yup.string().required('First name is required'),
    second_name: yup.string().required('Second name is required'),
    birth_date: yup.date().required('Birth date is required'),
    birth_place: yup.string().required('Birth place is required'),
    death_place: URL,
    death_date: yup.date().nullable().notRequired(),
    photo: URL,
});

const GENRE_VALIDATION_SCHEMA = yup.object().shape({
    title: TITLE_CHECK,
    description: yup.string().required('Description is required')
});

const MOVIE_VALIDATION_SCHEMA = yup.object().shape({
    title: TITLE_CHECK,
    release_year: yup.date().required('Release year is required'),
    genre: yup.string().required('Genre is required'),
    studio: yup.string().required('Studio is required'),
    poster: URL
});

const STUDIO_VALIDATION_SCHEMA = yup.object().shape({
    title: TITLE_CHECK,
    found_year: yup.date().required('Found year is required'),
    logo: URL,
    location: yup.string().required('Location is required')
});

const MOVIE_ACTOR_VALIDATION_SCHEMA = yup.object().shape({
    movie_id: ID_CHECK,
    actor_id: ID_CHECK
});

const MOVIE_DIRECTOR_VALIDATION_SCHEMA = yup.object().shape({
    movie_id: ID_CHECK,
    director_id: ID_CHECK
});

module.exports = {
    yup,
    PAGINATION_SCHEMA,
    COUNTRY_VALIDATION_SCHEMA,
    LOCATION_VALIDATION_SCHEMA,
    PERSON_VALIDATION_SCHEMA,
    GENRE_VALIDATION_SCHEMA,
    MOVIE_VALIDATION_SCHEMA,
    STUDIO_VALIDATION_SCHEMA,
    MOVIE_ACTOR_VALIDATION_SCHEMA,
    MOVIE_DIRECTOR_VALIDATION_SCHEMA
};