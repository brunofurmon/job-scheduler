const Koa = require('koa');
const compress = require('koa-compress');
const bodyParser = require('koa-bodyparser');
const util = require('util');

const { SERVER_PORT } = process.env;

module.exports = ({ logger, router }) => {
    const app = new Koa();

    app.use(compress())
        .use(bodyParser({ enableTypes: ['json'], jsonLimit: '1mb' }))
        .use(router.routes());

    return {
        app,
        start: async () => {
            try {
                app.listen(SERVER_PORT, () => {
                    logger.info(`Server listening on ${SERVER_PORT}`);
                });
            } catch (err) {
                logger.error('Problem initializing server', {
                    error: util.inspect(err)
                });
                process.exit(1);
            }
        }
    };
};
