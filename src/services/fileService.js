/**
 * Creates file operations without exposing repository details.
 * @param {import('../contracts').FileRepository} fileRepository
 * @returns {import('../contracts').FileService}
 */
function createFileService(fileRepository) {
    return {
        async readContent() {
            return fileRepository.readFile();
        },
        async writeContent(content) {
            await fileRepository.writeFile(content);
        },
    };
}

module.exports = { createFileService };
