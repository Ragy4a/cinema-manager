const createError = require('http-errors');
const { Studio, Location, Country, Movie, sequelize } = require('../database/models');
const { Op } = require('sequelize');

class StudioController {

    getAllStudios = async (req, res, next) => {
        try {
            const { limit, offset } = req.pagination;
            const { search, filter } = req.query;
            const whereClause = {};
            if (search) {
                whereClause.title = { [Op.iLike]: `%${search}%` };
            }
            let orderClause = [];
            if (filter === 'oldest') {
                orderClause.push(['found_year', 'ASC']);
            } else if (filter === 'newest') {
                orderClause.push(['found_year', 'DESC']);
            } else if (filter === 'most-movies') {
                orderClause.push([sequelize.literal('"movies_count"'), 'DESC']);
            }
            const studios = await Studio.findAndCountAll({
                where: whereClause,
                attributes: {
                    include: [
                        [sequelize.fn('COUNT', sequelize.col('Movies.id')), 'movies_count']
                    ]
                },
                include: [
                    { 
                        model: Location, 
                        as: 'Location', 
                        attributes: ['title'], 
                        include: {
                            model: Country, 
                            as: 'Country', 
                            attributes: ['title'] 
                        } 
                    },
                    { 
                        model: Movie, 
                        as: 'Movies', 
                        attributes: [], 
                    }
                ],
                limit,
                offset,
                group: ['Studio.id', 'Location.id', 'Location->Country.id'],
                order: orderClause.length ? orderClause : [['id', 'ASC']],
                subQuery: false,
            });
            if (!studios.rows.length) {
                return next(createError(404, 'Studios not found!'));
            }
            res.status(200).json({
                studios: studios.rows.map(studio => ({
                    ...studio.get({ plain: true }),
                    country: studio['Location.Country.title']
                })),
                total: studios.count.length,
            });
        } catch (error) {
            console.log(error.message);
            next(error);
        }
    };    

    getStudioById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const studio = await Studio.findOne({
                where: { id },
                attributes: ['id', 'title', 'found_year', 'logo'],
                include: [
                    {
                        model: Location,
                        as: 'Location',
                        attributes: ['title'],
                        include: [
                            {
                                model: Country,
                                as: 'Country',
                                attributes: ['title'],
                            }
                        ]
                    },
                    {
                        model: Movie,
                        as: 'Movies',
                        attributes: ['id', 'title', 'poster'],
                    }
                ],
            });
            if (!studio) {
                return next(createError(404, 'Studio not found!'));
            };
            const movies = studio.Movies.map(movie => ({
                id: movie.id,
                title: movie.title,
                poster: movie.poster
            }));
            res.status(200).json({
                id: studio.id,
                title: studio.title,
                logo: studio.logo,
                found_year: studio.found_year,
                location: {
                    title: studio.Location.title,
                    country: studio.Location.Country.title,
                },
                movies
            });
        } catch (error) {
            console.log(error.message);
            next(error);
        }
    };

    createStudio = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { title, found_year, location } = req.body;
            const logo = req.file ? req.file.filename : null;
            const locationObj = await Location.findOne({
                where: { title: location },
                attributes: ['id'],
                transaction: t,
                raw: true,
            });
            const location_id = locationObj.id;
            if (!locationObj) {
                await t.rollback();
                return next(createError(404, 'Location not found'));
            };
            const newStudio = await Studio.create({ title, found_year, logo, location_id }, {
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
            const existingStudio = await Studio.findByPk(id, { transaction: t, raw: true });
            if (!existingStudio) {
                return next(createError(404, 'Studio not found!'));
            };
            const logo = req.file ? req.file.filename : existingStudio.logo;
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
            if (!studios.length) {
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