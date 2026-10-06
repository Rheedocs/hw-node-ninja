const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { createRequestEvents } = require('../src/middleware/requestEvents');
//ARRANGE
test('createRequestEvents_requestEmitted_callsNextOnce', () => {
    const emitter = new EventEmitter();
    const events = [];
    emitter.on('request', (event) => events.push(event));

    const middleware = createRequestEvents(emitter);
    let nextCalls = 0;
//Act
    middleware({ method: 'GET', path: '/read-file' }, {}, () => {
        nextCalls += 1;
    });
//ASSERT
    assert.equal(nextCalls, 1);
    assert.deepEqual(events, [{ method: 'GET', path: '/read-file' }]);
});
