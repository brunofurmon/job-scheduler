const Router = require('koa-router');

module.exports = ({ healthcheckController }) => {
    const router = new Router();

    // Healthcheck
    router.get('/healthcheck', healthcheckController.live);
    router.get('/readiness', healthcheckController.ready);

    return router;
};
