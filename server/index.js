'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { MongoRepository } = require('server/core/mongo-repository');

const Server = () => {  
  const server = {
    _app: express(),
    _config: null,
    config: config => {
      server._config = config;
      MongoRepository.config(config.MongoDB);
      server.configPreMiddleWares();
      server.configRoutes();

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
    configRoutes() {
      const app = server._app;

      require('server/ETP/routes/etp.log.route.js')({ app });
      require('server/ETP/routes/etp.order.route.js')({ app });
      require('server/ETP/routes/etp.customer.route.js')({ app });

      app.route('/').get((req, res, next) => res.send('Hi, how can i help you ?'));
      app.use('/docs', express.static('docs', { extensions: ['html', 'htm', 'md'], index: ['index.html', 'index.html', 'index.md'] }))
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
          console.log(`Server's listening on port ${port}`);
        });
        return resolve();
      });
    }
  };

  return server;
};

module.exports = { Server };

