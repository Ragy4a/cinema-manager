'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class movies_directors extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  movies_directors.init({
    movie_id: DataTypes.INTEGER,
    director_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MoviesDirectors',
    underscored: true,
    timestamps: false,
  });
  return movies_directors;
};