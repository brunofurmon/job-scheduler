const inspect = require('util');
const { Writer, Reader } = require('nsqjs');

module.exports = ({ logger }) => {
    const { NSQ_WRITER_ADDR, NSQ_READER_ADDR } = process.env;

    const writer = () => {
        const writerOptions = {
            deflate: true,
            snappy: false
        };

        const nsqWriter = new Writer(NSQ_WRITER_ADDR, 4150, writerOptions);

        if (!nsqWriter.connected) {
            nsqWriter.connect();
        }

        nsqWriter
            .on('ready', () => {
                logger.debug('NSQ writer connection is ready');
            })
            .on('error', error => {
                logger.error('NSQ writer connection had an error', {
                    error: inspect.inspect(error)
                });
            })
            .on('closed', () => {
                logger.info('NSQ writer connection is closed');
            });

        return nsqWriter;
    };

    const reader = (topic, channel) => {
        const readerOptions = {
            deflate: true,
            snappy: false,
            lookupdHTTPAddresses: NSQ_READER_ADDR,
            clientId: `${process.env.npm_package_name}/${process.env.npm_package_version}`,
            maxInFlight: 1,
            messageTimeout: 6e4,
            maxAttempts: 3
        };

        return new Reader(topic, channel, readerOptions);
    };

    return {
        reader,
        writer
    };
};
