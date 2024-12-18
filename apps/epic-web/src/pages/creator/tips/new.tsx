import React from 'react'
import CreateTipForm from 'module-builder/create-tip-form'
import Layout from 'components/app/layout'
import {Alert, AlertDescription, AlertTitle} from '@skillrecordings/ui'
import {GrInfo} from 'react-icons/gr'
import {getCurrentAbility} from '@skillrecordings/skill-lesson'
import {UserSchema} from '@skillrecordings/skill-lesson'
import {getToken} from 'next-auth/jwt'
import {GetServerSideProps} from 'next'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = await getToken({req: context.req})
  const user = UserSchema.parse(token)
  const ability = getCurrentAbility({user})
  if (!ability.can('create', 'Content')) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

const NewTip = () => {
  return (
    <Layout>
      <header className="py-10">
        <h1 className="text-center text-3xl font-bold">Create a New Tip</h1>
      </header>
      <main className="mx-auto w-full max-w-lg px-3">
        <Alert>
          <GrInfo className="h-4 w-4 dark:invert" />
          <AlertTitle>First upload a video</AlertTitle>
          <AlertDescription>
            When your video upload has been completed you will be able to add a
            title and additional details to your tip.
          </AlertDescription>
        </Alert>
        <br />
        <CreateTipForm />
      </main>
    </Layout>
  )
}

export default NewTip
