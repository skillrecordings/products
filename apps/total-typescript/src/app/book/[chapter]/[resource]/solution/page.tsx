import {getBookMode} from '../layout'
import ChapterResourceRoute from '../page'

const SolutionRoute = async (props: any) => {
  const {mode} = getBookMode()

  return <ChapterResourceRoute {...props} isSolution={mode === 'video'} />
}

export default SolutionRoute
