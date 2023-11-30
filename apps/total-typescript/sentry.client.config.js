// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'
import {BrowserTracing} from '@sentry/tracing'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  integrations: [new BrowserTracing()],
  ignoreErrors: ['ResizeObserver'],
  dsn:
    SENTRY_DSN ||
    'https://936f0f7cc2484582b9a4ed2b8381248d@o1184810.ingest.sentry.io/6763299',
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.2,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
})
