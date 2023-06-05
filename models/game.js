'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  game.init({
    name: DataTypes.STRING,
    review_desc: DataTypes.STRING,
    release_string: DataTypes.STRING,
    tags: DataTypes.STRING,
    is_free_game: DataTypes.BOOLEAN,
    background: DataTypes.STRING,
    deck_compat: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'game',
  });
  return game;
};