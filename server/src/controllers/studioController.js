const createError = require('http-errors');
const { Studio, Location, Country, sequelize } = require('../database/models');

class StudioController {

    getAllStudios = async (req, res, next) => {
        try {
            const { limit, offset } = req.pagination;
            const studios = await Studio.findAll({
                include: [{ model: Location, as: 'location', attributes: ['title'] }],
                attributes: ['id', 'title', 'found_year', 'logo'],
                limit,
                offset,
                raw: true,
            });
            if (!studios.length) {
                return next(createError(404, 'Studios not found!'));
            }
            res.status(200).json(studios);
        } catch (error) {
            console.log(error.message);
            next(error);
        }
    }

    createStudio = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { title, found_year, location } = req.body;
            const logo = req.file ? req.file.filename : null;
            const { id: location_id } = await Location.findOne({
                where: { title: location },
                attributes: ['id'],
                transaction: t,
                raw: true,
            });
            if (!location_id) {
                await t.rollback();
                return next(createError(404, 'Location not found'));
            };
            const newStudio = await Studio.create({ title, found_year, location_id, logo }, {
                transaction: t,
                returning: true,
                raw: true,
            });
            await t.commit();
            res.status(201).json(newStudio);
        } catch (error) {
            console.log(error.message);
            await t.rollback();
            next(error);
        }
    }

    updateStudio = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { id, title, found_year, location } = req.body;
            const logo = req.file ? req.file.filename : null;
            const { id: location_id } = await Location.findOne({
                where: { title: location },
                attributes: ['id'],
                transaction: t,
                raw: true,
            });
            if (!location_id) {
                await t.rollback();
                return next(createError(404, 'Location not found'));
            };
            const [affectedRows, [updatedStudio]] = await Studio.update({ title, found_year, location_id, logo }, {
                where: { id },
                transaction: t,
                returning: true,
            });
            if (affectedRows === 0) {
                await t.rollback();
                return next(createError(404, 'Studio not found'));
            }
            await t.commit();
            res.status(200).json(updatedStudio);
        } catch (error) {
            console.log(error.message);
            await t.rollback();
            next(error);
        }
    }

    deleteStudio = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;
            const deletedStudio = await Studio.destroy({
                where: { id },
                transaction: t,
            });
            if (!deletedStudio) {
                await t.rollback();
                return next(createError(404, 'Studio not found'));
            }
            await t.commit();
            res.status(204).send();
        } catch (error) {
            console.log(error.message);
            await t.rollback();
            next(error);
        }
    }

    selectStudios = async (req, res, next) => {
        try {
            const studios = await Studio.findAll({
                attributes: ['id', 'title'],
                include: [
                    {
                        model: Location,
                        as: 'Location',
                        attributes: [],
                        include: {
                            model: Country,
                            as: 'Country',
                            attributes: ['id']
                        }
                    }
                ],
                raw: true,
            });
            if(!studios.length) {
                return next(createError(404, 'Studios not found!'));
            };
            res.status(200).json(studios);
        } catch (error) {
            console.log(error.message)
            next(error);
        }
    }

}

module.exports = new StudioController();