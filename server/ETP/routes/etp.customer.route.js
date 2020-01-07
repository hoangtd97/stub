'use strict';

const _ = require('lodash');
const { merge, SimpleID } = require('server/core/common.js');
const { CustomerRepository } = require('server/ETP/repositories/etp.customer.repository');
const { EtpLogMiddleWare } = require('server/ETP/middlewares/etp.log.middleware.js');
const { parseQuery } = require('server/core/common.js');

const OrderRoutesFactory = ({ app }) => {

  app.route('/ETPConnect/Customers').get(async (req, res, next) => {
    const result = { total: 0, items: [] }

    let { skip, limit, filter } = parseQuery({ query: { ...req.query, ...req.body } });

    result.total = await CustomerRepository.count(filter);

    if (result.total > 0) {
      result.items = await CustomerRepository.find(filter).skip(skip).limit(limit).sort({ last_sync_at: -1 }).lean(true);
    }

    return res.json(result);
  });

  app.route('/ETPConnect/Customers/CustomerRefID/:CustomerRefID').get(async (req, res, next) => {
    const CustomerRefID = req.params['CustomerRefID'];

    const filter = { CustomerRefID };

    const found_customer = await CustomerRepository.findOne(filter).lean(true);

    if (!found_customer) { 
      return res.status(400).json({ message: `No customer found with CustomerRefID = ${CustomerRefID}` })
    }

    return res.json(found_customer);
  });

  app.route('/ETPConnect/RESTOMSService/Service/CUSTADD_R').post(EtpLogMiddleWare.write, async (req, res, next) => {
    const data = _.get(req.body, 'CustDetails.CustomerInfo');
  
    if (!data) {
      return res.status(400).json({ message: 'invalid data' });
    }  
    const etp_customer_data = merge({}, data, {
      "CustomerID": "ECOM" + SimpleID(),
      last_sync_at: new Date(),
    });
  
    const created_etp_customer = await CustomerRepository.create(etp_customer_data);
  
    return res.json(Object.assign({}, req.body, { CustDetails: { CustomerInfo: created_etp_customer } }, {
      "Response": {
        "RespCode": "0000",
        "RespMsg": "Customer Save SuccessFully."
      }
    }));
  });
  
  app.route('/ETPConnect/RESTOMSService/Service/CUSTUPD_R').post(EtpLogMiddleWare.write, async (req, res, next) => {
    const data = _.get(req.body, 'CustDetails.CustomerInfo');
  
    if (!data) {
      return res.status(400).json({ message: 'invalid data' });
    }  
    const etp_customer_id = _.get(data, 'CustomerID');
  
    if (!(_.isString(etp_customer_id) && etp_customer_id.length > 0)) {
      return res.status(400).json({ message: 'Invalid customer id' });
    }
  
    const found_customer = await CustomerRepository.findOne({ 'CustomerID': etp_customer_id }).lean(true);
  
    if (!found_customer) { 
      return res.status(400).json({ message: `No customer found with CustomerID = ${etp_customer_id}` });
    }
  
    const etp_customer_data = merge(found_customer, data, { last_sync_at: new Date() });
  
    const updated_etp_customer = await CustomerRepository.findOneAndUpdate(
      { 'CustomerID': etp_customer_id },
      { $set: etp_customer_data },
      { new: true, lean: true }
    );
  
    return res.json(Object.assign({}, req.body, { CustDetails: { CustomerInfo: updated_etp_customer } }, {
      "Response": {
        "RespCode": "0000",
        "RespMsg": "Customer Save SuccessFully."
      }
    }));
  });
  
  app.route('/ETPConnect/RESTOMSService/Service/CUSTADDUPD_R').post(EtpLogMiddleWare.write, async (req, res, next) => {
    const data = _.get(req.body, 'CustDetails.CustomerInfo');
  
    if (!data) { return next(new ERR({ status: 400, body: { message: 'invalid data' } }))}
  
    const customer_id = _.get(data, 'CustomerRefID');
  
    if (!(_.isString(customer_id) && customer_id.length > 0)) {
      return res.status(400).json({ message: 'Invalid customer id' });
    }
  
    const found_customer = await CustomerRepository.findOne({ 'CustomerRefID': customer_id }).lean(true);
  
    if (!found_customer) { 
      return res.status(400).json({ message: `No customer found with CustomerRefID = ${customer_id}` });
    }  
    const etp_customer_data = merge(found_customer, data, { last_sync_at: new Date() });
  
    const updated_etp_customer = await CustomerRepository.findOneAndUpdate(
      { 'CustomerRefID': customer_id },
      { $set: etp_customer_data },
      { new: true, lean: true }
    )
  
    return res.json(Object.assign({}, req.body, { CustDetails: { CustomerInfo: updated_etp_customer } }, {
      "Response": {
        "RespCode": "0000",
        "RespMsg": "Customer Save SuccessFully."
      }
    }));
  });
}

module.exports = OrderRoutesFactory;