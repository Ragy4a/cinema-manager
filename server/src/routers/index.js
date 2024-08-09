const { Router } = require('express');
const router = new Router();

const countryRouter = require('./countryRouter');
const locationRouter = require('./locationRoutes');
const actorRouter = require('./actorRoutes');
const directorRouter = require('./directorRoutes');
const genreRouter = require('./genreRoutes');
const studioRouter = require('./studioRouters');
const movieRouter = require('./movieRouters');
const movieActorRouter = require('./movieActorRoutes');
const movieDirectorRouter = require('./movieDirectorRoutes');

router.use('/countries', countryRouter);
router.use('/locations', locationRouter);
router.use('/actors', actorRouter);
router.use('/directors', directorRouter);
router.use('/genres', genreRouter);
router.use('/studios', studioRouter);
router.use('/movies', movieRouter);
router.use('/movies-actors', movieActorRouter);
router.use('/movies-directors', movieDirectorRouter);

module.exports = router;
