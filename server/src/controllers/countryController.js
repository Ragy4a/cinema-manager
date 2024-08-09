const createError = require('http-errors');
const { Country, sequelize } = require('../database/models');

class CountryController {

    getAllCountries = async (req, res, next) => {
        try {
            const { limit, offset } = req.pagination;
            const countries = await Country.findAll({
                limit,
                offset,
                raw: true
            });
            if (!countries.length) {
                return next(createError(404, 'Countries not found'));
            }
            res.status(200).json(countries);
        } catch (error) {
            console.error(error.message);
            next(error);
        }
    }

    createCountry = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { title, abbreviation } = req.body;
            const newCountry = await Country.create({ title, abbreviation }, {
                transaction: t,
                raw: true,
                returning: true,
            });
            if (!newCountry) {
                await t.rollback();
                return next(createError(404, 'Country not found'));
            }
            await t.commit();
            res.status(201).json(newCountry);
        } catch (error) {
            console.error(error.message);
            await t.rollback();
            next(error);
        }
    }

    updateCountry = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { id, title, abbreviation } = req.body;
            const [affectedRows, [updatedCountry]] = await Country.update({ title, abbreviation }, {
                where: { id },
                transaction: t,
                returning: true,
            });
            if (affectedRows === 0) {
                await t.rollback();
                return next(createError(404, 'Country not found'));
            }
            await t.commit();
            res.status(200).json(updatedCountry);
        } catch (error) {
            console.error(error.message);
            await t.rollback();
            next(error);
        }
    }

    deleteCountry = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;
            const deletedCountry = await Country.destroy({
                where: { id },
                transaction: t,
            });
            if (!deletedCountry) {
                await t.rollback();
                return next(createError(404, 'Country not found'));
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

module.exports = new CountryController();