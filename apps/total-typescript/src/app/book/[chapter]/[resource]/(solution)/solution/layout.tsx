import type React from 'react'
import BookResourceLayout, {
  type BookResourceLayoutProps,
} from '../../(lesson)/layout'

const SolutionLayout: React.FC<BookResourceLayoutProps> = (props) => {
  return (
    <BookResourceLayout
      {...props}
      // this is required to handle difference in navigation (next, prev) for
      // individual solution pages used in "workshop mode"
      isSolution={true}
    />
  )
}

export default SolutionLayout
