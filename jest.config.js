// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    // If using path aliases like @/lib, configure them here
    // Example: "^@/lib/(.*)$": "<rootDir>/src/lib/$1"
    // For this project, direct relative paths are used, so this might not be strictly necessary
    // but it's good practice to have it.
  },
};
