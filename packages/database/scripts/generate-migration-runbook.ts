// The next best thing to a fully automated script for running migrations
// against all of our Planetscale databases is a script that can generate a
// manual *runbook* for it.
//
// ```
// $ npx ts-node --skipProject scripts/generate-migration-runbook.ts branch-name
// ```

import fs from 'fs'

const branchName = process.argv[2] || 'preview'

// Adjust this list as needed.
// The apps in the skill-stack monorepo change as new ones are added
// and others are ejected.
const databases: {[key: string]: string} = {
  'total-typescript': 'total-typescript',
  'kcd-products': 'epic-web',
  'colt-steele': 'colt-steele',
  'devrel-fyi': 'devrel-fyi',
}

const instructions: {[key: string]: Array<string>} = {}
let formattedInstructions: string = ''

for (const databaseName of Object.keys(databases)) {
  const appDirectory: string = databases[databaseName] || databaseName

  const instructionSet = [
    `\`pscale branch create ${databaseName} ${branchName}\``,
    `\`pscale connect ${databaseName} ${branchName} --port 3309 --host "::1"\``,
    `\`pnpm db:push\` (from \`apps/${appDirectory}\`)`,
    `\`pscale deploy-request create ${databaseName} ${branchName}\``,
    `Review and merge the deploy request in the browser`,
  ]

  instructions[databaseName] = instructionSet

  formattedInstructions += `- ${databaseName}\n`
  formattedInstructions += instructionSet
    .map((i: string) => `  - ${i}`)
    .join('\n')
  formattedInstructions += '\n'
}

const writeStringToFile = (path: string, data: string) => {
  try {
    fs.writeFileSync(path, data, 'utf8')
    console.log(`Data successfully saved to disk -- ./${path}`)
  } catch (error) {
    console.log('An error has occurred ', error)
  }
}

writeStringToFile('migration-runbook.txt', formattedInstructions)
