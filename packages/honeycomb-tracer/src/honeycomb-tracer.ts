import {DeterministicSampler, Tracer} from '@vercel/tracing-js'
import slugify from 'slugify'

const getTracer = () => {
  const serviceName = slugify(
    process.env.NEXT_PUBLIC_PRODUCT_NAME || 'Skill Recordings',
    {lower: true},
  )
  return new Tracer(
    {
      serviceName,
      environment: process.env.ENVIRONMENT,
      dc: `${serviceName}-dc`,
      podName: `${serviceName}-pod`,
      nodeName: `${serviceName}-node`,
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
