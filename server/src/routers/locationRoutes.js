const { Router } = require('express');
const locationController = require('../controllers/locationController');

const router = Router();

const {
    paginate: { paginateData },
    validation: { validateLocation }
} = require('../middlewares');

router
    .route('/')
        .get(paginateData, locationController.getAllLocations)
        .post(validateLocation, locationController.createLocation)
        .put(validateLocation, locationController.updateLocation)
router
    .route('/:id')
        .delete(locationController.deleteLocation);

module.exports = router;