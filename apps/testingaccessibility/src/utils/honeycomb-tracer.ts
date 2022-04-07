import {DeterministicSampler, Tracer} from '@vercel/tracing-js'

const getTracer = (serviceName: string) => {
  return new Tracer(
    {
      serviceName: serviceName,
      environment: process.env.ENVIRONMENT,
      sampler: new DeterministicSampler(process.env.TRACE_SAMPLE_RATE),
    },
    {
      writeKey: process.env.HONEYCOMB_WRITE_KEY!,
      dataset: process.env.HONEYCOMB_DATASET!,
    },
  )
}

export default getTracer

export const tracer = getTracer('testing-accessibility')
