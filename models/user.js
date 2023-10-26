'use strict';

const bcrypt = require('bcryptjs')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // one to one to Profile
      User.hasOne(models.Profile, { foreignKey: 'UserId' })
    }
  }
  User.init({
    // create validation
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Username cannot be empty'
        },
        notNull: {
          args: true,
          msg: 'Username cannot be null'
        },
        isUnique(value, next) {
          User.findOne({
              where: {
                  username: value
              }
          })
          .then(user => {
              if (user) {
                  return next('Username already exist')
              } else {
                  return next()
              }
          })
          .catch(err => {
              return next(err)
          })
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Password cannot be empty'
        },
        notNull: {
          args: true,
          msg: 'Password cannot be null'
        },
        len: {
          args: [6],
          msg: 'Password at least 6 characters'
        },
        is: {
          args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
          msg: 'Password must contain at least 1 uppercase, 1 lowercase and 1 number'
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Role cannot be empty'
        },
        notNull: {
          args: true,
          msg: 'Role cannot be null'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate((user, options) => {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(user.password, salt)
    user.password = hash
  })
  return User;
};