const { Router } = require('express');
const router = new Router();

const countryRouter = require('./countryRouter');
const locationRouter = require('./locationRoutes');
const actorRouter = require('./actorRoutes');
const directorRouter = require('./directorRoutes');

router.use('/countries', countryRouter);
router.use('/locations', locationRouter);
router.use('/actors', actorRouter);
router.use('/directors', directorRouter);

module.exports = router;
