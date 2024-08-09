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
      references: {
        model: 'movies',
        key: 'id',
      },
      onDelete: 'CASCADE',
      primaryKey: true,
    },
    director_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'directors',
        key: 'id',
      },
      onDelete: 'CASCADE',
      primaryKey: true,
    },
  }, {
    sequelize,
    modelName: 'MoviesDirectors',
    underscored: true,
    timestamps: false,
  });
  return MoviesDirectors;
};