const { Router } = require('express');
const router = Router();

const movieDirectorController = require('../controllers/movieDirectorController');

const {
    validation: { validateMovieActor }
} = require('../middlewares');

router
    .route('/')
        .get(validateMovieActor, movieDirectorController.getAllMoviesDirectors)
        .post(validateMovieActor, movieDirectorController.createMovieDirector);

router
    .route('/:movie_id-:actor_id')
        .delete(movieDirectorController.deleteMovieDirector);

module.exports = router;
