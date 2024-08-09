'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MoviesActors extends Model {
    static associate(models) {
    }
  }
  MoviesActors.init({
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
    actor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'actors',
        key: 'id',
      },
      onDelete: 'CASCADE',
      primaryKey: true,
    },
  }, {
    sequelize,
    modelName: 'MoviesActors',
    timestamps: false,
    underscored: true,
  });
  return MoviesActors;
};