module.exports = {
  verbose: true,
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
  moduleFileExtensions: ["js", "ts"],
  moduleNameMapper: {
    "~test/(.*)": "<rootDir>/test/$1",
    "~src/(.*)": "<rootDir>/src/$1",
    "~bot/(.*)": "<rootDir>/bot/$1",
    "~search/(.*)": "<rootDir>/search/$1",
  },
  rootDir: ".",
  preset: "ts-jest",
  testMatch: ["**/test/**/*.test.(ts|js)"],
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/modules/**/utils/*.ts", "<rootDir>/src/modules/**/server/controllers/*.ts"],
  coverageThreshold: {
    global: {
      statements: 10,
      lines: 10,
      functions: 10,
      branches: 10,
    },
  },
};
