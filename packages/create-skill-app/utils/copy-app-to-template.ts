#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
import path from 'path'
import cpy from 'cpy'
import fs from 'fs'

async function copyAppToTemplate({appPath}: {appPath: string}): Promise<void> {
  console.log('Copying files to template...')
  const template = 'next'
  const appDir = path.join(appPath)
  const templateDir = path.resolve(
    appDir,
    `../../packages/create-skill-app/templates/${template}`,
  )

  const configTemplatePath = path.join(templateDir, '.config-templates')
  const configTemplates = fs.readdirSync(configTemplatePath)

  const getConfigFiles = () => {
    let files = []
    for (const configTemplate of configTemplates) {
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
      files.push(getFilename(configTemplate))
    }
    return files
  }

  const configFiles = getConfigFiles()

  for (const configFile of configFiles) {
    function getFilename(templateName: string) {
      switch (templateName) {
        case 'env':
        case 'env.production':
        case 'env.local':
        case 'env.development': {
          return '.'.concat(templateName)
        }
        case 'README.md': {
          return 'README-template.md'
        }
        case 'package.json': {
          return 'package-template.json'
        }
        case path.join('schemas', 'deskStructure.ts'): {
          return 'deskStructure.ts'
        }
        case path.join('src/styles', 'globals.css'): {
          return 'globals.css'
        }
        default: {
          return templateName
        }
      }
    }
    const copyFile = async () => {
      return await cpy(configFile, configTemplatePath, {
        cwd: appDir,
        rename: getFilename(configFile),
      })
    }
    switch (configFile) {
      case 'src/styles/globals.css': {
        console.log('Copying globals.css')
        await copyFile()
      }
      default:
        break
    }
  }

  await cpy('**', templateDir, {
    cwd: appDir,
    parents: true,
    ignore: [
      ...configFiles,
      'node_modules/**/*',
      '.next/**/*',
      'seed_data/**/*',
    ],
  }).then(() => {
    console.log('Files copied to template.')
    process.exit()
  })
  process.exit(1)
}

copyAppToTemplate({appPath: '.'})
