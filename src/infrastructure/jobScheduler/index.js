/* eslint-disable camelcase */
const { v4: uuidv4 } = require('uuid');

const { JOB_TOPIC } = process.env;

const jobStateEnum = Object.freeze({
    QUEUED: 'QUEUED',
    RUNNING: 'RUNNING',
    CANCELED: 'CANCELED',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED'
});

module.exports = ({ jobRepository }) => {
    let prefix;
    let jobInitialState;

    const assertInitialized = () => {
        if (!prefix) {
            throw new Error(
                'You must first initialize this module calling .config({jobPrefix, initialState});'
            );
        }
    };

    const config = jobInfo => {
        const { jobPrefix, initialState } = jobInfo;

        prefix = jobPrefix;
        jobInitialState = initialState;
    };

    const prefixedKey = id => `${prefix}::${id}`;

    const queueJob = async ({ messageBus }) => {
        assertInitialized();
        const jobId = uuidv4();
        const jobKey = prefixedKey(jobId);

        const job = {
            job_id: jobId,
            job_key: jobKey,
            job_type: `${prefix}`,
            status: jobStateEnum.QUEUED,
            data: jobInitialState,
            created_at: new Date().toISOString(),
            updated_at: [],
            completed_at: null
        };

        await jobRepository(job).save();

        const writer = messageBus.writer();
        writer.publish(JOB_TOPIC, job);

        return job;
    };

    const getJob = async id => {
        assertInitialized();

        const jobModel = await jobRepository.byJobKey(prefixedKey(id));

        if (!jobModel) {
            return null;
        }

        return {
            job_id: jobModel.job_id,
            job_key: jobModel.job_key,
            job_type: jobModel.job_type,
            created_at: jobModel.created_at,
            updated_at: jobModel.updated_at,
            status: jobModel.status,
            data: jobModel.data,
            completed_at: jobModel.completed_at
        };
    };

    const startJob = async id => {
        assertInitialized();

        const job = await jobRepository.byJobKey(prefixedKey(id));

        if (!job) {
            return;
        }

        job.status = jobStateEnum.RUNNING;
        await job.save();
    };

    // TEST
    const cancelJob = async id => {
        assertInitialized();

        const job = await jobRepository.byJobKey(prefixedKey(id));

        if (!job) {
            return;
        }

        job.status = jobStateEnum.CANCELED;
        await job.save();
    };

    const isCanceled = async id => {
        assertInitialized();

        const job = await getJob(id);

        if (!job) {
            return false;
        }

        return job.status === jobStateEnum.CANCELED;
    };

    const updateJob = async job => {
        assertInitialized();

        let existingJob = await jobRepository.byJobKey(prefixedKey(job.job_id));

        if (!job) {
            return;
        }

        existingJob = { ...existingJob, ...job };
        await existingJob.save();
    };

    const completeJob = async id => {
        assertInitialized();

        const job = await jobRepository.byJobKey(prefixedKey(id));

        if (!job) {
            return;
        }

        job.status = jobStateEnum.COMPLETED;
        job.completedAt = new Date().toISOString();

        await job.save();
    };

    const failJob = async id => {
        assertInitialized();

        const job = await jobRepository.byJobKey(prefixedKey(id));

        if (!job) {
            return;
        }

        job.status = jobStateEnum.FAILED;
        job.completedAt = new Date().toISOString();

        await job.save();
    };

    return {
        config,
        queueJob,
        startJob,
        cancelJob,
        isCanceled,
        updateJob,
        completeJob,
        failJob,
        getJob
    };
};
