import {loadEnvConfig} from '@next/env'
import {chromium} from '@playwright/test'

async function globalSetup(/* config: FullConfig */) {
  loadEnvConfig(String(process.env.PWD))
  const browser = await chromium.launch()

  await browser.close()
}

export default globalSetup
