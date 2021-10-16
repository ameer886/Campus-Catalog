/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    "<rootDir>/src"
  ],
  transform: {
    ".(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/jest-config/file-mock.js",
    '.(css|less)$': '<rootDir>/jest-config/style-mock.js',
    "^.+\\.(js|ts)$": "ts-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.js$",
    "/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.ts$",
    "/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.tsx$",
  ],
};
