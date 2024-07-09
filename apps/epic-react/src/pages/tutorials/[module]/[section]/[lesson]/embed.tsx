import React from 'react'
import {GetServerSideProps} from 'next'
import EmbedTemplate, {VideoEmbedPageProps} from 'templates/embed-template'
import {getPropsForEmbed} from 'utils/get-props-for-embeds'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props = await getPropsForEmbed(context, 'workshop', false)

  if (!props) {
    return {
      notFound: true,
    }
  }

  const {
    module,
    section,
    lesson,
    videoResourceId,
    videoResource,
    theme,
    login: {providers, csrfToken},
    convertkitSubscriber,
    abilityRules,
  } = props

  return {
    props: {
      module,
      section,
      lesson,
      videoResourceId,
      videoResource,
      theme,
      login: {
        providers,
        csrfToken,
      },
      convertkitSubscriber,
      abilityRules,
    },
  }
}

const LessonEmbed: React.FC<VideoEmbedPageProps> = (props) => {
  return <EmbedTemplate {...props} />
}

export default LessonEmbed
