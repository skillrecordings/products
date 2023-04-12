let tags = ['latest', 'alpha', 'beta']
let distTag = await arg('dist tag', tags)

if (!tags.includes(distTag)) {
  console.log(`${distTag} is an invalid tag. Must be one of ${tags}`)
  exit()
}
let response = await get(`https://registry.npmjs.org/@johnlindquist/kit/`)

let version = response.data['dist-tags'][distTag]

let url = `https://registry.npmjs.org/@johnlindquist/kit/-/kit-${version}.tgz`

export default url
