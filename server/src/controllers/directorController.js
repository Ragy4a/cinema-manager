const createError = require('http-errors');
const { Director, Location, Country, Movie, MoviesDirectors, sequelize } = require('../database/models');
const { Op } = require('sequelize');

class DirectorController {

    getAllDirectors = async (req, res, next) => {
        try {
            const { limit, offset } = req.pagination;
            const { search, filter } = req.query;
            const whereClause = {};
            if (search) {
                whereClause[Op.or] = [
                    { first_name: { [Op.iLike]: `%${search}%` } },
                    { second_name: { [Op.iLike]: `%${search}%` } }
                ];
            }
            let orderClause = [];
            if (filter === 'oldest') {
                orderClause.push(['birth_date', 'ASC']);
            } else if (filter === 'youngest') {
                orderClause.push(['birth_date', 'DESC']);
            } else if (filter === 'most-movies') {
                orderClause.push([sequelize.literal('"movies_count"'), 'DESC']);
            }
            const directors = await Director.findAndCountAll({
                where: whereClause,
                attributes: {
                    include: [
                        [
                            sequelize.fn('COUNT', sequelize.col('movies.id')),
                            'movies_count'
                        ]
                    ]
                },
                include: [
                    {
                        model: Movie,
                        as: 'movies',
                        attributes: [],
                        through: { attributes: [] }
                    }
                ],
                limit,
                subQuery: false,
                offset,
                group: ['Director.id'],
                order: orderClause.length ? orderClause : [['id', 'ASC']],
            });
    
            if (!directors.rows.length) {
                return next(createError(404, 'Directors not found!'));
            }
    
            res.status(200).json({
                directors: directors.rows,
                total: directors.count.length,
            });
        } catch (error) {
            console.log(error.message);
            next(error);
        }
    };

    getDirectorById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const director = await Director.findOne({
                where: { id },
                include: [
                    {
                        model: Location,
                        as: 'birthDirectorLocation',
                        attributes: ['title', 'id'],
                        include: {
                            model: Country,
                            attributes: ['title', 'id'],
                        },
                    },
                    {
                        model: Location,
                        as: 'deathDirectorLocation',
                        attributes: ['title', 'id'],
                        include: {
                            model: Country,
                            attributes: ['title', 'id'],
                        },
                    },
                    {
                        model: Movie,
                        as: 'movies',
                        through: { attributes: [] },
                        attributes: ['id', 'title', 'poster'],
                    }
                ],
                attributes: ['id', 'first_name', 'second_name', 'birth_date', 'death_date', 'photo'],
            });
            if (!director) {
                return next(createError(404, 'Director not found!'));
            }
            res.status(200).json(director);
        } catch (error) {
            next(error);
        }
    };

    createDirector = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { first_name, second_name, birth_date, birth_place, death_place, death_date, movies, country } = req.body;
            const photo = req.file ? req.file.filename : null;
            const countryInstance = await Country.findOne({
                where: { title: country },
                attributes: ['id'],
                transaction: t,
                raw: true,
            });
            if (!countryInstance) {
                await t.rollback();
                return next(createError(404, 'Country not found!'));
            }
            const birthLocation = await Location.findOne({
                where: { title: birth_place, country_id: countryInstance.id },
                attributes: ['id'],
                transaction: t,
                raw: true,
            });
            if (!birthLocation) {
                await t.rollback();
                return next(createError(404, 'Birth place location not found!'));
            }
            let deathDirectorLocation = null;
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
                deathDirectorLocation = locationResult.id;
            }
            const newDirector = await Director.create({
                first_name,
                second_name,
                birth_date,
                birth_place: birthLocation.id,
                death_place: deathDirectorLocation ?? null,
                death_date,
                photo
            }, {
                transaction: t,
                returning: true,
            });
            if (movies && movies.length > 0) {
                for (const title of movies) {
                    const movie = await Movie.findOne({
                        where: { title },
                        transaction: t,
                    });
                    if (!movie) {
                        await t.rollback();
                        return next(createError(404, 'Movie not found!'));
                    }
                    await MoviesDirectors.create({
                        movie_id: movie.id,
                        director_id: newDirector.id,
                    }, { transaction: t });
                }
            }
            await t.commit();
            res.status(201).json(newDirector);
        } catch (error) {
            console.log(error.message)
            await t.rollback();
            next(error);
        }
    };

    updateDirector = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { id, first_name, second_name, birth_date, birth_place, death_place, death_date, movies, country } = req.body;
            const existingDirector = await Director.findByPk(id, { transaction: t, raw: true });
            if (!existingDirector) {
                await t.rollback();
                return next(createError(404, 'Director not found!'));
            }
            const photo = req.file ? req.file.filename : existingDirector.photo;
            const countryInstance = await Country.findOne({
                where: { title: country },
                attributes: ['id'],
                transaction: t,
                raw: true,
            });
            if (!countryInstance) {
                await t.rollback();
                return next(createError(404, 'Country not found!'));
            }
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
            let deathDirectorLocation = null;
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
                deathDirectorLocation = locationResult.id;
            }
            const [affectedRows, [updatedDirector]] = await Director.update({
                first_name,
                second_name,
                birth_date,
                birth_place: birthLocation.id,
                death_place: deathDirectorLocation ?? null,
                death_date,
                photo
            }, {
                where: { id },
                transaction: t,
                returning: true,
            });

            if (affectedRows === 0) {
                await t.rollback();
                return next(createError(404, 'Director not found!'));
            }

            if (movies && movies.length > 0) {
                await MoviesDirectors.destroy({
                    where: { director_id: id },
                    transaction: t,
                });
                for (const title of movies) {
                    const movie = await Movie.findOne({
                        where: { title },
                        transaction: t,
                    });
                    if (!movie) {
                        await t.rollback();
                        return next(createError(404, 'Movie not found!'));
                    }
                    await MoviesDirectors.create({
                        movie_id: movie.id,
                        director_id: id,
                    }, { transaction: t });
                }
            }

            await t.commit();
            res.status(200).json(updatedDirector);
        } catch (error) {
            await t.rollback();
            next(error);
        }
    };

    deleteDirector = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;

            await MoviesDirectors.destroy({
                where: { director_id: id },
                transaction: t,
            });

            const deletedDirector = await Director.destroy({
                where: { id },
                transaction: t,
            });

            if (!deletedDirector) {
                await t.rollback();
                return next(createError(404, 'Director not found!'));
            }

            await t.commit();
            res.status(204).send();
        } catch (error) {
            await t.rollback();
            next(error);
        }
    };

}

module.exports = new DirectorController();