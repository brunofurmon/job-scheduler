const { inspect } = require('util');

const { handleJob } = require('../domain/jobHandlers/index');

module.exports = ({ logger, messageBus, jobScheduler, jobRepository }) => {
    const start = () => {
        const { JOB_TOPIC } = process.env;

        try {
            logger.debug(`Initializing Reader on topic '${JOB_TOPIC}'`);

            const reader = messageBus.reader(JOB_TOPIC, 'job-scheduler');

            logger.info('Worker started');

            reader.on('message', async msg => {
                const messageContent = msg.json();

                try {
                    const touch = () => {
                        if (!msg.hasResponded) {
                            msg.touch();
                            setTimeout(touch, msg.timeUntilTimeout() - 1000);
                        }
                    };
                    const timeout = setTimeout(
                        touch,
                        msg.timeUntilTimeout() - 1000
                    );

                    handleJob(JOB_TOPIC, messageContent, {
                        logger,
                        jobScheduler,
                        jobRepository
                    });

                    if (timeout) {
                        clearTimeout(timeout);
                    }

                    msg.finish();
                } catch (error) {
                    msg.requeue(5);
                    logger.error(
                        'Error processing message! Message will be requeued',
                        {
                            messageId: msg.id,
                            error: inspect(error)
                        }
                    );
                    throw error;
                }
            });
        } catch (err) {
            logger.error('Problem initializing worker dependencies', {
                error: inspect(err)
            });
        }
    };

    return {
        start
    };
};
