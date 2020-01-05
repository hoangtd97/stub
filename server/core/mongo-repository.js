'use strict';

const mongoose = require('mongoose');

const MongoRepository = {
  _config: null,
  _mongoose: mongoose,
  config(config) {
    MongoRepository._config = config;
  },
  async init() {
    const { uri, options, debug } = MongoRepository._config;

    mongoose.Promise = global.Promise;

    await mongoose.connect(uri, options);

    mongoose.set('debug', debug);

    MongoRepository._mongoose = mongoose;

    return MongoRepository;
  },
  Schema: mongoose.Schema,
  create({ name, schema }) {
    const { prefix } = MongoRepository._config;

    const repository = MongoRepository._mongoose.model(prefix + name, schema);

    return repository;
  }
};

module.exports = { MongoRepository };