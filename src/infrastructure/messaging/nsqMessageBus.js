const inspect = require('util');
const { Writer, Reader } = require('nsqjs');

module.exports = ({ logger }) => {
    const { NSQ_WRITER_ADDR, NSQ_READER_ADDR } = process.env;

    const writer = () => {
        const writerOptions = {
            deflate: true,
            snappy: false
        };

        const [writerHost, writerPort] = NSQ_WRITER_ADDR.split(':');
        const nsqWriter = new Writer(writerHost, writerPort, writerOptions);

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

        const internalReader = new Reader(topic, channel, readerOptions);
        internalReader.connect();

        return internalReader;
    };

    return {
        reader,
        writer
    };
};
