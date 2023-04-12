let tree = await npm('tree-cli')

cp(kenvPath('./scripts/*'), kitPath('tmp', 'scripts'))

console.log(`tmpTree report 2`)
let res = await tree({base: kitPath('tmp'), l: 3})
console.log(res?.report)

export {}
