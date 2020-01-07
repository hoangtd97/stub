'use strict';

const { MongoRepository } = require('server/core/mongo-repository.js');

const OrderSchema = MongoRepository.Schema({
  last_sync_at: { type: Date }
}, { strict: false, versionKey: false });

const OrderRepository = MongoRepository.create({ name: 'etp_orders', schema: OrderSchema });

module.exports = { OrderRepository };