const { Router } = require('express');
const router = Router();

const movieController = require('../controllers/movieController');

const {
    paginate: { paginateData },
    upload: { uploadMoviePoster },
    validation: { validateMovie }
} = require('../middlewares');

router
    .route('/selectMovies')
        .get(movieController.selectMovies);
router
    .route('/')
        .get(paginateData, movieController.getAllMovies)
        .post(uploadMoviePoster.single('poster'), validateMovie, movieController.createMovie)
        .put(uploadMoviePoster.single('poster'), validateMovie, movieController.updateMovie);

router
    .route('/:id')
        .get(movieController.getMovieById)
        .delete(movieController.deleteMovie);

module.exports = router;