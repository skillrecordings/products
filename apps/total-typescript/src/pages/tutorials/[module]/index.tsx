import React from 'react'
import TutorialTemplate from 'templates/tutorial-template'
import {convertToSerializeForNextResponse} from '@skillrecordings/commerce-server'
import {prisma, User} from '@skillrecordings/database'
import {SanityDocument} from '@sanity/client'
import {getModule} from 'lib/tutorials'
import {GetServerSideProps} from 'next'

export const USER_ID_QUERY_PARAM_KEY = 'learner'

export const getServerSideProps: GetServerSideProps = async ({
  res,
  params,
  query,
}) => {
  const tutorial = await getModule(params?.module as string)

  const userIdFromQuery = query[USER_ID_QUERY_PARAM_KEY]

  if (!tutorial) {
    return {
      notFound: true,
    }
  }

  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  if (userIdFromQuery) {
    const user = await prisma.user.findUnique({
      where: {id: userIdFromQuery as string},
    })

    return {
      props: {
        tutorial,
        user: convertToSerializeForNextResponse(user),
      },
    }
  }

  return {
    props: {tutorial},
  }
}

const TutorialPage: React.FC<{tutorial: SanityDocument; user: User}> = ({
  tutorial,
  user,
}) => {
  return tutorial ? <TutorialTemplate tutorial={tutorial} user={user} /> : null
}

export default TutorialPage
