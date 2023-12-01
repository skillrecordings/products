// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'
//import {ProfilingIntegration} from '@sentry/profiling-node'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn:
    SENTRY_DSN ||
    'https://b3cef546dbac47b3a16dea4ccbff4c29@o1184810.ingest.sentry.io/4503925131837440',
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  ignoreErrors: ['ResizeObserver'],
  //profilesSampleRate: 1.0, // Profiling sample rate is relative to tracesSampleRate
  //integrations: [
    // Add profiling integration to list of integrations
    
  //],
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
})
