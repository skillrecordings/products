import {PlaywrightTestConfig} from '@playwright/test'
const config: PlaywrightTestConfig = {
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3013',
  },
}
export default config
