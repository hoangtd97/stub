'use strict';

const _ = require('lodash');
const { merge, SimpleID } = require('server/core/common.js');
const { OrderRepository } = require('server/ETP/repositories/etp.order.repository.js');

const OrderRoutesFactory = ({ app }) => {

  app.route('/ETPConnect/RESTOMSService/Service/ORDADD_R').post(async (req, res, next) => {
    const data = _.get(req.body, 'OmniChannelOrder');
  
    if (!data) {
      return res.status(400).json({ message: 'invalid data' });
    }
  
    const etp_order_data = merge({}, data, { "ocOrderID": SimpleID() });
  
    const created_etp_order = await OrderRepository.create(etp_order_data);

    return res.json(Object.assign({}, req.body, { OmniChannelOrder: created_etp_order.toObject() }, {
      "Response": {
        "RespCode": "0000",
        "RespMsg": "Order Save SuccessFully."
      }
    }));
  });
  
  app.route('/ETPConnect/RESTOMSService/Service/ORDCANCL_R').post(async (req, res, next) => {
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
      }
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