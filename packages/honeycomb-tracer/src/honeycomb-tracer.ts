import {DeterministicSampler, Tracer} from '@vercel/tracing-js'
import slugify from 'slugify'

const getTracer = () => {
  const slug = slugify(process.env.NEXT_PUBLIC_PRODUCT_NAME, {lower: true})
  return new Tracer(
    {
      serviceName: process.env.NEXT_PUBLIC_PRODUCT_NAME,
      environment: process.env.ENVIRONMENT,
      dc: `${slug}-dc`,
      podName: `${slug}-pod`,
      nodeName: `${slug}-node`,
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
