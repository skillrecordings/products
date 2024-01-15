import React from 'react'
import Layout from '@/components/app/layout'
import {getAllTutorials} from '@/lib/tutorials'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import Link from 'next/link'
import Image from 'next/image'
import Balancer from 'react-wrap-balancer'
import Header from '@/components/app/header'
import pluralize from 'pluralize'
import {getOgImage} from '@/utils/get-og-image'
import {ModulesTemplate} from '../workshops'

export async function getStaticProps() {
  const tutorials = await getAllTutorials()

  return {
    props: {tutorials},
    revalidate: 10,
  }
}

// There are multiple sections containing arrays of lessons. I'd like to flat map them into a single array of lessons.
const sectionsFlatMap = (sections: any[]) => {
  const map = sections.flatMap((section) => {
    return section.lessons || []
  })

  return map
}

const Tutorials: React.FC<{tutorials: Module[]}> = ({tutorials}) => {
  return <ModulesTemplate title="Free Tutorials" modules={tutorials} />
}

export default Tutorials
