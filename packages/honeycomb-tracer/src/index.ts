export * from './honeycomb-tracer'

export {
  SpanContext,
  setupHttpTracing,
  setupFetchTracing,
} from '@vercel/tracing-js'
