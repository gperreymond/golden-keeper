// jest.config.js
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  coverageReporters: ['text-summary', 'json-summary', 'lcov', 'clover'],
  collectCoverageFrom: ['services/**/*.js', 'cqrs/**/*.js', 'timeseries/**/*.js'],
  coveragePathIgnorePatterns: ['node_modules']
}
