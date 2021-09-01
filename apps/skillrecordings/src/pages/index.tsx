import * as React from 'react'
import Layout from 'components/app/layout'
import SkillRecordingsLogo from '../components/icons/sr-logo'

export default function Home() {
  return (
    <>
      <Layout meta={{title: 'Skill Recordings'}}>
        <SkillRecordingsLogo fill={true} className="text-pink-500 p-1 w-full" />
      </Layout>
    </>
  )
}
