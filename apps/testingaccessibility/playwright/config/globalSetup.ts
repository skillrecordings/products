import {loadEnvConfig} from '@next/env'
import {Browser, chromium} from '@playwright/test'
import fs from 'fs'

async function globalSetup(/* config: FullConfig */) {
  loadEnvConfig(process.env.PWD)
  const browser = await chromium.launch()

  await browser.close()
}

export default globalSetup
