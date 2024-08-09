'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    static associate(models) {
      Location.belongsTo(models.Country, { foreignKey: 'country_id' });
      Location.hasMany(models.Actor, {
        foreignKey: 'birth_place', 
        as: 'birthActorPlace'
      });
      Location.hasMany(models.Actor, {
        foreignKey: 'death_place', 
        as: 'deathActorPlace'
      });
      Location.hasMany(models.Director, {
        foreignKey: 'birth_place',
        as: 'birthDirectorLocation',
      })
      Location.hasMany(models.Director, {
        foreignKey: 'death_place',
        as: 'deathDirectorLocation',
      })
      Location.hasMany(models.Studio, { foreignKey: 'location_id' })
    }
  }
  Location.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    country_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Country',
        key: 'id'
      },
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Location',
    underscored: true,
    timestamps: false
  });
  return Location;
};