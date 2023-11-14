import React from 'react'
import {GetServerSideProps} from 'next'
import EmbedTemplate, {VideoEmbedPageProps} from '@/templates/embed-template'
import {getPropsForEmbed} from '@/utils/get-props-for-embeds'

export const getServerSideProps: GetServerSideProps = async (context) => {
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
  } = await getPropsForEmbed(context, 'workshop', false)

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
