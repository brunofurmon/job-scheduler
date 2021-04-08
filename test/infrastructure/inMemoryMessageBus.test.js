const messageBusBuilder = require('../../src/infrastructure/messaging/inMemoryMessageBus');

describe('Infrastructure -> inMemoryMessageBus', () => {
    describe('send', () => {
        it('Should ignore message when there are no subscribers to topic', () => {
            const { publish } = messageBusBuilder();

            const result = publish('unknown topic', {
                question: 'Anyone listening?'
            });
            expect(result).toEqual(undefined);
        });

        it('Should publish a message to a populated channel', () => {
            const { publish, subscribe } = messageBusBuilder();
            let num = 0;
            const callback = () => {
                num = 1;
            };
            const topicName = 'topic1';
            subscribe(topicName, callback);

            publish(topicName, null);

            expect(num).toEqual(1);
        });
    });

    describe('subscribe', () => {
        it('Should run multiple subscribers', () => {
            const { publish, subscribe } = messageBusBuilder();
            let num = 0;
            const callback = () => {
                num += 1;
            };
            const topicName = 'topic1';
            // 2x
            subscribe(topicName, callback);
            subscribe(topicName, callback);

            publish(topicName, null);

            expect(num).toEqual(2);
        });
    });
});
