const { logEvents } = require('./logEvents');
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const emitter = new MyEmitter();

// emitter.on('log', (msg) => logEvents(msg));

// emitter.emit('log', 'server running');
