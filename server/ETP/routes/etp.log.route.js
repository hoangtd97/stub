'use strict';

const { EtpLogMiddleWare } = require('server/ETP/middlewares/etp.log.middleware.js');

module.exports = ({ app }) => {
  app.route('/ETPConnect/logs').get(EtpLogMiddleWare.read);
  app.route('/ETPConnect/logs/search').post(EtpLogMiddleWare.read);
}