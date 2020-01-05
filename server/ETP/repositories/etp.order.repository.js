'use strict';

const { MongoRepository } = require('server/core/mongo-repository.js');

const OrderSchema = MongoRepository.Schema({}, { strict: false });

const OrderRepository = MongoRepository.create({ name: 'etp_orders', schema: OrderSchema });

module.exports = { OrderRepository };