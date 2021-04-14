/* eslint-disable camelcase */
const heavyJobInfo = require('../jobs/heavyJobInfo');
const { performHeavyTaskInMs } = require('../business/heavy');

const handleJob = async (messageData, { logger, jobScheduler }) => {
    const { job_type, job_id } = messageData;

    logger.info(`Received Job ${job_type} with id ${job_id}`, { messageData });

    switch (job_type) {
        case heavyJobInfo.jobPrefix: {
            jobScheduler.config(heavyJobInfo);

            await jobScheduler.startJob();
            const { timeMs } = messageData.data;
            try {
                performHeavyTaskInMs(timeMs, { logger, jobScheduler });
            } catch (error) {
                logger.error(error);
                await jobScheduler.failJob();
            }
            await jobScheduler.completeJob();
            break;
        }
        default:
            logger.warn(`Unknown jobType '${job_type}'. Ignored`);
            break;
    }
};

module.exports = {
    handleJob
};
