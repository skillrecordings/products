import {type PlaywrightTestConfig, devices} from '@playwright/test'
import {loadEnvConfig} from '@next/env'
import process from 'process'
import path from 'path'
import os from 'os'

const appRootDir = String(process.env.PWD)
const outputDir = path.join(appRootDir, 'test-results')
const testDir = path.join(appRootDir, 'playwright')

loadEnvConfig(appRootDir)

const defaultTimeout = 30_000
const defaultNavigationTimeout = 15_000
const port = Number(process.env.LOCALHOST_PORT)
const isCI = !!process.env.CI
const isPlayWrightHeadless = !!process.env.PLAYWRIGHT_HEADLESS
const isHeadless = isCI || isPlayWrightHeadless

let baseURL = 'http://localhost:'
baseURL += port

const config: PlaywrightTestConfig = {
  forbidOnly: isCI,
  retries: 1,
  workers: isHeadless ? os.cpus().length : 1,
  timeout: defaultTimeout,
  maxFailures: isHeadless ? 3 : undefined,
  reporter: [
    [isCI ? 'github' : 'list'],
    [
      'html',
      {
        outputFolder: path.join(outputDir, 'reports/playwright-html-report'),
        open: 'never',
      },
    ],
    ['junit', {outputFile: path.join(outputDir, 'reports/results.xml')}],
  ],
  globalSetup: require.resolve('./playwright/config/globalSetup'),
  outputDir: path.join(outputDir, 'results'),
  webServer: {
    command: 'pnpm db:start && pnpm dev',
    port,
    timeout: defaultTimeout,
    reuseExistingServer: !isCI,
  },
  use: {
    baseURL,
    locale: 'en-US',
    trace: 'retain-on-failure',
    headless: isHeadless,
  },
  projects: [
    {
      name: 'chromium',
      testDir,
      use: {
        ...devices['Desktop Chrome'],
        /** If navigation takes more than this, then something's wrong, let's fail fast. */
        navigationTimeout: defaultNavigationTimeout,
      },
    },
  ],
}

export default config
