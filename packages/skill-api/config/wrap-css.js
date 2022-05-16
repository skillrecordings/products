// Serverless target in Next.js does not work if you try to read in files at runtime
// that are not JavaScript or JSON (e.g. CSS files).
// https://github.com/nextauthjs/next-auth/issues/281
//
// To work around this issue, this script is a manual step that wraps CSS in a
// JavaScript file that has the compiled CSS embedded in it, and exports only
// a function that returns the CSS as a string.
const fs = require('fs')
const path = require('path')

const pathToCss = path.join(__dirname, '../css/index.css')
const css = fs.readFileSync(pathToCss, 'utf8')
const cssWithEscapedQuotes = css.replace(/"/gm, '\\"')

const js = `module.exports = function() { return "${cssWithEscapedQuotes}" }`
const pathToCssJs = path.join(__dirname, '../css/index.js')
fs.writeFileSync(pathToCssJs, js)
