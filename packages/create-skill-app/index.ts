#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
import chalk from 'chalk'
import Commander from 'commander'
import path from 'path'
import prompts from 'prompts'
import checkForUpdate from 'update-check'
import {createApp} from './create-app'
import {getPkgManager} from './helpers/get-pkg-manager'
import {validateNpmName} from './helpers/validate-pkg'
import packageJson from './package.json'

let projectPath: string = ''

const program = new Commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .action((name) => {
    projectPath = name
  })
  .allowUnknownOption()
  .parse(process.argv)

async function run(): Promise<void> {
  if (typeof projectPath === 'string') {
    projectPath = projectPath.trim()
  }

  if (!projectPath) {
    const res = await prompts({
      type: 'text',
      name: 'path',
      message: 'What is your project named?',
      initial: 'my-app',
      validate: (name) => {
        const validation = validateNpmName(path.basename(path.resolve(name)))
        if (validation.valid) {
          return true
        }
        return 'Invalid project name: ' + validation.problems![0]
      },
    })

    if (typeof res.path === 'string') {
      projectPath = res.path.trim()
    }
  }

  if (!projectPath) {
    console.log(
      '\nPlease specify the project directory:\n' +
        `  ${chalk.cyan(program.name())} ${chalk.green(
          '<project-directory>',
        )}\n` +
        'For example:\n' +
        `  ${chalk.cyan(program.name())} ${chalk.green('my-next-app')}\n\n` +
        `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`,
    )
    process.exit(1)
  }

  const resolvedProjectPath = path.resolve(projectPath)
  const projectName = path.basename(resolvedProjectPath)

  const {valid, problems} = validateNpmName(projectName)
  if (!valid) {
    console.error(
      `Could not create a project called ${chalk.red(
        `"${projectName}"`,
      )} because of npm naming restrictions:`,
    )

    problems!.forEach((p) => console.error(`    ${chalk.red.bold('*')} ${p}`))
    process.exit(1)
  }

  program.usePnpm = true

  await createApp({
    appPath: resolvedProjectPath,
  })
}

const update = checkForUpdate(packageJson).catch(() => null)

async function notifyUpdate(): Promise<void> {
  try {
    const res = await update
    if (res?.latest) {
      const pkgManager = getPkgManager()
      console.log(
        chalk.yellow.bold('A new version of `create-skill-app` is available!') +
          '\n' +
          'You can update by running: ' +
          chalk.cyan(`${pkgManager} install --global create-skill-app`) +
          '\n' +
          'Or by linking with npm ' +
          '\n' +
          chalk.cyan(`cd ../packages/create-skill-app && npm link`) +
          '\n',
      )
    }
    process.exit()
  } catch {
    // ignore error
  }
}

run()
  .then(notifyUpdate)
  .catch(async (reason) => {
    console.log()
    console.log('Aborting installation.')
    if (reason.command) {
      console.log(`  ${chalk.cyan(reason.command)} has failed.`)
    } else {
      console.log(
        chalk.red('Unexpected error. Please report it as a bug:') + '\n',
        reason,
      )
    }
    console.log()

    await notifyUpdate()

    process.exit(1)
  })
