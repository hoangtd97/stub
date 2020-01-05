'use strict';

const { LogMiddleWareFactory } = require('server/core/log.middleware.js');

module.exports = ({ app }) => {
  const LogMiddleWare = LogMiddleWareFactory({ name: 'etp_logs' });

  app.route('/ETPConnect/*').all(LogMiddleWare.write);
  app.route('/logs').get(LogMiddleWare.read);
  app.route('/logs/search').post(LogMiddleWare.read);
}