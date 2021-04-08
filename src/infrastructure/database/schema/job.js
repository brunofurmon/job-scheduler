let jobSchemaV1 = null;

module.exports = class {
    constructor(mongoose) {
        this.mongoose = mongoose;
    }

    schema() {
        if (jobSchemaV1 !== null) {
            return jobSchemaV1;
        }

        jobSchemaV1 = new this.mongoose.Schema({
            schema_version: {
                type: Number,
                index: true,
                default: 1
            },
            job_id: {
                type: String,
                index: true
            },
            job_key: {
                type: String
            },
            job_type: {
                type: String
            },
            status: {
                type: String
            },
            data: {
                type: Object
            },
            created_at: {
                type: Date,
                default: new Date()
            },
            updated_at: {
                type: Date
            },
            completed_at: {
                type: Date
            }
        });

        // Indices
        jobSchemaV1.index({ name: { value: 1 } }, { unique: true });

        // Middlewares
        jobSchemaV1.pre('save', next => {
            this.updated_at = new Date();
            next();
        });

        return jobSchemaV1;
    }
};
