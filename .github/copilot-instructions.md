# Agent Instructions: Node ninja

This is a group assignment (Node.js). The goal is not only working code, but also using an AI agent systematically: Understand, plan, let the agent work, review the changes, test, accept or fix.

The agent implements small, clearly scoped parts only. Never build the whole system in one go. No code is accepted unless the whole group can explain it.

## The assignment

An Express server that reads and writes a text file asynchronously, logs every HTTP request through an EventEmitter, returns understandable errors and handles many requests at once.

## Build and run

```bash
npm install
npm start
npm test
node scripts/simulate_clients.js
```

The server runs on port 3000. (Update if the structure changes.)

## Architecture

CommonJS only (`require`, `module.exports`). Never ES modules.

Folders and files:

1. `src/server.js`: creates the real repository and the emitter, attaches the logger, builds the app with `createApp` and calls `listen`. Nothing else.
2. `src/app.js`: `createApp({ fileRepository, emitter })` builds the Express app: `express.json()`, request events, routes, 404 and error handler.
3. `src/routes/fileRoutes.js`: connects URL and method to a controller function. No logic.
4. `src/controllers/fileController.js`: the only layer that knows `req` and `res`. Validates input, picks the status code and catches errors with try/catch. Functions: `handleReadFile(req, res)` and `handleWriteFile(req, res)`.
5. `src/services/fileService.js`: business logic. Knows nothing about Express. Functions: `readContent()` and `writeContent(content)`.
6. `src/repositories/fileRepository.js`: the only place that uses `fs`. Async with `fs.promises`. Throws when the file cannot be read or written. Functions: `readFile()` and `writeFile(content)`.
7. `src/events/requestEmitter.js`: exports the one `EventEmitter` instance.
8. `src/events/requestLogger.js`: the listener. `attachRequestLogger(emitter, write = console.log)` calls `emitter.on('request', ...)`.
9. `src/middleware/requestEvents.js`: `createRequestEvents(emitter)` returns a middleware that calls `emitter.emit('request', { method, path })`.
10. `src/middleware/notFound.js` and `src/middleware/errorHandler.js`.
11. `data/data.txt`: the file the server reads and writes.
12. `scripts/simulate_clients.js`: sends at least 10 requests quickly.
13. `tests/`: tests, see below.
14. `src/contracts.js`: JSDoc types for `FileRepository`, `FileService`, `RequestEvent` and `AppDependencies`. Types only, no code. Fakes in tests must match these types.

Dependencies only point one way: routes, controller, service, repository. A layer never knows the layers above it.

Dependency injection: layers get their dependencies as parameters through factory functions and never create them themselves: `createFileRepository(filePath)`, `createFileService(fileRepository)`, `createFileController(fileService)`, `createFileRoutes(fileController)`. Wiring happens only in `server.js` and `app.js`.

File paths are built with `path.join(__dirname, ...)` in `server.js`, never relative to the folder the server was started from.

## Endpoints

| Method | Path | Success | Errors |
|---|---|---|---|
| GET | `/read-file` | 200 `{ "content": "..." }` | 500 `{ "error": "..." }` if the file cannot be read |
| POST | `/write-file` | 200 `{ "message": "..." }` | 400 if `content` is missing or not a string, 500 if the file cannot be written |
| any other | any other | | 404 `{ "error": "..." }` |

Request body for POST: `{ "content": "Ny tekst til filen" }`. Invalid JSON gives 400. All responses are JSON. Error texts are in Danish and understandable, never a stack trace. (Update if the group decides otherwise.)

## Events and logging

1. Event name: `request`. Payload: `{ method, path }`.
2. `emit` is called in the `requestEvents` middleware, before all routes, so 404 requests are logged too.
3. `on` is called in `requestLogger.js`. It prints e.g. `GET /read-file`.
4. Minimum log: method and path. Timestamp, persistent logging to file and statistics are extensions, added only after the core is tested.
5. `emit` sends the signal, `on` listens and reacts. The group must be able to explain the difference.

## Error handling

1. async/await with try/catch in the controller. Never callbacks.
2. Errors from the repository are thrown up to the controller. The controller answers 500 with an understandable Danish message.
3. Invalid input gives 400. Unknown route gives 404.
4. `errorHandler` is the last safety net, e.g. invalid JSON in the body gives 400.
5. The server must never crash because of a bad request or a missing file. No unhandled promise rejections.

## Express 5

1. `req.body` can be `undefined` when no body was sent. Use `req.body?.content`.
2. Old wildcard routes like `app.get('*')` do not work. Use `app.use(notFound)` as the last middleware.
3. `app.use(express.json())` comes before the routes.

## Code style

1. Identifiers in English. Comments and commit messages in Danish. User facing error messages in Danish.
2. Simple, readable code over clever solutions. The code must be explainable at the checkpoint.
3. Small functions with one responsibility. KISS, no unnecessary complexity. Structure and architecture are followed, but never at the cost of KISS: if a rule makes the code harder to explain, stop and ask the group.
4. Public functions use JSDoc comments (`/** ... */`) and refer to the types in `src/contracts.js`, e.g. `@param {import('../contracts').FileRepository} fileRepository`.
5. async/await, never callbacks. No new packages without asking. Use the built in `fetch` in scripts and tests, not axios.
6. Commit style: short, lowercase, conventional commits with the prefix in English and the text in Danish, e.g. `feat: tilføj read-file endpoint`.

## Tests

Follow `docs/unit-test-guide.md` (AAA, naming `method_scenario_expectedResult`, one thing per test).

Manual tests as a minimum:

| Test | Expected result |
|---|---|
| `GET /read-file`, file exists | 200 and correct content |
| File missing (rename `data/data.txt` temporarily) | 500 and understandable error |
| Valid `POST /write-file` | File is updated |
| Invalid POST data (no `content`, wrong type, broken JSON) | 400 and understandable error |
| Unknown route | 404 |
| Any request | A log event is emitted |
| 10 requests fast (`scripts/simulate_clients.js`) | Server answers all |

Quick test without a client, in PowerShell (use `curl.exe`, because `curl` is an alias for something else there):

```bash
curl.exe http://localhost:3000/read-file
curl.exe -X POST -H "Content-Type: application/json" -d "{\"content\":\"Ny tekst\"}" http://localhost:3000/write-file
```

## Git rules

1. Work only on the branch for the current issue (e.g. `3/write_file`).
2. Only edit files listed in the issue. Ask before touching others.
3. Only `server.js` and `app.js` wire things together. Do not edit them outside the issue that owns them.
4. Before starting and before a PR: merge `main` into the current branch.
5. On merge conflicts: stop and show both sides. Never accept theirs or ours blindly.
6. If the branch, files or build look wrong: stop and report. Do not repair something you do not understand.
7. Never commit `node_modules/` or `.idea/`.
8. If a file from another issue is missing, use a small fake with the same functions. Never create the real one yourself.
9. Never change `src/contracts.js` without a separate issue.

## Working with the agent

Every task given to the agent follows this structure:

```
Opgave: What should be changed?
Kontekst: Which files are relevant?
Krav: What must the solution do?
Må ikke ændres: What must the agent stay away from?
Test: How do we know it works?
```

Before a bigger change: first explain the control flow from request to response, find possible problems with async and error handling, and make a short plan. Wait for our OK. Implement only the agreed change.

Order of work:

1. `server.js` and `app.js`: Express starts and answers, 404 works
2. `GET /read-file`: repository, service, controller and route
3. `POST /write-file`: validation (400) and writing
4. EventEmitter: `emit` in `requestEvents`, `on` in `requestLogger`
5. `errorHandler` and the error scenario (missing file, invalid input)
6. `scripts/simulate_clients.js` with 10 requests
7. Tests in `tests/`

After every change: show which files and lines were changed, explain the change briefly, say which tests we should run and say if anything was changed that we did not ask for.

## Not the agent's job

The README answers must be in our own words: what happens in Node.js while the server waits for a file operation, which event we use and when it is emitted, the AI example and the final sentence. Also the answers for the individual checkpoint. The agent may explain code when we ask, but does not write these texts.

## Review mode

When asked for a review, the agent may point out problems in: async/await and error handling, unhandled errors, status codes, several requests at once (e.g. two writes to the same file at the same time), the EventEmitter setup, layer responsibilities and unnecessary complexity.

In review mode the agent must not change any code. Suggestions only.