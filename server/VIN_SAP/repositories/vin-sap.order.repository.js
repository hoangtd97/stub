'use strict';

const { MongoRepository } = require('server/core/mongo-repository.js');

const VinSapOrderSchema = MongoRepository.Schema({
  _last_sync_at: { type: Date }
}, { strict: false, versionKey: false });

const VinSapOrderRepository = MongoRepository.create({ name: 'vin_sap_orders', schema: VinSapOrderSchema });

module.exports = { VinSapOrderRepository };