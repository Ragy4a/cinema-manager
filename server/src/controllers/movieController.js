const createError = require('http-errors');
const { Movie, Genre, Studio, sequelize } = require('../database/models');

class MovieController {

    getAllMovies = async (req, res, next) => {
        try {
            const { limit, offset } = req.pagination;
            const movies = await Movie.findAll({
                include: [
                    { model: Genre, as: 'genre', attributes: ['title'] },
                    { model: Studio, as: 'studio', attributes: ['title'] }
                ],
                attributes: ['id', 'title', 'release_year', 'poster'],
                limit,
                offset,
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

    createMovie = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { title, release_year, genre, studio } = req.body;
            const poster = req.file ? req.file.filename : null;
            const { id: genre_id } = await Genre.findOne({
                where: { title: genre },
                attributes: ['id'],
                transaction: t,
                raw: true,
            });
            if (!genre_id) {
                await t.rollback();
                return createError(404, 'Genre not found');
            };
            const { id: studio_id } = await Studio.findOne({
                where: { title: studio },
                attributes: ['id'],
                transaction: t,
                raw: true,
            });
            if (!studio_id) {
                await t.rollback();
                return createError(404, 'Studio not found');
            };
            const newMovie = await Movie.create({ title, release_year, genre_id, studio_id, poster }, {
                transaction: t,
                returning: true,
                raw: true,
            });

            await t.commit();
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
            const { id, title, release_year, genre, studio } = req.body;
            const poster = req.file ? req.file.filename : null;
            const { id: genre_id } = await Genre.findOne({
                where: { title: genre },
                attributes: ['id'],
                transaction: t,
                raw: true,
            });
            if (!genre_id) {
                await t.rollback();
                return createError(404, 'Genre not found');
            };
            const { id: studio_id } = await Studio.findOne({
                where: { title: studio },
                attributes: ['id'],
                transaction: t,
                raw: true,
            });
            if (!studio_id) {
                await t.rollback();
                return createError(404, 'Studio not found');
            };
            const [affectedRows, [updatedMovie]] = await Movie.update({ title, release_year, genre_id, studio_id, poster }, {
                where: { id },
                transaction: t,
                raw: true,
                returning: true,
            });
            if (affectedRows === 0) {
                await t.rollback();
                return next(createError(404, 'Movie not found'));
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

}

module.exports = new MovieController();