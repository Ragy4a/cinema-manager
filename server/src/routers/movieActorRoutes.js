const { Router } = require('express');
const router = Router();

const moviesActorsController = require('../controllers/movieActorController');

const {
    validation: { validateMovieActor }
} = require('../middlewares');

router
    .route('/')
        .get(validateMovieActor, moviesActorsController.getAllMoviesActors)
        .post(validateMovieActor, moviesActorsController.createMovieActor);

router
    .route('/:movie_id-:actor_id')
        .delete(moviesActorsController.deleteMovieActor);

module.exports = router;
