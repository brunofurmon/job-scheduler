const util = require('util');

const { dispatchEvents } = require('../domain/jobHandlers/index');

module.exports = ({ logger, messageBus }) => ({
    start: async () => {
        const { JOB_TOPIC } = process.env;

        try {
            logger.debug(`Initializing Reader on topic '${JOB_TOPIC}'`);
            messageBus.subscribe(JOB_TOPIC, dispatchEvents);

            logger.info('Worker started');
        } catch (err) {
            logger.error('Problem initializing worker dependencies', {
                error: util.inspect(err)
            });
        }
    }
});
