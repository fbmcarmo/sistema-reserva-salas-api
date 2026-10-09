module.exports = {
  testEnvironment: 'node',

  testMatch: [
    '**/tests/**/*.test.js',
    '**/?(*.)+(spec|test).js',
  ],

  transform: {
    '^.+\\.js$': 'babel-jest',
  },

  clearMocks: true,

  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
  ],

  coverageDirectory: 'coverage',
};