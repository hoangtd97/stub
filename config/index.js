'use strict';

require('dotenv').config();

const ENV = process.env;

const config = {
  server: {
    host: ENV.HOST,
    port: ENV.PORT,
  },
  MongoDB: {
    uri: ENV.MONGO_DB_URI,
    options: {
      server: {
        poolSize: 100,
        socketOptions: {
          keepAlive: 1
        },
        reconnectTries: 1000,
        reconnectInterval: 1000
      },
      poolSize: 10,
      keepAlive: 1,
      autoReconnect: true,
      user: ENV.MONGO_DB_USER,
      pass: ENV.MONGO_DB_PASSWORD,
    },
    debug: ENV.MONGO_DB_DEBUG,
    prefix: ENV.MONGO_DB_PREFIX || 'knes_test_api_'
  }
};

module.exports = config;