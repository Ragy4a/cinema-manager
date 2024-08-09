const { Router } = require('express');
const router = Router();

const genreController = require('../controllers/genreController');

const {
    validation: { validateGenre }
} = require('../middlewares');

router
    .route('/')
        .get(genreController.getAllGenres)
        .post(validateGenre, genreController.createGenre)
        .put(validateGenre, genreController.updateGenre);

router
    .route('/:id')
        .delete(genreController.deleteGenre);

module.exports = router;