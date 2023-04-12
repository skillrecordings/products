let releaseName = await arg('release name')
let response = await get(
  `https://api.github.com/repos/johnlindquist/kit/releases`,
)
let release = response.data.find((r) => r.name === releaseName)

let url = `Release ${releaseName} not found`
if (release) {
  let asset = release.assets.find((asset) => asset.name === 'kit.zip')
  url = asset.browser_download_url
}

export default url
