'use strict';

const _ = require('lodash');
const { merge, SimpleID } = require('server/core/common.js');
const { OrderRepository } = require('server/ETP/repositories/etp.order.repository.js');
const { EtpLogMiddleWare } = require('server/ETP/middlewares/etp.log.middleware.js');

const OrderRoutesFactory = ({ app }) => {

  app.route('/ETPConnect/Orders').get(async (req, res, next) => {
    const result = { total: 0, items: [] }

    const filter = { ...req.query, ...req.body };

    result.total = await OrderRepository.count(filter);

    if (result.total > 0) {
      result.items = await OrderRepository.find(filter).sort({ last_sync_at: -1 }).lean(true);
    }

    return res.json(result);
  });

  app.route('/ETPConnect/RESTOMSService/Service/ORDADD_R').post(EtpLogMiddleWare.write, async (req, res, next) => {
    const data = _.get(req.body, 'OmniChannelOrder');
  
    if (!data) {
      return res.status(400).json({ message: 'invalid data' });
    }
  
    const etp_order_data = merge({}, data, { 
      ocOrderID: SimpleID(),
      last_sync_at: new Date()
    });
  
    const created_etp_order = await OrderRepository.create(etp_order_data);

    return res.json(Object.assign({}, req.body, { OmniChannelOrder: created_etp_order.toObject() }, {
      "Response": {
        "RespCode": "0000",
        "RespMsg": "Order Save SuccessFully."
      }
    }));
  });
  
  app.route('/ETPConnect/RESTOMSService/Service/ORDCANCL_R').post(EtpLogMiddleWare.write, async (req, res, next) => {
    const data = _.get(req.body, 'OmniChannelOrder');
  
    if (!data) {
      return res.status(400).json({ message: 'invalid data' });
    }

    const { SourceOrderNumber, OrderStatusRequest, CancelReason } = data;
  
    const found_order = await OrderRepository.findOne({ SourceOrderNumber }).lean(true);
  
    if (!found_order) { 
      return res.status(400).json({ message: `No order found with SourceOrderNumber = ${SourceOrderNumber}` })
    }
  
    const etp_order_data = merge(found_order, {
      OrderStatus: OrderStatusRequest === '14' ? 'Cancelled': OrderStatusRequest,
      OrderCancellation: {
        Reason: CancelReason
      },
      last_sync_at: new Date()
    });
  
    const cancelled_etp_order = await OrderRepository.findOneAndUpdate(
      { SourceOrderNumber }, 
      { $set: etp_order_data },
      { new: true, lean: true }
    );
  
    return res.json(Object.assign({}, req.body, {
      "Response": {
        "RespCode": "0000",
        "RespMsg": "Order Save SuccessFully."
      }
    }));
  });
}

module.exports = OrderRoutesFactory;