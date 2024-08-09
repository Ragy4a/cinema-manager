const createError = require('http-errors');
const { Location, Country, sequelize } = require('../database/models');

class LocationController {

    getAllLocations = async (req, res, next) => {
        try {
            const locations = await Location.findAll({
                attributes: {
                    exclude: ['country_id']
                },
                include: [{ model: Country, attributes: ['title', 'abbreviation'] }],
                raw: true,
            });
            if (!locations.length) {
                return next(createError(404, 'Locations not found'));
            }
            res.status(200).json(locations);
        } catch (error) {
            console.error(error.message);
            next(error);
        }
    }

    createLocation = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { title, country } = req.body;
            const { id: country_id } = await Country.findOne({
                where: {
                    title: country,
                },
                attributes: ['id'],
                transaction: t,
                raw: true,
            })
            if(!country_id) {
                await t.rollback();
                return next(createError(404, 'Country not found!'))
            }
            const newLocation = await Location.create({ title, country_id }, {
                transaction: t,
                raw: true,
                returning: true,
            });
            if(!newLocation) {
                await t.rollback();
                return next(createError(404, 'Location not found'));
            }
            await t.commit();
            res.status(201).json(newLocation);
        } catch (error) {
            console.error(error.message);
            await t.rollback();
            next(error);
        }
    }

    updateLocation = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { id, title, country } = req.body;
            const { id: country_id } = await Country.findOne({
                where: {
                    title: country,
                },
                attributes: ['id'],
                transaction: t,
                raw: true,
            });
            if(!country_id) {
                await t.rollback();
                return next(createError(404, 'Country not found!'))
            }
            const [affectedRows, [updatedLocation]] = await Location.update({ title, country }, {
                where: { id },
                transaction: t,
                returning: true,
            });
            if (affectedRows === 0) {
                await t.rollback();
                return next(createError(404, 'Location not found'));
            }
            await t.commit();
            res.status(200).json(updatedLocation);
        } catch (error) {
            console.error(error.message);
            await t.rollback();
            next(error);
        }
    }

    deleteLocation = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;
            const deletedLocation = await Location.destroy({
                where: { id },
                transaction: t,
            });
            if (!deletedLocation) {
                await t.rollback();
                return next(createError(404, 'Location not found'));
            }
            await t.commit();
            res.status(204).send();
        } catch (error) {
            console.error(error.message);
            await t.rollback();
            next(error);
        }
    }

}

module.exports = new LocationController();
