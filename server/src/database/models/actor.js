'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class actor extends Model {
    static associate(models) {
    }
  }
  actor.init({
    first_name: {
      type: DataTypes.STRING,

    },
    second_name: DataTypes.STRING,
    birth_date: DataTypes.DATE,
    birth_place: DataTypes.INTEGER,
    death_year: DataTypes.DATE,
    death_place: DataTypes.INTEGER,
    photo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Actor',
    underscored: true,
    timestamps: false
  });
  return actor;
};