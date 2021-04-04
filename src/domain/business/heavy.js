function heavyCpuInMs(ms) {
    let shouldRun = true;
    const now = new Date().getTime();

    while (shouldRun) {
        // eslint-disable-next-line no-unused-expressions
        Math.random() * Math.random();
        if (new Date().getTime() > now + ms) {
            shouldRun = false;
        }
    }
}

module.exports = {
    heavyCpuInMs
};
