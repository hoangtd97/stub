'use strict';

const { MongoRepository } = require('server/core/mongo-repository.js');

const CustomerSchema = MongoRepository.Schema({}, { strict: false });

const CustomerRepository = MongoRepository.create({ name: 'etp_customers', schema: CustomerSchema });

module.exports = { CustomerRepository };