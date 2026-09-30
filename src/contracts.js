/**
 * Kontrakter for Node ninja.
 *
 * Kun JSDoc typer, ingen kode. Filen beskriver, hvilke funktioner lagene
 * tilbyder hinanden, så alle kan skrive mod de samme navne.
 * Ændres kun efter aftale i gruppen (eget issue).
 *
 * Brug i andre filer:
 * @param {import('../contracts').FileRepository} fileRepository
 */

/**
 * Filadgang. Det eneste sted der bruger fs.
 * @typedef {Object} FileRepository
 * @property {() => Promise<string>} readFile Læser filens indhold. Kaster en fejl, hvis filen ikke kan læses.
 * @property {(content: string) => Promise<void>} writeFile Skriver indhold til filen. Kaster en fejl, hvis det fejler.
 */

/**
 * Forretningslogik. Kender ikke Express.
 * @typedef {Object} FileService
 * @property {() => Promise<string>} readContent Returnerer filens indhold.
 * @property {(content: string) => Promise<void>} writeContent Gemmer nyt indhold i filen.
 */

/**
 * Payload for eventet `request`.
 * @typedef {Object} RequestEvent
 * @property {string} method HTTP metode, fx GET.
 * @property {string} path Sti, fx /read-file.
 */

/**
 * Det createApp får ind udefra.
 * @typedef {Object} AppDependencies
 * @property {FileRepository} fileRepository
 * @property {import('node:events').EventEmitter} emitter
 */

module.exports = {};