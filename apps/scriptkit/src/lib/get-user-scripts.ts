import path from 'path'
import {Octokit} from '@octokit/rest'
import {LoadedScript} from 'utils/types'
import _ from 'lodash'
import {readJson} from 'fs-extra'

const cwd = process.cwd

const octokit = new Octokit()

export const getAllScripts = async (): Promise<LoadedScript[]> => {
  let shareScripts = await readJson(
    path.resolve(cwd(), 'public', 'data', 'share.json'),
  )

  let reposScripts = await readJson(
    path.resolve(cwd(), 'public', 'data', 'repo-scripts.json'),
  )

  return shareScripts.concat(reposScripts)
}

export interface UserScripts {
  [user: string]: LoadedScript[]
}

export const getAllScriptsGroupedByUser = async (): Promise<UserScripts> => {
  const scripts = await getAllScripts()

  return _.groupBy(scripts, 'user')
}

export const getAllUsers = async (): Promise<string[]> => {
  const scripts = await getAllScripts()
  const users = scripts.map((s) => s.user)
  return _.uniq(users)
}

export const getScriptsByUser = async (
  user: string,
): Promise<LoadedScript[]> => {
  const scripts = await getAllScripts()

  return scripts.filter((s) => s.user === user)
}

interface ScriptPath {
  paths: {
    params: {
      user: string
      script: string
    }
  }[]
  fallback: boolean
}
export async function getScriptPaths(): Promise<ScriptPath> {
  const paths = []

  const scripts = await getAllScripts()
  for await (const script of scripts) {
    paths.push({
      params: {
        user: script.user,
        script: script.command,
      },
    })
  }

  return {
    paths,
    fallback: false,
  }
}

export async function getScript(
  user: string,
  command: string,
): Promise<LoadedScript | undefined> {
  const scripts = await getAllScripts()
  return scripts.find((d) => user === d.user && command === d.command)
}

type PromiseType<T extends Promise<any>> = T extends Promise<infer U>
  ? U
  : never

type ListReleasesReturnType = PromiseType<
  ReturnType<typeof octokit.repos.listReleases>
>

let releases: ListReleasesReturnType['data'] = []
export async function getReleases() {
  if (releases.length) {
    return releases
  }

  const releaseResponse1 = await octokit.repos.listReleases({
    owner: 'johnlindquist',
    repo: 'kitapp',
    per_page: 100,
    page: 1,
  })

  const releaseResponse2 = await octokit.repos.listReleases({
    owner: 'johnlindquist',
    repo: 'kitapp',
    per_page: 100,
    page: 2,
  })

  releases = [...releaseResponse1.data, ...releaseResponse2.data]
  console.log(`Releases`, releases.length)

  return releases
}

export async function getLatestRelease() {
  const releases = await getReleases()

  const mainRelease = releases.find(
    (release) =>
      !release?.name?.includes('beta') &&
      !release?.name?.includes('alpha') &&
      !release.prerelease &&
      release?.assets?.find((a) => a.name.includes('dmg')),
  )

  console.log(`Mac Intel Main Release:`, mainRelease)

  const release = mainRelease?.assets.find(
    (asset) =>
      !asset?.name?.includes('beta') &&
      !asset?.name?.includes('alpha') &&
      !asset?.name?.includes('arm') &&
      asset?.name?.endsWith('.dmg'),
  )

  console.log(`Mac Intel Release:`, release)

  return release
}

// export const getLatestReleaseMemo = memoizerific(1)(getLatestRelease)

export async function getLatestAppleSiliconRelease() {
  const releases = await getReleases()

  const mainRelease = releases.find(
    (release) =>
      !release?.name?.includes('beta') &&
      !release?.name?.includes('alpha') &&
      !release.prerelease &&
      release?.assets?.find((a) => a.name.includes('dmg')),
  )

  console.log(`Apple Silicon Main Release:`, mainRelease)

  const release = mainRelease?.assets.find(
    (asset) =>
      !asset?.name?.includes('beta') &&
      !asset?.name?.includes('alpha') &&
      asset?.name?.includes('arm') &&
      asset?.name?.endsWith('.dmg'),
  )

  console.log(`Apple Silicon Release:`, release)

  return release
}

export async function getLatestWindowsPreviewRelease() {
  const releases = await getReleases()

  const mainRelease = releases.find(
    (release) =>
      !release?.name?.includes('beta') &&
      !release?.name?.includes('alpha') &&
      !release.prerelease &&
      release?.assets?.find((a) => a.name.includes('exe')),
  )

  console.log(`Windows Preview Main Release:`, mainRelease)

  const release = mainRelease?.assets.find(
    (asset) =>
      !asset?.name?.includes('beta') &&
      !asset?.name?.includes('alpha') &&
      !asset?.name?.includes('arm') &&
      asset?.name?.endsWith('.exe'),
  )

  console.log(`Windows Releases:`, release)

  return release
}

export async function getLatestLinuxRelease() {
  const releases = await getReleases()

  const mainRelease = releases.find(
    (release) =>
      !release?.name?.includes('beta') &&
      !release?.name?.includes('alpha') &&
      !release.prerelease &&
      release?.assets?.find((a) => a.name.includes('exe')),
  )

  console.log(`Linux Main Release:`, mainRelease)

  const release = mainRelease?.assets.find(
    (asset) =>
      !asset?.name?.includes('beta') &&
      !asset?.name?.includes('alpha') &&
      asset?.name?.endsWith('AppImage'),
  )

  console.log(`Linux Release:`, release)

  return release
}
