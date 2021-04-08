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

    const queueJob = ({ messageBus }) => {
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

        jobRepository(job).save();

        messageBus.publish(JOB_TOPIC, job);

        return job;
    };

    const getJob = id => {
        assertInitialized();

        return jobRepository.byJobKey(prefixedKey(id));
    };

    const startJob = id => {
        assertInitialized();

        const job = getJob(id);

        if (!job) {
            return;
        }

        job.status = jobStateEnum.RUNNING;

        job.save();
    };

    // TEST
    const cancelJob = id => {
        assertInitialized();

        const job = getJob(id);

        if (!job) {
            return;
        }

        job.status = jobStateEnum.CANCELED;

        job.save();
    };

    const isCanceled = id => {
        assertInitialized();

        const job = getJob(id);

        if (!job) {
            return false;
        }

        return job.status === jobStateEnum.CANCELED;
    };

    const updateJob = job => {
        assertInitialized();

        if (!job) {
            return;
        }
        job.updatedAt.push(new Date().toISOString());

        jobRepository.update(job.jobKey, job);
    };

    const completeJob = id => {
        assertInitialized();

        const job = getJob(id);

        if (!job) {
            return;
        }

        job.status = jobStateEnum.COMPLETED;
        job.completedAt = new Date().toISOString();

        job.save();
    };

    const failJob = id => {
        assertInitialized();

        const job = getJob(id);

        if (!job) {
            return;
        }

        job.status = jobStateEnum.FAILED;
        job.completedAt = new Date().toISOString();

        job.save();
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
