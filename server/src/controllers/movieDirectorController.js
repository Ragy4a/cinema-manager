const createError = require('http-errors');
const { MoviesDirectors, sequelize } = require('../database/models');

class MoviesDirectorsController {

    getAllMoviesDirectors = async (req, res, next) => {
        try {
            const { limit, offset } = req.pagination;
            const MoviesDirectorss = await MoviesDirectors.findAll({
                limit,
                offset,
                raw: true
            });
            if (!MoviesDirectorss.length) {
                return next(createError(404, 'No movie-director associations found!'));
            }
            res.status(200).json(MoviesDirectorss);
        } catch (error) {
            console.log(error.message);
            next(error);
        }
    }

    createMovieDirector = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            console.log(req.body)
            const newMoviesDirectors = await MoviesDirectors.create(req.body, {
                transaction: t,
                returning: true,
                raw: true,
            });
            if(!newMoviesDirectors){
                await t.rollback();
                return next(createError(404, 'Movie-director association not created!'))
            }
            await t.commit();
            res.status(201).json(newMoviesDirectors);
        } catch (error) {
            console.log(error.message);
            await t.rollback();
            next(error);
        }
    }

    deleteMovieDirector = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { movie_id, director_id } = req.params;
            const deletedMoviesDirectors = await MoviesDirectors.destroy({
                where: { movie_id, director_id },
                transaction: t,
            });
            if (!deletedMoviesDirectors) {
                await t.rollback();
                return next(createError(404, 'Movie-director association not found!'));
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

module.exports = new MoviesDirectorsController();