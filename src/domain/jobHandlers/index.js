const heavyJobInfo = require('../jobs/heavyJobInfo');
const { heavyCpuInMs } = require('../business/heavy');

const handleJob = (payload, { logger, jobScheduler }) => {
    const { messageData } = payload;
    const { jobType, jobId } = messageData;

    logger.info(`Received Job ${jobType} with id ${jobId}`, { payload });

    switch (jobType) {
        case 'job::heavy': {
            jobScheduler.config(heavyJobInfo);

            jobScheduler.startJob();
            const { timeMs } = payload;
            try {
                heavyCpuInMs(timeMs, { logger, jobScheduler });
            } catch (error) {
                logger.error(error);
                jobScheduler.failJob();
            }
            jobScheduler.completeJob();
            break;
        }
        default:
            logger.warn(`Unknown jobType '${jobType}'. Ignored`);
            break;
    }
};

module.exports = {
    handleJob
};
