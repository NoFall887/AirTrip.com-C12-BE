"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Airport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Flight, { foreignKey: "from" });
      this.hasMany(models.Flight, { foreignKey: "to" });
    }
  }
  Airport.init(
    {
      country_code: DataTypes.STRING,
      name: DataTypes.STRING,
      iata: DataTypes.STRING,
      icao: DataTypes.STRING,
      logo: DataTypes.STRING,
      address: DataTypes.STRING,
      phone: DataTypes.STRING,
      website: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Airport",
      paranoid: true,
    }
  );
  return Airport;
};
