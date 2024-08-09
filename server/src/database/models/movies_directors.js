'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MoviesDirectors extends Model {
    static associate(models) {
    }
  }
  MoviesDirectors.init({
    movie_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    director_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'MoviesDirector',
    underscored: true,
    timestamps: false,
  });
  return MoviesDirectors;
};