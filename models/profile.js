'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // one to one to User
      Profile.belongsTo(models.User, { foreignKey: 'UserId' })
    }
  }
  Profile.init({
    name: DataTypes.STRING,
    gender: DataTypes.STRING,
    age: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};