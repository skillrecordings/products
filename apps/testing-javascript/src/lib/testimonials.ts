import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

export const getAllTestimonials = async () =>
  await sanityClient.fetch(groq`*[_type == "testimonial"] | order(_createdAt desc) {
  _id,
  _type,
  author: {
    name,
    title,
    image
  },
  body
}`)
