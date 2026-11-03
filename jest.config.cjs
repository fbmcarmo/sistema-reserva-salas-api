
module.exports = {
  testEnvironment: "node",

  testMatch: [
    "**/tests/**/*.test.js",
    "**/?(*.)+(spec|test).js",
  ],

  transform: {
    "^.+\\.js$": "babel-jest",
  },

  clearMocks: true,

  setupFiles: [
    "<rootDir>/tests/setupEnv.js",
  ],

  collectCoverage: false,

  collectCoverageFrom: [
    "src/**/*.js",

    // Arquivo de inicialização da aplicação
    "!src/index.js",

    // Arquivos de teste
    "!src/**/*.test.js",
    "!src/**/*.spec.js",
    "!src/**/__tests__/**",
    "!src/shared/database/migrations/**",
    // Documentação Swagger
    "!src/shared/docs/**",

    // Configurações do Sequelize
    "!src/config/**",
  ],

  coverageDirectory: "coverage",

  coverageProvider: "v8",

  coverageReporters: [
    "text",
    "html",
    "lcov",
    "json-summary",
  ],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
