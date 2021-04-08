const { createContainer, asFunction } = require('awilix');

const mongooseBuilder = require('./infrastructure/database/mongoose');

const serverBuilder = require('./application/server');
const workerBuilder = require('./application/worker');

const healthcheckControllerBuilder = require('./application/controllers/healthcheckController');

const loggerBuilder = require('./infrastructure/logger');
const router = require('./application/router');

const messageBusBuilder = require('./infrastructure/messaging/inMemoryMessageBus');

const jobRepositoryBuilder = require('./infrastructure/database/repository/jobs/mongoRepository');
const jobSchedulerBuilder = require('./infrastructure/jobScheduler');
const heavyControllerBuilder = require('./application/controllers/heavyController');

const container = createContainer().register({
    logger: asFunction(loggerBuilder).singleton(),
    server: asFunction(serverBuilder).singleton(),

    router: asFunction(router).singleton(),
    worker: asFunction(workerBuilder).singleton(),

    healthcheckController: asFunction(healthcheckControllerBuilder).singleton(),
    heavyController: asFunction(heavyControllerBuilder).singleton(),

    messageBus: asFunction(messageBusBuilder).singleton(),

    mongoose: asFunction(mongooseBuilder).singleton(),
    jobRepository: asFunction(jobRepositoryBuilder).singleton(),
    jobScheduler: asFunction(jobSchedulerBuilder).singleton()
});

module.exports = container;
