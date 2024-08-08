'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class movies_actors extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  movies_actors.init({
    movie_id: DataTypes.INTEGER,
    actor_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MovieActors',
    timestamps: false,
    underscored: true,
  });
  return movies_actors;
};