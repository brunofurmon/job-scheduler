const container = require('./container');

const server = container.resolve('server');

const worker = container.resolve('worker');

server.start();
worker.start();
