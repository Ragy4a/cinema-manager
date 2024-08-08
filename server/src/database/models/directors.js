'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class directors extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  directors.init({
    first_name: DataTypes.STRING,
    second_name: DataTypes.STRING,
    birth_date: DataTypes.DATE,
    birth_place: DataTypes.INTEGER,
    death_year: DataTypes.DATE,
    death_place: DataTypes.INTEGER,
    photo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Directors',
    underscored: true,
    timestamps: false
  });
  return directors;
};