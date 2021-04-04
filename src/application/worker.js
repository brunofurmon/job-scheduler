module.exports = ({ logger }) => {
    const start = () => {
        logger.debug('Worker is built');
    };

    return {
        start
    };
};
