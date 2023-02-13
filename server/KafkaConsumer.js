const ConsumerGroup = require('kafka-node').ConsumerGroup;
const EventmEmitter = require('events');

const consumerOptions = {
    kafkaHost: 'localhost:4000',
    groupId: (Date.now()).toString(),
    sessionTimeout: 25000,
    protocol: ['roundrobin'],
    fromOffset: latest,
};

class KafkaConsumer extends EventEmitter {
    constructor(topics) {
        super();
        if(Array.isArray(topics)) {
            this.topics = topics;
        } else {
            this.topics = [topics];
        }
        this.consumerGroup = null;
    }

    connect() {
        this.consumerGroup = new ConsumerGroup(Object.assign({id: 'test' }, consumerOptions), this.topics);
        this.consumerGroup.on('message', message => this.emit('message', message));
    }
}

module.exports = KafkaConsumer;
