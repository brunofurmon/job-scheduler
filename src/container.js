const { createContainer, asFunction } = require('awilix');

const mongooseBuilder = require('./infrastructure/database/mongoose');

const serverBuilder = require('./application/server/server');
const workerBuilder = require('./application/worker/worker');

const healthcheckControllerBuilder = require('./application/server/controllers/healthcheckController');
const heavyControllerBuilder = require('./application/server/controllers/heavyController');

const loggerBuilder = require('./infrastructure/logger');
const router = require('./application/server/router');

const messageBusBuilder = require('./infrastructure/messaging/nsqMessageBus');

const jobRepositoryBuilder = require('./infrastructure/database/repository/jobs/mongoRepository');
const jobSchedulerBuilder = require('./infrastructure/jobScheduler');

const container = createContainer().register({
    logger: asFunction(loggerBuilder).singleton(),

    server: asFunction(serverBuilder).singleton(),
    worker: asFunction(workerBuilder).singleton(),

    router: asFunction(router).singleton(),
    healthcheckController: asFunction(healthcheckControllerBuilder).singleton(),
    heavyController: asFunction(heavyControllerBuilder).singleton(),

    messageBus: asFunction(messageBusBuilder).singleton(),

    mongoose: asFunction(mongooseBuilder).singleton(),
    jobRepository: asFunction(jobRepositoryBuilder).singleton(),
    jobScheduler: asFunction(jobSchedulerBuilder).singleton()
});

module.exports = container;
