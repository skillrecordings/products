import {
  SpanContext,
  DeterministicSampler,
  Tracer,
  setupFetchTracing,
  setupHttpTracing,
} from '@vercel/tracing-js'

export * from './honeycomb-tracer'

export {
  SpanContext,
  DeterministicSampler,
  Tracer,
  setupFetchTracing,
  setupHttpTracing,
}
