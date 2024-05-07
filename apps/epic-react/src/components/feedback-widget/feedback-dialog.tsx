import * as React from 'react'
import {useFeedback} from './feedback-context'
import FeedbackDialog from './dialog'
import FeedbackForm from './form'

const Feedback = () => {
  const [isFormSubmitted, setFormSubmitted] = React.useState<boolean>(false)
  const {isFeedbackDialogOpen, setIsFeedbackDialogOpen, location} =
    useFeedback()
  const handleCloseDialog = () => {
    setIsFeedbackDialogOpen(false, 'navigation')
  }
  console.log({isFormSubmitted})
  return (
    <FeedbackDialog
      title="Tell me how you feel about it"
      isOpen={isFeedbackDialogOpen}
      handleCloseDialog={handleCloseDialog}
      isFormSubmitted={isFormSubmitted}
    >
      <FeedbackForm location={location} setFormSubmitted={setFormSubmitted} />
    </FeedbackDialog>
  )
}

export default Feedback
