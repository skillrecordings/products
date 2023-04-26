import '@johnlindquist/kit'
import {commandFromFilePath, getMetadata} from '@johnlindquist/kit/core/utils'
import {ScriptMetadata} from '@johnlindquist/kit/types/core'
import {Octokit} from '@octokit/rest'

export enum Extension {
  md = '.md',
  js = '.js',
  ts = '.ts',
  mjs = '.mjs',
}

export interface LoadedScript extends Partial<ScriptMetadata> {
  title: string
  command: string
  user: string
  content: string
  url: string
  discussion: string
  extension: Extension

  github?: string
  twitter?: string
  description?: string
}

interface Repo {
  user: string
  owner: string
  repo: string
}

let octokit = new Octokit({
  auth: await env('GITHUB_SCRIPTKITCOM_TOKEN'),
})

let scripts: LoadedScript[] = []

let repos: Repo[] = await readJson(path.resolve('users.json'))

for await (let repo of repos) {
  let scriptsResponse = await octokit.request(
    'GET /repos/{owner}/{repo}/contents/{path}',
    {
      ...repo,
      path: 'scripts',
    },
  )

  let scriptsDir = scriptsResponse.data as any[]

  for await (let script of scriptsDir) {
    let file = script.name
    let url = script.download_url

    let scriptResponse = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        ...repo,
        path: `${script.path}`,
        mediaType: {
          format: 'raw',
        },
      },
    )

    let content = scriptResponse.data as any

    let command = commandFromFilePath(script.path)
    let metadata = getMetadata(content)

    scripts.push({
      ...repo,
      url,
      title: metadata?.menu || command,
      command,
      content,
      discussion: '',
      ...metadata,

      extension: path.extname(file) as Extension,
    })
  }
}

await outputJson(projectPath('public', 'data', 'repo-scripts.json'), scripts)
