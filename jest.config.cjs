module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',  
  setupFiles: ["./jest-setup.ts"],
  testMatch: [
    "<rootDir>/tests/**/*.{js,ts}",
    "<rootDir>/src/**/?(*.)+(spec|test).{js,ts}",
  ],
};
