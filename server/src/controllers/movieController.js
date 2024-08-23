const createError = require('http-errors');
const { Movie, Genre, Studio, Actor, Director, Location, Country, MoviesActors, MoviesDirectors, sequelize } = require('../database/models');
const { Op } = require('sequelize');

class MovieController {

    getAllMovies = async (req, res, next) => {
        try {
            const { limit, offset } = req.pagination;
            const { search, filter } = req.query;
            const whereClause = {};
            if (search) {
                whereClause.title = { [Op.iLike]: `%${search}%` };
            }
            let orderClause = [];
            if (filter === 'oldest') {
                orderClause.push(['release_year', 'ASC']);
            } else if (filter === 'newest') {
                orderClause.push(['release_year', 'DESC']);
            } else if (filter === 'most-actors') {
                orderClause.push([sequelize.literal('"actors_count"'), 'DESC']);
            }
            const movies = await Movie.findAndCountAll({
                where: whereClause,
                attributes: {
                    include: [
                        [sequelize.fn('COUNT', sequelize.col('Actors.id')), 'actors_count'],
                        'poster'
                    ]
                },
                include: [
                    { model: Genre, as: 'Genre', attributes: ['title'] },
                    { 
                        model: Studio, 
                        as: 'Studio', 
                        attributes: ['title'],
                        include: {
                            model: Location,
                            as: 'Location',
                            attributes: [],
                            include: {
                                model: Country,
                                as: 'Country',
                                attributes: ['title'],
                            }
                        }
                    },
                    { 
                        model: Actor, 
                        as: 'Actors', 
                        attributes: [], 
                        through: { attributes: [] } 
                    }
                ],
                limit,
                offset,
                group: ['Movie.id', 'Genre.id', 'Studio.id', 'Studio->Location.id', 'Studio->Location->Country.id'],
                order: orderClause.length ? orderClause : [['id', 'ASC']],
                subQuery: false,
            });
            if (!movies.rows.length) {
                return next(createError(404, 'Movies not found!'));
            }
            res.status(200).json({
                movies: movies.rows.map(movie => ({
                    ...movie.get({ plain: true }),
                    country: movie['Studio.Location.Country.title']
                })),
                total: movies.count.length,
            });            
        } catch (error) {
            console.log(error.message);
            next(error);
        }
    }

    getMovieById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const movie = await Movie.findOne({
                where: { id },
                include: [
                    { model: Genre, as: 'Genre', attributes: ['title'] },
                    { 
                        model: Studio, 
                        as: 'Studio', 
                        attributes: ['title', 'id', 'logo'],
                        include: {
                            model: Location,
                            as: 'Location',
                            attributes: ['title'],
                            include: {
                                model: Country,
                                as: 'Country',
                                attributes: ['title'],
                            }
                        }
                    },
                    { 
                        model: Actor, 
                        as: 'Actors', 
                        attributes: ['id', 'first_name', 'second_name', 'birth_date', 'photo'], 
                        through: { attributes: [] }
                    },
                    { 
                        model: Director, 
                        as: 'Directors', 
                        attributes: ['id', 'first_name', 'second_name', 'birth_date', 'photo'], 
                        through: { attributes: [] }
                    }
                ],
                attributes: ['id', 'title', 'release_year', 'poster'],
            });

            if (!movie) {
                return next(createError(404, 'Movie not found!'));
            }

            res.status(200).json({
                id: movie.id,
                title: movie.title,
                release_year: movie.release_year,
                country: movie.Studio?.Location?.Country?.title || null,
                studioId: movie.Studio?.id || null,
                studio: movie.Studio?.title || null,
                genre: movie.Genre?.title || null,
                directors: movie.Directors || [],
                actors: movie.Actors || [],
                poster: movie.poster,
            });
        } catch (error) {
            next(error);
        }
    }

    createMovie = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { title, release_year, genre, studio, actors, directors } = req.body;
            const poster = req.file ? req.file.filename : null;
    
            const genreInstance = await Genre.findOne({
                where: { title: genre },
                attributes: ['id'],
                transaction: t,
                raw: true,
            });
    
            if (!genreInstance) {
                await t.rollback();
                return next(createError(404, 'Genre not found'));
            }
    
            const studioInstance = await Studio.findOne({
                where: { title: studio },
                attributes: ['id'],
                transaction: t,
                raw: true,
            });
    
            if (!studioInstance) {
                await t.rollback();
                return next(createError(404, 'Studio not found'));
            }
            const genre_id = genreInstance.id;
            const studio_id = studioInstance.id;
            const newMovie = await Movie.create({ 
                title, 
                release_year, 
                genre_id, 
                studio_id, 
                poster 
            }, {
                transaction: t,
                returning: true,
                raw: true,
            });
    
            if (actors && actors.length > 0) {
                for (const actorId of actors) {
                    await MoviesActors.create({
                        movie_id: newMovie.id,
                        actor_id: actorId,
                    }, { transaction: t });
                }
            }
    
            if (directors && directors.length > 0) {
                for (const directorId of directors) {
                    await MoviesDirectors.create({
                        movie_id: newMovie.id,
                        director_id: directorId,
                    }, { transaction: t });
                }
            }
    
            await t.commit();
            console.log(newMovie)
            res.status(201).json(newMovie);
        } catch (error) {
            console.log(error.message);
            await t.rollback();
            next(error);
        }
    }
    
    updateMovie = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { id, title, release_year, genre, studio, actors, directors } = req.body;
            const existingMovie = await Movie.findByPk(id, { transaction: t, raw: true});
            if (!existingMovie) {
                return next(createError(404, 'Movie not found!'));
            };
            const poster = req.file ? req.file.filename : existingMovie.poster;
    
            const genreInstance = await Genre.findOne({
                where: { title: genre },
                attributes: ['id'],
                transaction: t,
                raw: true,
            });
    
            if (!genreInstance) {
                await t.rollback();
                return next(createError(404, 'Genre not found'));
            }
    
            const studioInstance = await Studio.findOne({
                where: { title: studio },
                attributes: ['id'],
                transaction: t,
                raw: true,
            });
    
            if (!studioInstance) {
                await t.rollback();
                return next(createError(404, 'Studio not found'));
            }
    
            const [affectedRows, [updatedMovie]] = await Movie.update({
                title,
                release_year,
                genre_id: genreInstance.id,
                studio_id: studioInstance.id,
                poster
            }, {
                where: { id },
                transaction: t,
                returning: true,
                raw: true,
            });
    
            if (affectedRows === 0) {
                await t.rollback();
                return next(createError(404, 'Movie not found'));
            }
    
            if (actors && actors.length > 0) {
                await MoviesActors.destroy({
                    where: { movie_id: id },
                    transaction: t,
                });
                for (const actorId of actors) {
                    await MoviesActors.create({
                        movie_id: id,
                        actor_id: actorId,
                    }, { transaction: t });
                }
            }
    
            if (directors && directors.length > 0) {
                await MoviesDirectors.destroy({
                    where: { movie_id: id },
                    transaction: t,
                });
                for (const directorId of directors) {
                    await MoviesDirectors.create({
                        movie_id: id,
                        director_id: directorId,
                    }, { transaction: t });
                }
            }
    
            await t.commit();
            res.status(200).json(updatedMovie);
        } catch (error) {
            console.log(error.message);
            await t.rollback();
            next(error);
        }
    }

    deleteMovie = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;
            await MoviesActors.destroy({
                where: { movie_id: id },
                transaction: t,
            });
            await MoviesDirectors.destroy({
                where: { movie_id: id },
                transaction: t,
            });
            const deletedMovie = await Movie.destroy({
                where: { id },
                transaction: t,
            });
            if (!deletedMovie) {
                await t.rollback();
                return next(createError(404, 'Movie not found'));
            }
            await t.commit();
            res.status(204).send();
        } catch (error) {
            console.log(error.message);
            await t.rollback();
            next(error);
        }
    }

    selectMovies = async (req, res, next) => {
        try {
            const movies = await Movie.findAll({
                attributes: ['id', 'title'],
                order: [['title', 'ASC']],
                raw: true,
            });
            if (!movies.length) {
                return next(createError(404, 'Movies not found!'));
            }
            res.status(200).json(movies);
        } catch (error) {
            console.log(error.message);
            next(error);
        }
    }

}

module.exports = new MovieController();