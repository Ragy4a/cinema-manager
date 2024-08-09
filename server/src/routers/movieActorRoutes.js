const { Router } = require('express');
const router = Router();

const movieActorController = require('../controllers/movieActorController');

const {
    validation: { validateMovieActor }
} = require('../middlewares');

router
    .route('/')
        .get(validateMovieActor, movieActorController.getAllMovieActors)
        .post(validateMovieActor, movieActorController.createMovieActor);

router
    .route('/:movie_id-:actor_id')
        .delete(movieActorController.deleteMovieActor);

module.exports = router;
