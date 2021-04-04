const { OK } = require('http-status');

module.exports = () => {
    const live = async ctx => {
        ctx.status = OK;
        ctx.body = {
            status: 'Looking good ;)'
        };
    };

    const ready = async ctx => {
        ctx.status = OK;
        ctx.body = {
            status: 'Looking good ;)'
        };
    };

    return {
        live,
        ready
    };
};
