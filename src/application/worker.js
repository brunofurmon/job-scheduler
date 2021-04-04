const workerBuilder = () => ({
    start: () => {
        console.debug('Worker is built');
    }
});

module.exports = {
    workerBuilder
};
