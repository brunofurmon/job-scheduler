const { createContainer, asFunction } = require('awilix');

const { serverBuilder } = require('./application/server');
const { workerBuilder } = require('./application/worker');

const container = createContainer().register({
    server: asFunction(serverBuilder).singleton(),
    worker: asFunction(workerBuilder).singleton()
});

module.exports = container;
