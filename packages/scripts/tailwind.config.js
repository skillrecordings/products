module.exports = {
  mode: 'jit',
  purge: {
    content: [
      './src/**/*.tsx',
      './src/**/*.mdx',
      './node_modules/@skillrecordings/commerce/dist/**/*.js',
      './node_modules/@skillrecordings/react/dist/**/*.js',
      './node_modules/@skillrecordings/convertkit/dist/**/*.js',
      './node_modules/@skillrecordings/quiz/dist/**/*.js',
    ],
  },
}
