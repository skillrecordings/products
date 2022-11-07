import {devices, PlaywrightTestConfig} from '@playwright/test'
import {loadEnvConfig} from '@next/env'
import process from 'process'
import path from 'path'
import os from 'os'

const appRootDir = process.env.PWD
const outputDir = path.join(appRootDir, 'test-results')
const testDir = path.join(appRootDir, 'playwright')

loadEnvConfig(appRootDir)

const DEFAULT_NAVIGATION_TIMEOUT = 15000
const isCI = !!process.env.CI
const isPlayWrightHeadless = !!process.env.PLAYWRIGHT_HEADLESS
const isHeadless = isCI || isPlayWrightHeadless

const config: PlaywrightTestConfig = {
  forbidOnly: isCI,
  retries: 1,
  workers: isHeadless ? os.cpus().length : 1,
  timeout: 20_000,
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
    command: 'pnpm db:start && pnpm start',
    port: process.env.LOCALHOST_PORT,
    timeout: 20_000,
    reuseExistingServer: !isCI,
  },
  use: {
    baseURL: 'http://localhost:3013/',
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
        navigationTimeout: DEFAULT_NAVIGATION_TIMEOUT,
      },
    },
    /*  {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    }, */
  ],
}

export default config
