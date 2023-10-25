'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    //create static method
    
    static getSearchFilter(search) {
      return {
        where: {
          name: {
            [Op.iLike]: `%${search}%`
          }
        }
      }
    }

    static associate(models) {
      // many to many
      Product.belongsToMany(models.Category, { through: models.ProductCategory })
    }
  }
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    productImg: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};