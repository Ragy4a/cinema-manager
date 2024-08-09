const createError = require('http-errors');
const { Actor, Location, sequelize } = require('../database/models');

class ActorController {

    getAllActors = async (req, res, next) => {
        try {
            const { limit, offset } = req.pagination;
            const actors = await Actor.findAll({
                attributes: ['id', 'first_name'],
                limit,
                offset,
                raw: true,
            });
            if (!actors.length) {
                return next(createError(404, 'Actors not found!'));
            };
            res.status(200).json(actors);
        } catch (error) {
            console.log(error.message);
            next(error);
        }
    }

    createActor = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { first_name, second_name, birth_date, birth_place, death_place, death_year } = req.body;
            const photo = req.file ? req.file.filename : null;
            const birthLocation = await Location.findOne({
                where: { title: birth_place },
                attributes: ['id'],
                transaction: t,
                raw: true,
            });

            if (!birthLocation) {
                await t.rollback();
                return next(createError(404, 'Birth place location not found!'));
            }

            let deathLocation = null;
            if (death_place) {
                const locationResult = await Location.findOne({
                    where: { title: death_place },
                    attributes: ['id'],
                    transaction: t,
                    raw: true,
                });

                if (!locationResult) {
                    await t.rollback();
                    return next(createError(404, 'Death place location not found!'));
                }

                deathLocation = locationResult.id;
            }

            const newActor = await Actor.create({
                first_name,
                second_name,
                birth_date,
                birth_place: birthLocation.id,
                death_place: deathLocation ?? null,
                death_year,
                photo
            }, {
                transaction: t,
                returning: true,
            });

            if (!newActor) {
                await t.rollback();
                return next(createError(404, 'Actor not created!'));
            }

            await t.commit();
            res.status(201).json(newActor);
        } catch (error) {
            console.log(error.message);
            await t.rollback();
            next(error);
        }
    }

    updateActor = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { id, first_name, second_name, birth_date, birth_place, death_place, death_year } = req.body;
            const photo = req.file ? req.file.filename : null;
            const { id: birthLocation } = await Location.findOne({
                where: { title: birth_place },
                attributes: ['id'],
                transaction: t,
                raw: true,
            });
            if (!birthLocation) {
                await t.rollback();
                return next(createError(404, 'Birth place location not found!'));
            }
            let deathLocation = null;
            if (death_place) {
                const { id } = await Location.findOne({
                    where: { title: death_place },
                    attributes: ['id'],
                    transaction: t,
                    raw: true,
                });
                if (!id) {
                    await t.rollback();
                    return next(createError(404, 'Death place location not found!'));
                }
                deathLocation = id;
            }
            const [affectedRows, [updatedActor]] = await Actor.update({
                first_name,
                second_name,
                birth_date,
                birth_place: birthLocation,
                death_place: deathLocation ?? null,
                death_year,
                photo
            }, {
                where: { id },
                transaction: t,
                returning: true,
            });
            if (affectedRows === 0) {
                await t.rollback();
                return next(createError(404, 'Actor not found!'));
            }
            await t.commit();
            res.status(200).json(updatedActor);
        } catch (error) {
            console.log(error.message);
            await t.rollback();
            next(error);
        }
    }

    deleteActor = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;
            const deletedActor = await Actor.destroy({
                where: {
                    id,
                },
                transaction: t,
            });
            if(!deletedActor) {
                await t.rollback();
                return createError(404, 'Actor not found!');
            };
            await t.commit();
            res.status(204).send();
        } catch (error) {
            console.log(error.message);
            await t.rollback();
            next(error);
        }
    }

}

module.exports = new ActorController();