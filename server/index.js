'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const directory = require('serve-index');
const { MongoRepository } = require('server/core/mongo-repository');
const { ERR_SERVER_FAILED } = require('server/core/errors');

const Server = () => {  
  const server = {
    _app: express(),
    _config: null,
    config: config => {
      server._config = config;
      MongoRepository.config(config.MongoDB);
      server.configPreMiddleWares();
      server.configRoutes();
      server.configPostMiddleWares();

      return server;
    },
    configPreMiddleWares() {
      const app = server._app;

      app.use(bodyParser.urlencoded({
        extended: true,
        limit: '50mb'
      }));
      app.use(bodyParser.json({ limit: '50mb' }));
    },
    configPostMiddleWares() {
      const app = server._app;

      app.use((error, req, res, next) => {
        const server_error = new ERR_SERVER_FAILED(error);

        server_error.log();

        return res.status(500).json(server_error.clientView());
      })
    },
    configRoutes() {
      const app = server._app;

      require('server/ETP/routes/etp.log.route.js')({ app });
      require('server/ETP/routes/etp.order.route.js')({ app });
      require('server/ETP/routes/etp.customer.route.js')({ app });
      require('server/VIN_SAP/routes/vin-sap.order.route')({ app });
      require('server/VIN_SAP/routes/vin-sap.log.route')({ app });

      app.route('/').get((req, res, next) => res.redirect('/docs'));

      app.use('/docs', 
        express.static('docs', { extensions: ['html', 'htm', 'md'], index: ['index.html', 'index.html', 'index.md'] }),
        directory('docs', {'icons': true})
      );

      app.use('/files', directory('public/files', {'icons': true}));
    },
    init: async () => {
      const config = server._config;
      
      await Promise.all([
        MongoRepository.init(config.MongoDB)
      ]);

      return server;
    },
    start: async () => {
      const { host, port } = server._config.RestfulServer;

      return new Promise(resolve => {
        server._app.listen(port, host, () => {
          console.log(`Server's listening on: ${host || 'http://localhost'}:${port}`);
        });
        return resolve();
      });
    }
  };

  return server;
};

module.exports = { Server };

