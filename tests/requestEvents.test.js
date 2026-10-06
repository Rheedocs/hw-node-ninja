const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { createRequestEvents } = require('../src/middleware/requestEvents');

test('createRequestEvents_requestEmitted_callsNextOnce', () => {
    const emitter = new EventEmitter();
    const events = [];
    emitter.on('request', (event) => events.push(event));

    const middleware = createRequestEvents(emitter);
    let nextCalls = 0;

    middleware({ method: 'GET', path: '/read-file' }, {}, () => {
        nextCalls += 1;
    });

    assert.equal(nextCalls, 1);
    assert.deepEqual(events, [{ method: 'GET', path: '/read-file' }]);
});
