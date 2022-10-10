import Layout from '../components/app/layout'
import {Header} from '../components/home/home-header'
import {Copy} from '../components/home/home-body-copy'
import {SubscribeToNewsletter} from '../components/home/home-newsletter-cta'
import * as React from 'react'

export const HomeTemplate = ({level}: {level?: string}) => {
  return (
    <Layout
      meta={{
        title: `Professional TypeScript Training by Matt Pocock `,
      }}
    >
      <Header level={level} />
      <main>
        <Copy level={level} />
        <SubscribeToNewsletter level={level} />
      </main>
    </Layout>
  )
}
