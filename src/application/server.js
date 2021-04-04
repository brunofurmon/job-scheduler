const serverBuilder = () => ({
    start: () => {
        console.debug('Server is built');
    }
});

module.exports = {
    serverBuilder
};
