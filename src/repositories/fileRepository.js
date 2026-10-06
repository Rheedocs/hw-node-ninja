const fs = require('node:fs');

/**
 * Creates asynchronous access to one text file.
 * @param {string} filePath
 * @returns {import('../contracts').FileRepository}
 */
function createFileRepository(filePath) {
    return {
        readFile: () => fs.promises.readFile(filePath, 'utf8'),
        writeFile: (content) => fs.promises.writeFile(filePath, content, 'utf8'),
    };
}

module.exports = { createFileRepository };
