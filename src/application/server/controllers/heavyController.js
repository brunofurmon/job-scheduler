const { OK, ACCEPTED, NOT_FOUND } = require('http-status');
const heavyJobInfo = require('../../../domain/jobs/heavyJobInfo');

module.exports = ({ logger, jobScheduler, messageBus }) => {
    const publishHeavyJob = async ctx => {
        const { timeMs } = ctx.request.body;

        const { initialState, jobPrefix } = heavyJobInfo;
        initialState.timeMs = timeMs;
        jobScheduler.config({ initialState, jobPrefix });

        const job = await jobScheduler.queueJob({ messageBus });

        logger.info(`Heavy Job with id ${job.job_id} scheduled`);

        ctx.status = ACCEPTED;
        ctx.body = {
            job: `/jobs/heavy/${job.job_id}`,
            cancelJob: `/jobs/heavy/${job.job_id}/cancel`
        };
    };

    const getHeavyJob = async ctx => {
        const { jobId } = ctx.params;

        jobScheduler.config(heavyJobInfo);

        const job = await jobScheduler.getJob(jobId);

        if (!job) {
            ctx.status = NOT_FOUND;
            return;
        }

        ctx.status = OK;
        ctx.body = job;
    };

    const cancelHeavyJob = async ctx => {
        const { jobId } = ctx.params;

        jobScheduler.config(heavyJobInfo);

        const job = await jobScheduler.getJob(jobId);

        if (!job) {
            ctx.status = NOT_FOUND;
            return;
        }
        await jobScheduler.cancelJob(jobId);

        ctx.status = OK;
        ctx.body = {
            job: `/jobs/heavy/${jobId}`
        };
    };

    return {
        publishHeavyJob,
        getHeavyJob,
        cancelHeavyJob
    };
};
