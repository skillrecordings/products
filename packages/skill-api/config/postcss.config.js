module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-nested'),
    require('cssnano')({preset: 'default'}),
  ],
}
