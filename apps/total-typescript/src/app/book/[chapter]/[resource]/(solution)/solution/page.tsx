import {getBookMode} from '../../(lesson)/layout'
import ChapterResourceRoute from '../../(lesson)/page'

const SolutionRoute = async (props: any) => {
  const {mode} = getBookMode()

  return <ChapterResourceRoute {...props} isSolution={mode === 'video'} />
}

export default SolutionRoute
