import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

export const getAllTestimonials = async () =>
  await sanityClient.fetch(groq`*[_type == "testimonial"] | order(_createdAt asc) {
  _id,
  _type,
  name,
  title,
  text,
  image
}`)
