import fs from 'fs'
const sourceCode = fs.readFileSync(__dirname + '/lesson.html', 'utf8')
import './tailwind.config'

const app = document.createElement('div')
app.innerHTML = sourceCode

root.appendChild(app)
