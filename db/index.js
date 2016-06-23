'use strict';
var path = require('path');
var Sequelize = require('sequelize');
var db = new Sequelize("postgres://localhost:5432/feedback");

require('./models/feedback')(db);

var Feedback = db.model('feedback');

module.exports = db;