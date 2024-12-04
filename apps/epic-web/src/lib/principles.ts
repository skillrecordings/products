import {EpicPrinciples, validateEpicPrinciples} from '../principles/schemas'
import data from '../principles/data.json'

export function getPrinciples(): EpicPrinciples {
  return validateEpicPrinciples(data)
}

export function getSection(slug: string) {
  const principles = getPrinciples()
  return principles.sections.find((section) => section.slug === slug)
}

export function getSubsection(sectionSlug: string, subsectionSlug: string) {
  const section = getSection(sectionSlug)
  return section?.subsections?.find(
    (subsection) => subsection.slug === subsectionSlug,
  )
}

export function getPrinciple(
  sectionSlug: string,
  subsectionSlug: string | null,
  principleSlug: string,
) {
  if (subsectionSlug) {
    const subsection = getSubsection(sectionSlug, subsectionSlug)
    return subsection?.principles.find(
      (principle) => principle.slug === principleSlug,
    )
  } else {
    const section = getSection(sectionSlug)
    return section?.principles?.find(
      (principle) => principle.slug === principleSlug,
    )
  }
}

export function getAllPaths() {
  const principles = getPrinciples()
  const paths: {params: {principles: string[]}}[] = []

  // Add root path
  paths.push({params: {principles: []}})

  // Add section paths
  principles.sections.forEach((section) => {
    paths.push({params: {principles: [section.slug]}})

    // Add principle paths
    section.principles?.forEach((principle) => {
      paths.push({
        params: {principles: [section.slug, principle.slug]},
      })
    })

    // Add subsection paths if they exist
    section.subsections?.forEach((subsection) => {
      paths.push({
        params: {principles: [section.slug, subsection.slug]},
      })

      // Add principle paths within subsections
      subsection.principles.forEach((principle) => {
        paths.push({
          params: {principles: [section.slug, subsection.slug, principle.slug]},
        })
      })
    })
  })

  return paths
}
