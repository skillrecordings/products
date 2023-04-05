import fs from 'fs'
const sourceCode = fs.readFileSync(__dirname + '/lesson.html', 'utf8')
const tailwindcss = fs.readFileSync(__dirname + '/tailwind.css', 'utf8')
import './tailwind.config'

document.head.insertAdjacentHTML(
  'beforeend',
  `<style type="text/tailwindcss">${tailwindcss}</style>`,
)

const app = document.createElement('div')
app.innerHTML = sourceCode

root.appendChild(app)
