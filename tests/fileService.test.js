const test = require('node:test');
const assert = require('node:assert/strict');
const { createFileService } = require('../src/services/fileService');

test('readContent_repositoryReturnsText_returnsText', async () => {
    const repository = { readFile: async () => 'Tekst fra repository', writeFile: async () => {} };
    const service = createFileService(repository);

    const content = await service.readContent();

    assert.equal(content, 'Tekst fra repository');
});

test('writeContent_repositoryReceivesText_completes', async () => {
    let writtenContent;
    const repository = {
        readFile: async () => '',
        writeFile: async (content) => { writtenContent = content; },
    };
    const service = createFileService(repository);

    await service.writeContent('Ny tekst');

    assert.equal(writtenContent, 'Ny tekst');
});

test('readContent_repositoryFails_throws', async () => {
    const repository = {
        readFile: async () => { throw new Error('read failed'); },
        writeFile: async () => {},
    };
    const service = createFileService(repository);

    await assert.rejects(() => service.readContent(), { message: 'read failed' });
});

test('writeContent_repositoryFails_throws', async () => {
    const repository = {
        readFile: async () => '',
        writeFile: async () => { throw new Error('write failed'); },
    };
    const service = createFileService(repository);

    await assert.rejects(() => service.writeContent('Ny tekst'), { message: 'write failed' });
});
