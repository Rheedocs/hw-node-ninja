const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { createFileRepository } = require('../src/repositories/fileRepository');

async function createTemporaryDirectory(t) {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'hw-node-ninja-'));
    t.after(() => fs.rm(directory, { recursive: true, force: true }));
    return directory;
}

test('readFile_fileExists_returnsContent', async (t) => {
    const directory = await createTemporaryDirectory(t);
    const filePath = path.join(directory, 'data.txt');
    await fs.writeFile(filePath, 'Midlertidig tekst', 'utf8');
    const repository = createFileRepository(filePath);

    const content = await repository.readFile();

    assert.equal(content, 'Midlertidig tekst');
});

test('writeFile_fileExists_updatesContent', async (t) => {
    const directory = await createTemporaryDirectory(t);
    const filePath = path.join(directory, 'data.txt');
    const repository = createFileRepository(filePath);

    await repository.writeFile('Ny tekst');
    const content = await fs.readFile(filePath, 'utf8');

    assert.equal(content, 'Ny tekst');
});

test('readFile_fileMissing_throws', async (t) => {
    const directory = await createTemporaryDirectory(t);
    const repository = createFileRepository(path.join(directory, 'missing.txt'));

    await assert.rejects(() => repository.readFile());
});

test('writeFile_parentDirectoryMissing_throws', async (t) => {
    const directory = await createTemporaryDirectory(t);
    const filePath = path.join(directory, 'missing', 'data.txt');
    const repository = createFileRepository(filePath);

    await assert.rejects(() => repository.writeFile('Ny tekst'));
});
