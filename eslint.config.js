const js = require('@eslint/js');

const nodeGlobals = {
    require: 'readonly',
    module: 'writable',
    __dirname: 'readonly',
    process: 'readonly',
    console: 'readonly',
    fetch: 'readonly',
};

const forbidRequire = (pattern, message) => ({
    selector: `CallExpression[callee.name='require'][arguments.0.value=/${pattern}/]`,
    message,
});

module.exports = [
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: { ecmaVersion: 2022, sourceType: 'commonjs', globals: nodeGlobals },
        rules: {
            complexity: ['error', 6],
            'max-lines-per-function': ['error', { max: 25, skipBlankLines: true, skipComments: true }],
            'max-lines': ['error', { max: 120, skipBlankLines: true, skipComments: true }],
            'max-params': ['error', 4],
            'no-var': 'error',
            'prefer-const': 'error',
        },
    },
    {
        files: ['tests/**/*.js'],
        rules: { 'max-lines': 'off' },
    },
    {
        files: ['src/services/**/*.js'],
        rules: {
            'no-restricted-syntax': ['error',
                forbidRequire('^(express|(node:)?fs)', 'Service må ikke kende Express eller fs'),
                forbidRequire('controllers|routes', 'Service må ikke kende lagene over sig'),
            ],
        },
    },
    {
        files: ['src/repositories/**/*.js'],
        rules: {
            'no-restricted-syntax': ['error',
                forbidRequire('^express', 'Repository må ikke kende Express'),
                forbidRequire('services|controllers|routes', 'Repository må ikke kende lagene over sig'),
            ],
        },
    },
    {
        files: ['src/controllers/**/*.js', 'src/routes/**/*.js', 'src/events/**/*.js', 'src/middleware/**/*.js'],
        rules: {
            'no-restricted-syntax': ['error', forbidRequire('^(node:)?fs', 'Kun repository må bruge fs')],
        },
    },
];