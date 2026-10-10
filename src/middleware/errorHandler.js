/**
 * Returns a safe JSON response for errors forwarded by Express.
 * @param {Error & { type?: string }} err
 * @param {object} req
 * @param {{ headersSent?: boolean, status: (code: number) => { json: (body: { error: string }) => void } }} res
 * @param {(error: Error & { type?: string }) => void} next
 */
function errorHandler(err, req, res, next) {
  void req;
  if (res.headersSent) {
    return next(err);
  }

  const isInvalidJson = err?.type === 'entity.parse.failed';
  const statusCode = isInvalidJson ? 400 : 500;
  const message = isInvalidJson
    ? 'Ugyldig JSON i forespørgslen.'
    : 'Der opstod en intern serverfejl.';

  res.status(statusCode).json({ error: message });
}

module.exports = { errorHandler };
