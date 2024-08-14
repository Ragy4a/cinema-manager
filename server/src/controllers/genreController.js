const createError = require('http-errors');
const { Genre, sequelize } = require('../database/models');

class GenreController {

    getAllGenres = async (req, res, next) => {
        try {
            const genres = await Genre.findAll({ raw: true });
            if (!genres.length) {
                return next(createError(404, 'Genres not found!'));
            }
            res.status(200).json(genres);
        } catch (error) {
            console.log(error.message);
            next(error);
        }
    }

    createGenre = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const newGenre = await Genre.create(req.body, {
                transaction: t,
                returning: true,
                raw: true,
            });
            if(!newGenre) {
                await t.rollback();
                return next(createError(404, 'Genre not found!'))
            }
            await t.commit();
            res.status(201).json(newGenre);
        } catch (error) {
            console.log(error.message);
            await t.rollback();
            next(error);
        }
    }

    updateGenre = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { id } = req.body;
            const [affectedRows, [updatedGenre]] = await Genre.update(req.body, {
                where: { id },
                transaction: t,
                returning: true,
            });
            if (affectedRows === 0) {
                await t.rollback();
                return next(createError(404, 'Genre not found!'));
            }
            await t.commit();
            res.status(200).json(updatedGenre);
        } catch (error) {
            console.log(error.message);
            await t.rollback();
            next(error);
        }
    }

    deleteGenre = async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;
            const deletedGenre = await Genre.destroy({
                where: { id },
                transaction: t,
            });
            if (!deletedGenre) {
                await t.rollback();
                return next(createError(404, 'Genre not found!'));
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

module.exports = new GenreController();