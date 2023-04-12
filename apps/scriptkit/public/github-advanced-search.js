//Menu: GitHub Advanced Search
//Description: Search GitHub for Code
//Author: John Lindquist
//Twitter: @johnlindquist

let languages = [
  'JavaScript',
  'TypeScript',
  'C',
  'C#',
  'C++',
  'CoffeeScript',
  'CSS',
  'Dart',
  'DM',
  'Elixir',
  'Go',
  'Groovy',
  'HTML',
  'Java',
  'Kotlin',
  'Objective-C',
  'Perl',
  'PHP',
  'PowerShell',
  'Python',
  'Ruby',
  'Rust',
  'Scala',
  'Shell',
  'Swift',
]

let query = await arg('Enter search query:')
query = query.replace(' ', '+')
let lang = await arg('Select language:', languages)

let url = `https://github.com/search?l=&q=${query}+language%3A${lang}&type=code`

exec(`open "${url}"`)
