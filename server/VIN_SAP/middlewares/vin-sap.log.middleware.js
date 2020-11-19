'use strict';

const { LogMiddleWareFactory } = require('server/core/log.middleware.js');

const VinSapLogMiddleWare = LogMiddleWareFactory({ name: 'vin_sap_logs' });

module.exports = { VinSapLogMiddleWare };