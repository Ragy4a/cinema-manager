'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    static associate(models) {
      Movie.belongsTo(models.Genre, { foreignKey: 'genre_id', as: 'Genre' });
      Movie.belongsTo(models.Studio, { foreignKey: 'studio_id', as: 'Studio' });
      Movie.belongsToMany(models.Actor, { 
        through: 'movies_actors', 
        as: 'Actors'
      });
      Movie.belongsToMany(models.Director, { 
        through: 'movies_directors',
        as: 'Directors'
      });
    }
  }
  Movie.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    release_year: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    genre_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    studio_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    poster: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Movie',
    timestamps: false,
    underscored: true,
  });
  return Movie;
};