const path = require('node:path');
const { createFileRepository } = require('./repositories/fileRepository');
const emitter = require('./events/requestEmitter');
const { attachRequestLogger } = require('./events/requestLogger');
const { createApp } = require('./app');

const filePath = path.join(__dirname, '..', 'data', 'data.txt');
const fileRepository = createFileRepository(filePath);

attachRequestLogger(emitter);

const app = createApp({ fileRepository, emitter });

app.listen(3000);
