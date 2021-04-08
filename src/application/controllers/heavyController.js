const { OK } = require('http-status');

module.exports = ({ logger }) => {
    const publishHeavyJob = async ctx => {
        ctx.status = OK;

        // queue Job and get its ID
        const jobId = 42;

        logger.info(`Heavy Job with id ${jobId} queued`);
    };

    const getHeavyJob = async ctx => {
        const { jobId } = ctx.params;

        ctx.status = OK;
        ctx.body = jobId;
    };

    const cancelHeavyJob = async ctx => {
        ctx.status = OK;
    };

    return {
        publishHeavyJob,
        getHeavyJob,
        cancelHeavyJob
    };
};
