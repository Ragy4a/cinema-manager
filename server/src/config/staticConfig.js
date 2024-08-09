const path = require('path');

const staticPath = path.resolve(process.env.STATIC_PATH);

module.exports.staticConfig = {
    actors: path.resolve(staticPath, 'images', 'actors'),
    directors: path.resolve(staticPath, 'images', 'directors'),
    studios: path.resolve(staticPath, 'images', 'studios'),
    movies: path.resolve(staticPath, 'images', 'movies')
};