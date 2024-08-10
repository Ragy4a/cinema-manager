const createError = require('http-errors');
const { Director, Location, Movie, MoviesDirectors, sequelize } = require('../database/models');

class DirectorController {

    getAllDirectors = async (req, res, next) => {
        try {
            const { limit, offset } = req.pagination;
            const directors = await Director.findAll({
                attributes: ['id', 'first_name'],
                limit,
                offset,
                raw: true,
            });
            if (!directors.length) {
                return next(createError(404, 'Directors not found!'));
            }
            res.status(200).json(directors);
        } catch (error) {
            console.log(error.message);
            next(error);
        }
    }

    createDirector = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { first_name, second_name, birth_date, birth_place, death_place, death_year, movies } = req.body;
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
            const newDirector = await Director.create({
                first_name,
                second_name,
                birth_date,
                birth_place: birthLocation,
                death_place: deathLocation ?? null,
                death_year,
                photo
            }, {
                transaction: t,
                returning: true,
            });
            if (!newDirector) {
                await t.rollback();
                return next(createError(404, 'Director not created!'));
            }
            if (movies && movies.length > 0) {
                for (const title of movies) {
                    let movie = await Movie.findOne({
                        where: { title },
                        transaction: t,
                    });
                    if (!movie) {
                        await t.rollback();
                        return next(createError(404, 'Movie not found!'));
                    };
                    await MoviesDirectors.create({
                        movie_id: movie.id,
                        director_id: newDirector.id,
                    }, { transaction: t })
                }
            }
            await t.commit();
            res.status(201).json(newDirector);
        } catch (error) {
            console.log(error.message);
            await t.rollback();
            next(error);
        }
    }

    updateDirector = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { id, first_name, second_name, birth_date, birth_place, death_place, death_year, movies } = req.body;
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
            const [affectedRows, [updatedDirector]] = await Director.update({
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
                return next(createError(404, 'Director not found!'));
            }
            if(movies && movies.length > 0) {
                await MoviesDirectors.destroy({ 
                    where: { director_id: id },
                    transaction: t
                });
                for (const title of movies) {
                    let movie = await Movie.findOne({
                        where: { title },
                        transaction: t
                    });
                    if (!movie) {
                        await t.rollback();
                        return next(createError(404, 'Movie not found!'));
                    };
                    await MoviesDirectors.create({
                        movie_id: movie.id,
                        director_id: id,
                    }, { transaction: t })
                }
            }
            await t.commit();
            res.status(200).json(updatedDirector);
        } catch (error) {
            console.log(error.message);
            await t.rollback();
            next(error);
        }
    }

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
            console.log(error.message);
            await t.rollback();
            next(error);
        }
    }

}

module.exports = new DirectorController();