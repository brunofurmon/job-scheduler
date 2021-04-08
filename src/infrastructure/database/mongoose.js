const mongoose = require('mongoose');

module.exports = () => {
    const { MONGO_URI } = process.env;

    const connectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    };

    mongoose.connect(MONGO_URI, connectionOptions);

    return mongoose;
};
