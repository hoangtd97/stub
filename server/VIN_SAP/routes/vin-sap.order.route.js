'use strict';

const _ = require('lodash');
const { merge, SimpleID } = require('server/core/common.js');
const { Controller } = require('server/core/controller');
const { VinSapOrderRepository } = require('server/VIN_SAP/repositories/vin-sap.order.repository.js');
const { VinSapLogMiddleWare } = require('server/VIN_SAP/middlewares/vin-sap.log.middleware.js');
const { parseQuery } = require('server/core/common.js');

const OrderRoutesFactory = ({ app }) => {

  app.route('/vin/sap/orders').get(Controller(async (req, res, next) => {
    const result = { total: 0, items: [] }

    let { skip, limit, filter, fields } = parseQuery({ query: { ...req.query, ...req.body } });

    result.total = await VinSapOrderRepository.count(filter);

    if (result.total > 0) {
      result.items = await VinSapOrderRepository.find(filter, fields).skip(skip).limit(limit).sort({ _last_sync_at: -1 }).lean(true);
    }

    return res.json(result);
  }));

  app.route('/vin/sap/orders').delete(Controller(async (req, res, next) => {
    const result = { found: 0, deleted: 0 };

    let { filter } = parseQuery({ query: { ...req.query, ...req.body } });

    const delete_result = await VinSapOrderRepository.deleteMany(filter);

    result.found = delete_result.n;
    result.deleted = delete_result.deletedCount;

    return res.json(result);
  }));

  app.route('/vin/sap/saleorders').get(Controller(async (req, res, next) => {
    const result = { total: 0, items: [] }

    let { skip, limit, filter, fields } = parseQuery({ query: { ...req.query, ...req.body } });

    filter._kind = 'SO';

    result.total = await VinSapOrderRepository.count(filter);

    if (result.total > 0) {
      result.items = await VinSapOrderRepository.find(filter, fields).skip(skip).limit(limit).sort({ _last_sync_at: -1 }).lean(true);
    }

    return res.json(result);
  }));

  app.route('/vin/sap/orders/:OrderId').get(Controller(async (req, res, next) => {
    let OrderId = req.params['OrderId'];

    const filter = { OrderId };

    const found_order = await VinSapOrderRepository.findOne(filter).lean(true);

    if (!found_order) { 
      return res.status(404).json({ message: `No order found with OrderId = ${OrderId}` });
    }

    return res.json(found_order);
  }));

  app.route('/vin/sap/orders/:OrderId').delete(Controller(async (req, res, next) => {
    let OrderId = req.params['OrderId'];

    const filter = { OrderId };

    const deleted_order = await VinSapOrderRepository.findOneAndDelete(filter).lean(true);

    if (!deleted_order) { 
      return res.status(404).json({ message: `No order found with OrderId = ${OrderId}` });
    }

    return res.json({ deleted_order });
  }));

  app.route('/vin/sap/saleorders').post(VinSapLogMiddleWare.write, Controller(async (req, res, next) => {
    const data = _.get(req.body, 'OrderInfo');
  
    if (!data) {
      return res.status(400).json({ message: 'invalid data' });
    }

    const { OrderId } = data;

    if (!OrderId) {
      return res.status(400).json({ message: `Invalid OrderId = ${orderId}` });
    }

    const exists_order = await VinSapOrderRepository.findOne({ OrderId }).lean(true);

    if (exists_order) {
      return res.status(400).json({ message: `OrderId ${OrderId} has been created before.`});
    }
  
    const vin_sap_order_data = merge({}, data, { 
      eOrder: 'SO-' + SimpleID(),
      _kind: 'SO',
      _last_sync_at: new Date()
    });
  
    const created_vin_sap_order = await VinSapOrderRepository.create(vin_sap_order_data);

    return res.json({
      soNumber: created_vin_sap_order.eOrder,
      status: 'success',
      code: null,
      message: null,
    });
  }));
  
  app.route('/vin/sap/saleorders:OrderId').patch(VinSapLogMiddleWare.write, Controller(async (req, res, next) => {
    let OrderId = req.params['OrderId'];

    const data = req.body;
  
    if (!data) {
      return res.status(400).json({ message: 'invalid data' });
    }

    const found_order = await VinSapOrderRepository.findOne({ OrderId }).lean(true);
  
    if (!found_order) { 
      return res.status(404).json({ message: `No order found with OrderId = ${OrderId}` })
    }
  
    const vin_sap_order_data = merge(found_order, {
      _last_sync_at: new Date()
    });
  
    const updated_vin_sap_order = await VinSapOrderRepository.findOneAndUpdate(
      { OrderId }, 
      { $set: vin_sap_order_data },
      { new: true, lean: true }
    );
  
    return res.json({
      soNumber: updated_vin_sap_order.eOrder,
      status: 'success',
      code: null,
      message: null,
    });
  }));
}

module.exports = OrderRoutesFactory;