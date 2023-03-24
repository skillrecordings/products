import * as React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getAllWorkshops, getWorkshopBySlug} from '../../../lib/resources'
import WorkshopTemplate from '../../../templates/workshop-template'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const workshop = await getWorkshopBySlug(params?.workshop as string)

  return {
    props: {workshop},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const workshops = await getAllWorkshops()
  const paths = workshops.map((workshop: any) => ({
    params: {workshop: workshop.slug},
  }))
  return {paths, fallback: 'blocking'}
}

const WorkshopPage: React.FC<any> = ({workshop}) => {
  return <WorkshopTemplate workshop={workshop} />
}

export default WorkshopPage
