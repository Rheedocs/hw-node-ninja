const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter, once } = require('node:events');
const { createApp } = require('../src/app');

/**
 * @param {() => Promise<string>} readFile
 * @returns {import('../src/contracts').FileRepository}
 */
function createFakeRepository(readFile = async () => 'Tekst fra fake') {
    return {
        readFile,
        writeFile: async () => {},
    };
}

/**
 * @param {import('node:test').TestContext} context
 * @param {import('../src/contracts').FileRepository} fileRepository
 * @param {import('node:events').EventEmitter} emitter
 */
async function startApp(context, fileRepository, emitter = new EventEmitter()) {
    const app = createApp({ fileRepository, emitter });
    const server = app.listen(0);

    context.after(async () => {
        server.close();
        await once(server, 'close');
    });
    await once(server, 'listening');

    const address = server.address();
    return `http://127.0.0.1:${address.port}`;
}

test('getReadFile_repositoryReturnsText_returns200AndContent', async (context) => {
    // Arrange
    const url = await startApp(context, createFakeRepository());

    // Act
    const response = await fetch(`${url}/read-file`);

    // Assert
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { content: 'Tekst fra fake' });
});

test('getReadFile_repositoryFails_returns500', async (context) => {
    // Arrange
    const repository = createFakeRepository(async () => {
        throw new Error('read failed');
    });
    const url = await startApp(context, repository);

    // Act
    const response = await fetch(`${url}/read-file`);

    // Assert
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), { error: 'Kunne ikke læse filen.' });
});

test('postWriteFile_contentMissing_returns400', async (context) => {
    // Arrange
    const url = await startApp(context, createFakeRepository());

    // Act
    const response = await fetch(`${url}/write-file`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
    });

    // Assert
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), {
        error: 'Feltet content skal være en tekststreng.',
    });
});

test('getUnknownRoute_noRouteMatches_returns404', async (context) => {
    // Arrange
    const url = await startApp(context, createFakeRepository());

    // Act
    const response = await fetch(`${url}/unknown`);

    // Assert
    assert.equal(response.status, 404);
});

test('getReadFile_requestReceived_emitsRequestEvent', async (context) => {
    // Arrange
    const emitter = new EventEmitter();
    const events = [];
    emitter.on('request', (event) => events.push(event));
    const url = await startApp(context, createFakeRepository(), emitter);

    // Act
    await fetch(`${url}/read-file`);

    // Assert
    assert.deepEqual(events, [{ method: 'GET', path: '/read-file' }]);
});
