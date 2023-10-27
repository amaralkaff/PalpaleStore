'use strict';
const { Op } = require('sequelize')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {

    get stockStatus() {
      if (this.stock > 0) {
        return 'In Stock'
      } else {
        return 'Out of Stock'
      }
    }

    
    
    static getSearchFilter(sortPrice, search) {
      let options = {}
      
      if (sortPrice === 'highest') {
        sortPrice = 'DESC'
      } else if (sortPrice === 'lowest') {
        sortPrice = 'ASC'
      }
      if (sortPrice) {
        options.order = [
          ['price', sortPrice]
        ]
      }
      if (search) {
        options.where = {
          name: {
            [Op.iLike]: `%${search}%`
          }
        }
      }
      return this.findAll(options)
    }


    

    static associate(models) {
      // many to many
      Product.belongsToMany(models.Category, { through: models.ProductCategory })
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name cannot be empty'
        },
        notNull: {
          msg: 'Name cannot be null'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Description cannot be empty'
        },
        notNull: {
          msg: 'Description cannot be null'
        },
        customValidator(value) {
          if (value.length < 10) {
            throw new Error('Description must be at least 10 characters')
          }
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Price cannot be empty'
        },
        notNull: {
          msg: 'Price cannot be null'
        },
        isInt: {
          msg: 'Price must be integer'
        },
        min: {
          args: [0],
          msg: 'Price must be greater than 0'
        },
        customValidator(value) {
          if (value <= 0) {
            throw new Error('Price must be greater than 0')
          }
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Stock cannot be empty'
        },
        notNull: {
          msg: 'Stock cannot be null'
        },
        isInt: {
          msg: 'Stock must be integer'
        },
        customValidator(value) {
          if (value <= 0) {
            throw new Error('Stock must be greater than 0')
          }
        }
      }
    },
    productImg: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Product Image cannot be empty'
        },
        notNull: {
          msg: 'Product Image cannot be null'
        }
      }
    },
    UserId: DataTypes.INTEGER

  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};