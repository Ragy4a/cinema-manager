const { Router } = require('express');
const router = new Router();

const countryController = require('../controllers/countryController');

const {
    paginate: { paginateData },
    validation: { validateCountry }
} = require('../middlewares');

router
    .route('/')
        .get(paginateData, countryController.getAllCountries)
        .post(validateCountry, countryController.createCountry)
        .put(validateCountry, countryController.updateCountry)
router
    .route('/:id')
        .delete(countryController.deleteCountry)

module.exports = router;