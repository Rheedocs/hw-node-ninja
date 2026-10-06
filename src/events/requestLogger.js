function attachRequestLogger(emitter, write = console.log) {
    emitter.on('request', ({ method, path }) => {
        write(`${method} ${path}`);
    });
}

module.exports = { attachRequestLogger };

