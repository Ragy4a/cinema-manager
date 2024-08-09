const createError = require('http-errors');
const { MoviesActors, sequelize } = require('../database/models');

class MovieActorController {

    getAllMovieActors = async (req, res, next) => {
        try {
            const { limit, offset } = req.pagination;
            const movieActors = await MoviesActors.findAll({
                limit,
                offset,
                raw: true
            });
            if (!movieActors.length) {
                return next(createError(404, 'No movie-actor associations found!'));
            }
            res.status(200).json(movieActors);
        } catch (error) {
            console.log(error.message);
            next(error);
        }
    }

    createMovieActor = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const newMovieActor = await MoviesActors.create(req.body, {
                transaction: t,
                returning: true,
                raw: true,
            });
            if (!newMovieActor) {
                await t.rollback();
                return createError(404, 'Movie-actor association not found!')
            }
            await t.commit();
            res.status(201).json(newMovieActor);
        } catch (error) {
            console.log(error.message);
            await t.rollback();
            next(error);
        }
    }

    deleteMovieActor = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { movie_id, actor_id } = req.params;
            const deletedMovieActor = await MovieActor.destroy({
                where: { movie_id, actor_id },
                transaction: t,
            });
            if (!deletedMovieActor) {
                await t.rollback();
                return next(createError(404, 'Movie-actor association not found!'));
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

module.exports = new MovieActorController();
