module.exports = () => {
    // Internal topics and handlers
    // "topic-name": [func, func, ... func]
    const topics = {};

    const publish = (topicName, callback) => {
        if (!(topicName in topics)) {
            topics[topicName] = [];
        }
        topics[topicName].push(callback);
    };

    const send = (topicName, payload) => {
        // discard if no one was listening
        if (!(topicName in topics)) {
            return;
        }

        const callbacks = topics[topicName];
        Promise.all(callbacks.map(callback => callback(payload)));
    };

    return {
        send,
        publish
    };
};
