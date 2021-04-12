const { performHeavyTaskInMs } = require('../../src/domain/business/heavy');

describe('domain -> heavy', () => {
    describe('performHeavyTaskInMs', () => {
        it('Should load CPU for ~5s', () => {
            expect(performHeavyTaskInMs(5000)).toBeUndefined();
        });
    });
});
