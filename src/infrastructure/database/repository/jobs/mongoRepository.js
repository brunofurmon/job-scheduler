const loadClass = require('mongoose-class-wrapper');

const JobSchemaV1 = require('../../schema/job');

module.exports = ({ mongoose }) => {
    const jobSchemaV1 = new JobSchemaV1(mongoose);

    jobSchemaV1.schema(mongoose).pre('save', function presave(next) {
        this.updated_at = new Date();
        next();
    });

    class JobSchemaV1Model {
        static byJobKey(jobKey) {
            return this.findOne({ job_key: jobKey }).exec();
        }
    }

    jobSchemaV1.schema(mongoose).plugin(loadClass, JobSchemaV1Model);

    return mongoose.model('job', jobSchemaV1.schema(mongoose));
};
