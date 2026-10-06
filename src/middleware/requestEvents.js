function createRequestEvents(emitter) {
    return function requestEvents(req, res, next) {
        emitter.emit('request', { method: req.method, path: req.path });
        next();
    };
}

module.exports = { createRequestEvents };

