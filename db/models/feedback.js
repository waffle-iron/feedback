'use strict';

var Sequelize = require('sequelize');

module.exports = function (db) {

  db.define('feedback', {
    message: {
      type: Sequelize.STRING, 
      allowNull: false,
      validate: {notEmpty: true}
    },
    time: {
      type: Sequelize.STRING, 
      allowNull: false,
      validate: {notEmpty: true}
    },
    question: {
      type: Sequelize.STRING, 
    },
  });
};
