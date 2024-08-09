'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Director extends Model {
    static associate(models) {
      Director.belongsTo(models.Location, {
        foreignKey: 'birth_place',
        as: 'birthDirectorLocation'
      })
      Director.belongsTo(models.Location, {
        foreignKey: 'death_place',
        as: 'deathDirectorLocation'
      })
      Director.belongsToMany(models.Movie, { through: 'movies_directors' })
    }
  }
  Director.init({
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    second_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birth_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    birth_place: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    death_year: {
      type: DataTypes.DATE,
      allowNull: true
    },
    death_place: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Director',
    underscored: true,
    timestamps: false
  });
  return Director;
};