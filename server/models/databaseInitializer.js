'use strict';

const fs = require('fs');
const path = require('path');
const sequelize = require('sequelize');

const basename = path.basename(__filename);
const environment = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[environment];
const database = {};

let sequelizeInstance;

if (config.use_env_variable) {
  sequelizeInstance = new sequelize(process.env[config.use_env_variable], config);
} else {
  sequelizeInstance = new sequelize(config.database, config.username, config.password, config);
}

// Load all models dynamically
fs.readdirSync(__dirname)
    .filter(file => file.endsWith('.js') && file !== basename)
    .forEach(file => {
      const model = require(path.join(__dirname, file))(sequelizeInstance, sequelize.DataTypes);
      database[model.name] = model;
    });

// Associate models if associations exist
Object.keys(database).forEach(modelName => {
  if (database[modelName].associate) {
    database[modelName].associate(database);
  }
});

database.sequelize = sequelizeInstance;
database.Sequelize = sequelize;
module.exports = database;
