const messageBusBuilder = require('../../src/infrastructure/messaging/inMemoryMessageBus');

describe('Infrastructure -> inMemoryMessageBus', () => {
    describe('send', () => {
        it('Should ignore message when there are no subscribers to topic', () => {
            const { send } = messageBusBuilder();

            const promise = send('unknown topic', {
                question: 'Anyone listening?'
            });
            expect(promise).toEqual(undefined);
        });

        it('Should send a message to a populated channel', () => {
            const { send, subscribe } = messageBusBuilder();
            let num = 0;
            const callback = () => {
                num = 1;
            };
            const topicName = 'topic1';
            subscribe(topicName, callback);

            send(topicName, null);

            expect(num).toEqual(1);
        });

        it('Should run multiple subscribers', () => {
            const { send, subscribe } = messageBusBuilder();
            let num = 0;
            const callback = () => {
                num += 1;
            };
            const topicName = 'topic1';
            // 2x
            subscribe(topicName, callback);
            subscribe(topicName, callback);

            send(topicName, null);

            expect(num).toEqual(2);
        });
    });

    describe('subscribe', () => {});
});
