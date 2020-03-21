module.exports = {
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  testEnvironment: 'node',
  testMatch: [
    "<rootDir>/tests/**/*.{js,ts}",
    "<rootDir>/src/**/?(*.)+(spec|test).{js,ts}",
  ],
  setupFiles: ["./jest-setup.ts"],
  // coverage
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{ts,js}",
  ],
  coverageDirectory: "coverage/",
};
