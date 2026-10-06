const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { attachRequestLogger } = require('../src/events/requestLogger');
//ARRANGE
test('attachRequestLogger_requestEmitted_writesMethodAndPath', () => {
    const emitter = new EventEmitter();
    const lines = [];
//ACT
    attachRequestLogger(emitter, (line) => lines.push(line));
    emitter.emit('request', { method: 'GET', path: '/read-file' });
//ASSERT
    assert.deepEqual(lines, ['GET /read-file']);
});
