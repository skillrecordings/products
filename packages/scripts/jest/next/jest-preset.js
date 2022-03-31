module.exports = {
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/.vercel/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {presets: ['next/babel']}],
    '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  // resolve absolute imports in tests
  // https://stackoverflow.com/questions/50171412/jest-typescript-absolute-paths-baseurl-gives-error-cannot-find-module
  roots: ['src'],
  moduleDirectories: ['node_modules', 'src'],
  resetMocks: true,
  passWithNoTests: true,
  testEnvironment: 'jsdom',
}
