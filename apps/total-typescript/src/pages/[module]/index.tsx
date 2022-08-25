import {getModule} from 'lib/modules'
import {GetServerSideProps} from 'next'
import React from 'react'
import ModuleTemplate from 'templates/module-template'

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
  const module = await getModule(params?.module as string)
  if (!module) {
    return {
      notFound: true,
    }
  }

  return {
    props: {module},
  }
}

const ModulePage: React.FC<any> = ({module}) => {
  return <ModuleTemplate module={module} />
}

export default ModulePage
