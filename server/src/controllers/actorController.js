const createError = require('http-errors');
const { Actor, Location, Country, Movie, MoviesActors, sequelize } = require('../database/models');
const { Op } = require('sequelize');

class ActorController {

    getAllActors = async (req, res, next) => {
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
                // пробовал убирать sequelize.literal - но тут он нужен(честно)
            }
            const actors = await Actor.findAndCountAll({
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
                group: ['Actor.id'],
                order: orderClause.length ? orderClause : [['id', 'ASC']],
            });
    
            if (!actors.rows.length) {
                return next(createError(404, 'Actors not found!'));
            }
    
            res.status(200).json({
                actors: actors.rows,
                total: actors.count.length,
            });
        } catch (error) {
            console.log(error.message);
            next(error);
        }
    };
    

    getActorById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const actor = await Actor.findOne({
                where: { id },
                include: [
                    {
                        model: Location,
                        as: 'birthActorLocation',
                        attributes: ['title', 'id'],
                        include: {
                            model: Country,
                            attributes: ['title', 'id'],
                        },
                    },
                    {
                        model: Location,
                        as: 'deathActorLocation',
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
            if (!actor) {
                return next(createError(404, 'Actor not found!'));
            }
            res.status(200).json(actor);
        } catch (error) {
            next(error);
        }
    };
    

    createActor = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            console.log(req.body)
            const { first_name, second_name, birth_date, birth_place, death_place, death_year, movies, country } = req.body;
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

            let deathActorLocation = null;
            if (death_place) {
                const locationResult = await Location.findOne({
                    where: { title: death_place, country_id: countryInstance.id },
                    attributes: ['id'],
                    transaction: t,
                    raw: true,
                });
                if (!locationResult) {
                    await t.rollback();
                    return next(createError(404, 'Death place location not found!'));
                }
                deathActorLocation = locationResult.id;
            }

            const newActor = await Actor.create({
                first_name,
                second_name,
                birth_date,
                birth_place: birthLocation.id,
                death_place: deathActorLocation ?? null,
                death_year,
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
                    await MoviesActors.create({
                        movie_id: movie.id,
                        actor_id: newActor.id,
                    }, { transaction: t });
                }
            }

            await t.commit();
            res.status(201).json(newActor);
        } catch (error) {
            await t.rollback();
            next(error);
        }
    };

    updateActor = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            console.log(req.body)
            const { id, first_name, second_name, birth_date, birth_place, death_place, death_year, movies, country } = req.body;
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

            const birthActorLocation = await Location.findOne({
                where: { title: birth_place, country_id: countryInstance.id },
                attributes: ['id'],
                transaction: t,
                raw: true,
            });
            if (!birthActorLocation) {
                await t.rollback();
                return next(createError(404, 'Birth place location not found!'));
            }

            let deathActorLocation = null;
            if (death_place) {
                const locationResult = await Location.findOne({
                    where: { title: death_place, country_id: countryInstance.id },
                    attributes: ['id'],
                    transaction: t,
                    raw: true,
                });
                if (!locationResult) {
                    await t.rollback();
                    return next(createError(404, 'Death place location not found!'));
                }
                deathActorLocation = locationResult.id;
            }

            const [affectedRows, [updatedActor]] = await Actor.update({
                first_name,
                second_name,
                birth_date,
                birth_place: birthLocation.id,
                death_place: deathActorLocation ?? null,
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

            if (movies && movies.length > 0) {
                await MoviesActors.destroy({
                    where: { actor_id: id },
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
                    await MoviesActors.create({
                        movie_id: movie.id,
                        actor_id: id,
                    }, { transaction: t });
                }
            }

            await t.commit();
            res.status(200).json(updatedActor);
        } catch (error) {
            await t.rollback();
            next(error);
        }
    };

    deleteActor = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;

            await MoviesActors.destroy({
                where: { actor_id: id },
                transaction: t,
            });

            const deletedActor = await Actor.destroy({
                where: { id },
                transaction: t,
            });

            if (!deletedActor) {
                await t.rollback();
                return next(createError(404, 'Actor not found!'));
            }

            await t.commit();
            res.status(204).send();
        } catch (error) {
            await t.rollback();
            next(error);
        }
    };

}

module.exports = new ActorController();