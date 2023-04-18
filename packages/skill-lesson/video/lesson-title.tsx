import {useLesson} from '../hooks/use-lesson'
import Balancer from 'react-wrap-balancer'

export const LessonTitle = () => {
  const {lesson} = useLesson()
  const {title, _type} = lesson
  return (
    <>
      <span data-lesson-badge={_type}>
        {_type !== 'exercise' ? _type : 'Problem'}
      </span>
      <h1 data-lesson-title="">
        <Balancer>{title}</Balancer>
      </h1>
    </>
  )
}
