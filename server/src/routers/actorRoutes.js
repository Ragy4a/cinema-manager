const { Router } = require('express');
const router = new Router();

const actorController = require('../controllers/actorController');

const {
    paginate: { paginateData },
    upload: { uploadActorPhoto },
    validation: { validatePerson }
} = require('../middlewares');

router
    .route('/selectActors')
        .get(actorController.selectActors);
router
    .route('/')
    .get(paginateData, actorController.getAllActors)
    .post(uploadActorPhoto.single('photo'), validatePerson, actorController.createActor)
    .put(uploadActorPhoto.single('photo'), validatePerson, actorController.updateActor);

router
    .route('/:id')
    .get(actorController.getActorById)
    .delete(actorController.deleteActor);

module.exports = router;