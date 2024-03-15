import type React from 'react'
import BookResourceLayout from '../../(lesson)/layout'

const SolutionLayout: React.FC<any> = (props) => {
  return (
    <BookResourceLayout
      {...props}
      // this is required to handle difference in navigation (next, prev) for
      // individual solution pages used in "workshop mode"
      // because the solution pages are not part of the main book navigation
      isSolution={true}
    />
  )
}

export default SolutionLayout
