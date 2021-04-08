const container = require('./container');

const server = container.resolve('server');

(async () => {
    await server.start();
})();
