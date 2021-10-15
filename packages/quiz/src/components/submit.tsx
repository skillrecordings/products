import Button from '@skillrecordings/react/dist/components/button'
import React from 'react'

const SubmitButton: React.FC<{
  isAnswered: boolean
  isSubmitting: boolean
}> = ({isAnswered, isSubmitting}) => {
  return (
    <Button
      data-sr-quiz-submit
      type="submit"
      isDisabled={isAnswered}
      isLoading={isSubmitting}
    >
      Submit
    </Button>
  )
}

export default SubmitButton
