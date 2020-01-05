'use strict';

const { LogMiddleWareFactory } = require('server/core/log.middleware.js');

const EtpLogMiddleWare = LogMiddleWareFactory({ name: 'etp_logs' });

module.exports = { EtpLogMiddleWare };