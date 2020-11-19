'use strict';

const { Controller } = require('server/core/controller');
const { VinSapLogMiddleWare } = require('server/VIN_SAP/middlewares/vin-sap.log.middleware.js');

module.exports = ({ app }) => {
  app.route('/vin/sap/logs').get(Controller(VinSapLogMiddleWare.read));
  app.route('/vin/sap/logs/search').post(Controller(VinSapLogMiddleWare.read));
}