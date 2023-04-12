import {Octokit} from '@octokit/rest'
import {NextApiRequest, NextApiResponse} from 'next'

let octokit = new Octokit({
  auth: process.env.GITHUB_SCRIPTKITCOM_TOKEN,
})

type Asset = {download_count: number}

let getReleaseCount = async () => {
  let releases = await octokit.paginate('GET /repos/{owner}/{repo}/releases', {
    owner: 'johnlindquist',
    repo: 'kitapp',
  })

  let dmgs = releases.flatMap(
    (release) =>
      release.assets.filter(
        (asset) =>
          asset.name.endsWith('.dmg') ||
          asset.name.endsWith('.exe') ||
          asset.name.endsWith('.AppImage'),
      ) as Asset[],
  )

  let count = dmgs
    .filter(Boolean)
    .reduce((acc, asset) => (acc += asset.download_count), 0)

  return count
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let count = await getReleaseCount()

  // cache response for 6 hours
  res.setHeader('Cache-Control', 's-maxage=21600')
  res.statusCode = 200
  res.json(count)
}
