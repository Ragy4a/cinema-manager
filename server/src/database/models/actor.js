'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Actor extends Model {
    static associate(models) {
      Actor.belongsTo(models.Location, {
        foreignKey: 'birth_place',
        as: 'birthActorLocation'
      })
      Actor.belongsTo(models.Location, {
        foreignKey: 'death_place',
        as: 'deathActorLocation'
      })
      Actor.belongsToMany(models.Movie, { through: 'movies_actors' })
    }
  }
  Actor.init({
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
    modelName: 'Actor',
    underscored: true,
    timestamps: false
  });
  return Actor;
};