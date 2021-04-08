const loadClass = require('mongoose-class-wrapper');

const JobSchemaV1 = require('../../schema/job');

module.exports = ({ mongoose }) => {
    const jobControlSchemaV1 = new JobSchemaV1(mongoose);

    jobControlSchemaV1.schema(mongoose).pre('save', function presave(next) {
        this.updated_at = new Date();
        next();
    });

    class JobSchemaV1Model {
        static byJobKey(jobKey) {
            return this.findOne({ job_key: jobKey }).exec();
        }
    }

    jobControlSchemaV1.schema(mongoose).plugin(loadClass, JobSchemaV1Model);

    return mongoose.model('jobControl', jobControlSchemaV1.schema(mongoose));
};
