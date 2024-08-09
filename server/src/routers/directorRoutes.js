const { Router } = require('express');
const router = Router();

const directorController = require('../controllers/directorController');

const {
    paginate: { paginateData },
    upload: { uploadDirectorPhoto },
    validation: { validatePerson }
} = require('../middlewares');

router
    .route('/')
        .get(paginateData, directorController.getAllDirectors)
        .post(uploadDirectorPhoto.single('photo'), validatePerson, directorController.createDirector)
        .put(uploadDirectorPhoto.single('photo'), validatePerson, directorController.updateDirector);

router
    .route('/:id')
        .delete(directorController.deleteDirector);

module.exports = router;