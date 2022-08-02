import {DeterministicSampler, Tracer} from '@vercel/tracing-js'

const getTracer = () => {
  return new Tracer(
    {
      serviceName: 'engineering-management',
      environment: process.env.ENVIRONMENT,
      dc: 'em-dc',
      podName: 'em-pod',
      nodeName: 'em-node',
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
