'use strict';

const config = require('./config');
const { Server } = require('./server');

Server()
.config(config)
.init()
.then(server => server.start());