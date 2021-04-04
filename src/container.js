const { createContainer, asFunction } = require('awilix');

const serverBuilder = require('./application/server');
const workerBuilder = require('./application/worker');

const healthcheckControllerBuilder = require('./application/controllers/healthcheckController');

const loggerBuilder = require('./infrastructure/logger');
const router = require('./application/router');

const messageBusBuilder = require('./infrastructure/messaging/inMemoryMessageBus');

const container = createContainer().register({
    logger: asFunction(loggerBuilder).singleton(),
    server: asFunction(serverBuilder).singleton(),

    router: asFunction(router).singleton(),
    worker: asFunction(workerBuilder).singleton(),

    healthcheckController: asFunction(healthcheckControllerBuilder).singleton(),

    messageBus: asFunction(messageBusBuilder).singleton()
});

module.exports = container;
