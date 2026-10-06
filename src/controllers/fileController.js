/**
 * @typedef {{ body?: { content?: unknown } | null }} HttpRequest
 */

/**
 * @typedef {{
 *   status: (statusCode: number) => {
 *     json: (body: Record<string, string>) => unknown
 *   }
 * }} HttpResponse
 */

/**
 * @typedef {Object} FileController
 * @property {(req: HttpRequest, res: HttpResponse) => Promise<void>} handleReadFile
 * @property {(req: HttpRequest, res: HttpResponse) => Promise<void>} handleWriteFile
 */

/**
 * Creates HTTP handlers for file operations.
 * @param {import('../contracts').FileService} fileService
 * @returns {FileController}
 */
function createFileController(fileService) {
    async function handleReadFile(req, res) {
        try {
            const content = await fileService.readContent();
            res.status(200).json({ content });
        } catch {
            res.status(500).json({ error: 'Kunne ikke læse filen.' });
        }
    }

    async function handleWriteFile(req, res) {
        const content = req.body?.content;
        if (typeof content !== 'string') {
            res.status(400).json({ error: 'Feltet content skal være en tekststreng.' });
            return;
        }

        try {
            await fileService.writeContent(content);
            res.status(200).json({ message: 'Filen blev skrevet.' });
        } catch {
            res.status(500).json({ error: 'Kunne ikke skrive til filen.' });
        }
    }

    return { handleReadFile, handleWriteFile };
}

module.exports = { createFileController };
