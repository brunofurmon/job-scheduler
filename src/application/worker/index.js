const container = require('../../container');

const worker = container.resolve('worker');

(async () => {
    await worker.start();
})();
