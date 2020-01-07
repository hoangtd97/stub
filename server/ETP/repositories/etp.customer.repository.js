'use strict';

const { MongoRepository } = require('server/core/mongo-repository.js');

const CustomerSchema = MongoRepository.Schema({
  last_sync_at: { type: Date }
}, { strict: false, versionKey: false });

const CustomerRepository = MongoRepository.create({ name: 'etp_customers', schema: CustomerSchema });

module.exports = { CustomerRepository };