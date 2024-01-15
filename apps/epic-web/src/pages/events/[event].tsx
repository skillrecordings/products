import {Event, getAllEvents, getEvent} from 'lib/events'
import React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import EventTemplate from 'templates/event-template'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const event = await getEvent(params?.event as string)
  const mdx = event.body && (await serializeMDX(event.body))

  return {
    props: {event, mdx},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const events = await getAllEvents()
  const paths = events.map((event: Event) => ({
    params: {event: event.slug},
  }))
  return {paths, fallback: 'blocking'}
}

type EventPageProps = {
  event: Event
  mdx: MDXRemoteSerializeResult
}

const EventPage: React.FC<EventPageProps> = ({event, mdx}) => {
  return <EventTemplate event={event} mdx={mdx} />
}

export default EventPage
