const express = require('express');
const { createFileService } = require('./services/fileService');
const { createFileController } = require('./controllers/fileController');
const { createRequestEvents } = require('./middleware/requestEvents');
const { notFound } = require('./middleware/notFound');
const { errorHandler } = require('./middleware/errorHandler');

/**
 * @param {import('./contracts').AppDependencies} dependencies
 * @returns {import('express').Express}
 */
function createApp({ fileRepository, emitter }) {
  const fileService = createFileService(fileRepository);
  const fileController = createFileController(fileService);
  const app = express();

  app.use(createRequestEvents(emitter));
  app.use(express.json());
  app.get('/read-file', fileController.handleReadFile);
  app.post('/write-file', fileController.handleWriteFile);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
