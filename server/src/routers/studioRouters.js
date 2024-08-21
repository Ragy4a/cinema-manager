const { Router } = require('express');
const router = Router();

const studioController = require('../controllers/studioController');

const {
    paginate: { paginateData },
    upload: { uploadStudioLogo },
    validation: { validateStudio }
} = require('../middlewares');

router
    .route('/selectStudios')
        .get(studioController.selectStudios)
router
    .route('/')
        .get(paginateData, studioController.getAllStudios)
        .post(uploadStudioLogo.single('logo'), validateStudio, studioController.createStudio)
        .put(uploadStudioLogo.single('logo'), validateStudio, studioController.updateStudio)

router
    .route('/:id')
        .delete(studioController.deleteStudio);

module.exports = router;