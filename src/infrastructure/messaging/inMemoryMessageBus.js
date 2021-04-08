module.exports = () => {
    // Internal topics and handlers
    // "topic-name": [func, func, ... func]
    const topics = {};

    const subscribe = (topicName, callback) => {
        if (!(topicName in topics)) {
            topics[topicName] = [];
        }
        topics[topicName].push(callback);
    };

    const publish = (topicName, payload) => {
        // discard if no one was listening
        if (!(topicName in topics)) {
            return;
        }

        const callbacks = topics[topicName];
        const promises =
            callbacks.length > 0
                ? callbacks.map(callback => callback(payload))
                : [];
        Promise.all(promises);
    };

    return {
        publish,
        subscribe
    };
};
