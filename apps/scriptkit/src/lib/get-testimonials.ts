import path from 'path'
import {readJson} from 'fs-extra'

async function getTestimonials() {
  const testimonials: any = await readJson(
    path.resolve('public', 'data', `testimonials.json`),
  )
  return testimonials
}

export {getTestimonials}
