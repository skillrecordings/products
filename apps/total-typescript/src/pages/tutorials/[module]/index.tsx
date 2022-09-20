import React from 'react'
import {getSubscriberByEmail} from 'lib/get-subscriber-by-email'
import TutorialTemplate from 'templates/tutorial-template'
import {prisma, User} from '@skillrecordings/database'
import {SanityDocument} from '@sanity/client'
import {Subscriber} from 'lib/convertkit'
import {getModule} from 'lib/tutorials'
import {GetServerSideProps} from 'next'
import isEmpty from 'lodash/isEmpty'

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

    const subscriber = user?.email && (await getSubscriberByEmail(user?.email))

    if (!isEmpty(subscriber)) {
      return {
        props: {
          tutorial,
          subscriber,
        },
      }
    }
  }

  return {
    props: {tutorial},
  }
}

const TutorialPage: React.FC<{
  tutorial: SanityDocument
  subscriber: Subscriber
}> = ({tutorial, subscriber}) => {
  return tutorial ? (
    <TutorialTemplate tutorial={tutorial} subscriber={subscriber} />
  ) : null
}

export default TutorialPage
