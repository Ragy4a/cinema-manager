'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  movie.init({
    title: DataTypes.STRING,
    release_year: DataTypes.DATE,
    genre_id: DataTypes.INTEGER,
    studio_id: DataTypes.INTEGER,
    poster: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Movie',
    timestamps: false,
    underscored: true,
  });
  return movie;
};