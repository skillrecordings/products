/* eslint-disable import/no-extraneous-dependencies */
import chalk from 'chalk'
import cpy from 'cpy'
import fs from 'fs'
import os from 'os'
import path from 'path'

import {makeDir} from './helpers/make-dir'
import {tryGitInit} from './helpers/git'
import {install} from './helpers/install'
import {isFolderEmpty} from './helpers/is-folder-empty'
import {getOnline} from './helpers/is-online'
import {isWriteable} from './helpers/is-writeable'
import type {PackageManager} from './helpers/get-pkg-manager'
import * as handlebars from 'handlebars'
import {Answers} from 'prompts'

export async function createApp({
  appPath,
  projectData,
  skipInstall = false,
}: {
  appPath: string
  projectData: Answers<string>
  skipInstall?: boolean
}): Promise<void> {
  const template = 'next'
  const packageManager = `pnpm` as PackageManager
  const root = path.resolve(appPath)

  if (!(await isWriteable(path.dirname(root)))) {
    console.error(
      'The application path is not writable, please check folder permissions and try again.',
    )
    console.error(
      'It is likely you do not have write permissions for this folder.',
    )
    process.exit(1)
  }

  const appName = path.basename(root)

  await makeDir(root)
  if (!isFolderEmpty(root, appName)) {
    process.exit(1)
  }

  const isOnline = await getOnline()
  const originalDirectory = process.cwd()

  console.log(`Creating a new Next.js app in ${chalk.green(root)}.`)
  console.log()

  process.chdir(root)

  /**
   * Otherwise, if an example repository is not provided for cloning, proceed
   * by installing from a template.
   */
  console.log(chalk.bold(`Using ${packageManager}.`))
  /**
   * Create a package.json for the new project.
   */

  /**
   * Copy the template files to the target directory.
   */
  await cpy('**', root, {
    parents: true,
    cwd: path.join(__dirname, 'templates', template),
    rename: (name) => {
      switch (name) {
        case 'gitignore':
        case 'eslintrc.js': {
          return '.'.concat(name)
        }
        // README.md is ignored by webpack-asset-relocator-loader used by ncc:
        // https://github.com/vercel/webpack-asset-relocator-loader/blob/e9308683d47ff507253e37c9bcbb99474603192b/src/asset-relocator.js#L227
        case 'README-template.md': {
          return 'README.md'
        }
        default: {
          return name
        }
      }
    },
  })

  // fs.readFileSync(path.join(__dirname, 'templates', template))
  const configTemplatePath = path.join(
    __dirname,
    'templates',
    template,
    '.config-templates',
  )

  const configTemplates = fs.readdirSync(configTemplatePath)

  for (const configTemplate of configTemplates) {
    const file = fs.readFileSync(path.join(configTemplatePath, configTemplate))
    const template = handlebars.compile(file.toString())

    function getFilename(templateName: string) {
      switch (templateName) {
        case 'env':
        case 'env.production':
        case 'env.local':
        case 'env.development': {
          return '.'.concat(templateName)
        }
        case 'README-template.md': {
          return 'README.md'
        }
        case 'package-template.json': {
          return 'package.json'
        }
        case 'deskStructure.ts': {
          return path.join('schemas', 'deskStructure.ts')
        }
        case 'globals.css': {
          return path.join('src/styles', 'globals.css')
        }
        default: {
          return templateName
        }
      }
    }

    fs.writeFileSync(
      path.join(root, getFilename(configTemplate)),
      template({appName, ...projectData}),
    )
  }

  /**
   * These flags will be passed to `install()`.
   */
  const installFlags = {packageManager, isOnline}

  console.log('Installing packages. This might take a couple of minutes.')

  if (!skipInstall) await install(root, null, installFlags)
  console.log()

  if (tryGitInit(root)) {
    console.log('Initialized a git repository.')
    console.log()
  }

  let cdpath: string
  if (path.join(originalDirectory, appName) === appPath) {
    cdpath = appName
  } else {
    cdpath = appPath
  }

  console.log(`${chalk.green('Success!')} Created ${appName} at ${appPath}`)
  console.log()

  console.log('Inside that directory, you can run several commands:')
  console.log()
  console.log(chalk.cyan(`  ${packageManager} dev`))
  console.log('    Starts the development server.')
  console.log()
  console.log(chalk.cyan(`  ${packageManager} build`))
  console.log('    Builds the app for production.')
  console.log()
  console.log(chalk.cyan(`  ${packageManager} start`))
  console.log('    Runs the built app in production mode.')
  console.log()
  console.log('We suggest that you begin by typing:')
  console.log()
  console.log(chalk.cyan('  cd'), cdpath)
  console.log(`  ${chalk.cyan(`${packageManager} dev`)}`)

  console.log()
}
