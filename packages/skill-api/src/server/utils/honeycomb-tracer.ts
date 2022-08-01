import {DeterministicSampler, Tracer} from '@vercel/tracing-js'

const getTracer = () => {
  return new Tracer(
    {
      serviceName: 'testing-accessibility',
      environment: process.env.ENVIRONMENT,
      dc: 'ta-dc',
      podName: 'ta-pod',
      nodeName: 'ta-node',
      sampler: new DeterministicSampler(process.env.TRACE_SAMPLE_RATE),
    },
    {
      writeKey: process.env.HONEYCOMB_WRITE_KEY!,
      dataset: process.env.HONEYCOMB_DATASET!,
    },
  )
}

export default getTracer

export const tracer = getTracer()
