const heavyJobInfo = require('../jobs/heavyJobInfo');
const { heavyCpuInMs } = require('../business/heavy');

const handleJob = async (payload, { logger, jobScheduler }) => {
    const { messageData } = payload;
    const { jobType, jobId } = messageData;

    logger.info(`Received Job ${jobType} with id ${jobId}`, { payload });

    switch (jobType) {
        case 'job::heavy': {
            jobScheduler.config(heavyJobInfo);
            const { timeMs } = payload;
            heavyCpuInMs(timeMs);
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
