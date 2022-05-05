import React from 'react'
import {SanityDocument} from '@sanity/client'
import Layout from 'components/app/layout'
import {useProgress} from 'context/progress-context'
import {getModuleProgressForUser} from 'utils/progress'
import BreadcrumbNav from 'components/breadcrumb'
import {Sections} from 'pages/learn'

type ModuleTemplateProps = {
  module: SanityDocument
}

const ModuleTemplate: React.FC<ModuleTemplateProps> = ({module}) => {
  const {slug, title, body, sections} = module
  const {progress} = useProgress()
  const {completedSections, percentCompleted, isCompleted} =
    getModuleProgressForUser(progress, sections)
  return (
    <Layout>
      <div>
        <header className="bg-gray-100">
          <div className="max-w-screen-lg mx-auto w-full py-4 lg:px-2 px-4">
            <BreadcrumbNav module={module} />
          </div>
        </header>
        <main className="max-w-screen-lg mx-auto w-full p-5 pt-16">
          <h1 className="text-4xl text-center font-bold pb-5">
            {isCompleted && ' ✅'} {title}
          </h1>
          {sections && <Sections module={module} />}
        </main>
      </div>
    </Layout>
  )
}

export default ModuleTemplate
