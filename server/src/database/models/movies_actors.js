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
    },
    actor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'MoviesActor',
    timestamps: false,
    underscored: true,
  });
  return MoviesActors;
};