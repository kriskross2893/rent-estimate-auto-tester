import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import Sequelize from 'sequelize';
import urlParse from 'url-parse';
import debugLib from 'debug';

const debug = debugLib('rent-estimate:db');

let basename = path.basename(module.filename);

const makeTestConnection = () => {
  dotenv.config();
  const debugTest = debugLib('rent-estimate:test');
  if (process.env.POSTGRES_TEST_URL) {
    const dbOptions = {
      dialect: 'postgres',
      logging: false
    };
    const url = urlParse(process.env.POSTGRES_TEST_URL);
    debugTest(`Connecting to ${url.pathname} on ${url.hostname} via Sequelize...`);
    return new Sequelize(process.env.POSTGRES_TEST_URL, dbOptions);
  } else {
    throw new Error('No test database url setup. Please setup test database url');
  }
};

const makeConnection = () => {
  const dbOptions = {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: process.env.POSTGRES_SSL
    },
    pool: {
      max: 20,
      min: 0,
      idle: 20000,
      acquire: 20000,
    },
  };
  const url = urlParse(process.env.POSTGRES_URL);
  debug(`Connecting to ${url.pathname} on ${url.hostname} via Sequelize...`);
  return new Sequelize(process.env.POSTGRES_URL, dbOptions);
};

const readModels = (sequelize) => {
  let models = {};

  fs
    .readdirSync(__dirname)
    .filter(function(file) {
      return (file.indexOf('.') !== 0 && file !== basename);
    })
    .forEach(function(file) {
      if (file.slice(-3) !== '.js' || file === 'base.js') {
        return;
      }
      const filePath = path.join(__dirname, file);
      const model = sequelize.import(filePath);
      models[model.name] = model;
    });

    Object
      .keys(models)
      .forEach(function(modelName) {
        if (models[modelName].associate) {
          models[modelName].associate(models);
        }
    });

    return models;
};

const sequelize = (process.env.NODE_ENV === 'test')
  ? makeTestConnection()
  : makeConnection();

const db = readModels(sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.CURRENT_TIMESTAMP = sequelize.literal('CURRENT_TIMESTAMP');

db.connect = (callback) => {
  // if (['test'].includes(process.env.NODE_ENV)) {
  //   return sequelize.sync().then(callback);
  // }
  return callback();
};

export default db;
