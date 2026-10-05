# Agent Instructions: Node ninja

This is a group assignment (Node.js). The goal is not only working code, but also using an AI agent systematically: Understand, plan, let the agent work, review the changes, test, accept or fix.

The agent implements small, clearly scoped parts only. Never build the whole system in one go. No code is accepted unless the whole group can explain it.

## Definition of done

A task is done only when all of this is true:

1. `npm run check` is green. It runs `npm test` and `npm run lint`.
2. The manual tests that match the change have been run (see Tests).
3. The agent has reported the change (see After every change).

If anything is red, the task is not done. Never make a test, a lint rule or `eslint.config.js` weaker to get green. Fix the code instead. Changes to `eslint.config.js` need their own issue.

## The assignment

An Express server that reads and writes a text file asynchronously, logs every HTTP request through an EventEmitter, returns understandable errors and handles many requests at once.

## Build and run

```bash
npm install
npm start
npm test
npm run lint
npm run check
node scripts/simulate_clients.js
```

The server runs on port 3000. (Update if the structure changes.)

## Architecture

CommonJS only (`require`, `module.exports`). Never ES modules.

Folders and files:

1. `src/server.js`: creates the real repository and the emitter, attaches the logger, builds the app with `createApp` and calls `listen`. Nothing else.
2. `src/app.js`: `createApp({ fileRepository, emitter })` builds the Express app: `express.json()`, request events, the two routes (`app.get('/read-file', ...)` and `app.post('/write-file', ...)` pointing at the controller functions), 404 and error handler.
3. `src/controllers/fileController.js`: the only layer that knows `req` and `res`. Validates input, picks the status code and catches errors with try/catch. Functions: `handleReadFile(req, res)` and `handleWriteFile(req, res)`.
4. `src/services/fileService.js`: business logic. Knows nothing about Express. Functions: `readContent()` and `writeContent(content)`.
5. `src/repositories/fileRepository.js`: the only place that uses `fs`. Async with `fs.promises`. Throws when the file cannot be read or written. Functions: `readFile()` and `writeFile(content)`.
6. `src/events/requestEmitter.js`: exports the one `EventEmitter` instance.
7. `src/events/requestLogger.js`: the listener. `attachRequestLogger(emitter, write = console.log)` calls `emitter.on('request', ...)`.
8. `src/middleware/requestEvents.js`: `createRequestEvents(emitter)` returns a middleware that calls `emitter.emit('request', { method, path })`.
9. `src/middleware/notFound.js` and `src/middleware/errorHandler.js`.
10. `data/data.txt`: the file the server reads and writes.
11. `scripts/simulate_clients.js`: sends at least 10 requests quickly.
12. `tests/`: tests, see below.
13. `src/contracts.js`: JSDoc types for `FileRepository`, `FileService`, `RequestEvent` and `AppDependencies`. Types only, no code. Fakes in tests must match these types.

Dependencies only point one way: controller, service, repository. A layer never knows the layers above it.

Dependency injection: layers get their dependencies as parameters through factory functions and never create them themselves: `createFileRepository(filePath)`, `createFileService(fileRepository)`, `createFileController(fileService)`. Wiring happens only in `server.js` and `app.js`.

File paths are built with `path.join(__dirname, ...)` in `server.js`, never relative to the folder the server was started from.

## What the tools check

`npm run lint` enforces these rules, so do not rely on memory or on reading the code:

1. Max complexity 6 per function, max 25 lines per function, max 120 lines per file, max 3 parameters.
2. Services do not require `express`, `fs` or anything from controllers and routes.
3. Repositories do not require `express` or anything from services, controllers and routes.
4. Only the repository requires `fs`.

If lint fails, fix the code: split the function, move the logic to the right layer. Never add `eslint-disable` comments.

Everything else in this file is a rule the agent follows itself and the group checks in review.

## Working method

Work in small steps, one issue at a time. Follow `docs/unit-test-guide.md`.

1. Red: write one failing test and see it fail.
2. Green: write the smallest code that passes.
3. Refactor: with the tests green, clean up. Clear names, small functions that do one thing, no duplication, no comments that only repeat the code. Run `npm run check`.
4. Repeat for the next small step.

Do not pile up changes without cleaning up. If a fix breaks something else, fix that before moving on. If you go in circles (fix one thing, break another), stop and report what happens instead of trying again.

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
2. `GET /read-file`: repository, service, controller and the route in `app.js`
3. `POST /write-file`: validation (400) and writing
4. EventEmitter: `emit` in `requestEvents`, `on` in `requestLogger`
5. `errorHandler` and the error scenario (missing file, invalid input)
6. `scripts/simulate_clients.js` with 10 requests
7. Tests in `tests/`

After every change: show which files and lines were changed, explain the change briefly, say that `npm run check` is green, say which manual tests we should run and say if anything was changed that we did not ask for.

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
3. KISS: structure and architecture are followed, but never at the cost of KISS. If a rule makes the code harder to explain, stop and ask the group.
4. Public functions use JSDoc comments (`/** ... */`) and refer to the types in `src/contracts.js`, e.g. `@param {import('../contracts').FileRepository} fileRepository`.
5. async/await, never callbacks. No new packages without asking (ESLint is already agreed). Use the built in `fetch` in scripts and tests, not axios.
6. Commit style: short, lowercase, conventional commits with the prefix in English and the text in Danish, e.g. `feat: tilføj read-file endpoint`.

## Tests

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

## Git rules

1. Work only on the branch for the current issue (e.g. `3/write_file`).
2. Only edit files listed in the issue. Ask before touching others.
3. Only `server.js` and `app.js` wire things together. Do not edit them outside the issue that owns them.
4. Before starting and before a PR: merge `main` into the current branch.
5. On merge conflicts: stop and show both sides. Never accept theirs or ours blindly.
6. If the branch, files or build look wrong: stop and report. Do not repair something you do not understand.
7. Never commit `node_modules/` or `.idea/`.
8. If a file from another issue is missing, use a small fake with the same functions. Never create the real one yourself.
9. Never change `src/contracts.js` or `eslint.config.js` without a separate issue.

## Not the agent's job

The README answers must be in our own words: what happens in Node.js while the server waits for a file operation, which event we use and when it is emitted, the AI example and the final sentence. Also the answers for the individual checkpoint. The agent may explain code when we ask, but does not write these texts.

The group also reads the diff. Green checks do not replace that: we must be able to explain every line.

## Review mode

When asked for a review, the agent may point out problems in: async/await and error handling, unhandled errors, status codes, several requests at once (e.g. two writes to the same file at the same time), the EventEmitter setup, layer responsibilities, missing tests and unnecessary complexity. The agent may run `npm run check` and report the result.

In review mode the agent must not change any code. Suggestions only.
