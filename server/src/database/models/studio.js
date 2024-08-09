'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Studio extends Model {
    static associate(models) {
      Studio.belongsTo(models.Location, { foreignKey: 'location_id' })
      Studio.hasMany(models.Movie, { foreignKey: 'studio_id' })
    }
  }
  Studio.init({
    title: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    found_year: {
      type: DataTypes.DATE,
      allowNull: true,
    },  
    logo: {
      type:DataTypes.STRING,
      allowNull: true,
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Studio',
    underscored: true,
    timestamps: false,
  });
  return Studio;
};