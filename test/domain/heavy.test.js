const { heavyCpuInMs } = require('../../src/domain/business/heavy');

describe('domain -> heavy', () => {
    describe('heavyCpuInMs', () => {
        it('Should load CPU for ~5s', () => {
            expect(heavyCpuInMs(5000)).toBeDefined();
        });
    });
});
