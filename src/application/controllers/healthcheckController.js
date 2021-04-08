const { OK, INTERNAL_SERVER_ERROR } = require('http-status');

module.exports = ({ mongoose, logger }) => {
    const live = async ctx => {
        ctx.status = OK;
        ctx.body = {
            status: 'Looking good ;)'
        };
    };

    const ready = async ctx => {
        const mongoIsUp = mongoose.connection.readyState > 0;
        logger.error(mongoIsUp);
        ctx.status = mongoIsUp ? OK : INTERNAL_SERVER_ERROR;
        ctx.body = {
            status: mongoIsUp ? 'Looking good ;)' : 'Check mongo connection :('
        };
    };

    return {
        live,
        ready
    };
};
