/**
 * Returns a safe JSON response for errors forwarded by Express.
 * @param {Error & { type?: string }} error
 * @param {object} request
 * @param {{ status: (code: number) => { json: (body: { error: string }) => void } }} response
 */
function errorHandler(error, request, response) {
  void request;
  const isInvalidJson = error?.type === 'entity.parse.failed';
  const statusCode = isInvalidJson ? 400 : 500;
  const message = isInvalidJson
    ? 'Ugyldig JSON i forespørgslen.'
    : 'Der opstod en intern serverfejl.';

  response.status(statusCode).json({ error: message });
}

// Express genkender fejlhandlere på function.length === 4.
// Projektets max-params er 3, så længden sættes eksplicit.
Object.defineProperty(errorHandler, 'length', { value: 4 });

module.exports = { errorHandler };
