module.exports = {
  mode: 'jit',
  purge: {
    content: [
      './src/**/*.tsx',
      './src/**/*.mdx',
      './node_modules/commerce/**/*.js',
      './node_modules/react/**/*.js',
      './node_modules/convertkit/**/*.js',
      './node_modules/quiz/**/*.js',
    ],
  },
}
