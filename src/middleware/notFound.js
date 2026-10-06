/**
 * Sends a JSON response when no route matches the request.
 * @param {object} request
 * @param {{ status: (code: number) => { json: (body: { error: string }) => void } }} response
 */
function notFound(request, response) {
  response.status(404).json({ error: 'Ruten blev ikke fundet.' });
}

module.exports = { notFound };
