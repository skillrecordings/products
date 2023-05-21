import {
  formatDate,
  setConvertkitSubscriberFields,
} from '@skillrecordings/convertkit-sdk'
import {type Subscriber} from '../schemas/subscriber'
import {inngest} from '@skillrecordings/inngest'

export const transformSlugsToConvertkitField = ({
  moduleSlug,
  lessonSlug,
  action,
  separator = '_',
}: {
  moduleSlug: string
  lessonSlug: string
  action: string
  separator?: string
}) => {
  const transformedModuleSlug = moduleSlug.replace('-', separator)
  const transformedLessonSlug = lessonSlug.replace('-', separator)
  return (
    transformedModuleSlug +
    separator +
    transformedLessonSlug +
    separator +
    action
  )
}

/**
 * updates a custom field on convertkit with the current date/time
 * when a learner completes a lesson (exercise/tip/etc)
 *
 * @param subscriber
 * @param moduleSlug
 * @param lessonSlug
 */
export const markLessonComplete = async ({
  subscriber,
  moduleSlug,
  lessonSlug,
}: {
  subscriber: Subscriber
  moduleSlug: string
  lessonSlug: string
}) => {
  try {
    const fieldName = transformSlugsToConvertkitField({
      moduleSlug,
      lessonSlug,
      action: 'completed_on',
    })
    const response = await setConvertkitSubscriberFields(subscriber, {
      [fieldName]: formatDate(new Date()),
    })

    return await response.json()
  } catch (error) {
    return {error}
  }
}

/**
 * updates a custom field on convertkit with the current date/time
 * when a learner completes a lesson (exercise/tip/etc)
 *
 * @param subscriber
 * @param moduleSlug
 * @param lessonSlug
 */
export const answerSurvey = async ({
  subscriber,
  question,
  answer,
}: {
  subscriber: Subscriber
  question: string
  answer: string
}) => {
  try {
    const response = await setConvertkitSubscriberFields(
      {
        id: subscriber.id,
        fields: subscriber.fields,
      },
      {
        [question]: answer,
        last_surveyed_on: formatDate(new Date()),
      },
    ).then((response) => response.json())

    await inngest.send({
      name: 'convertkit/survey-answered',
      data: {
        subscriber,
        question,
        answer,
      },
    })

    return response
  } catch (error) {
    return {error}
  }
}
