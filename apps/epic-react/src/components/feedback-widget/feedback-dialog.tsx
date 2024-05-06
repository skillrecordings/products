import {useFeedback} from './feedback-context'
import FeedbackDialog from './dialog'
import FeedbackForm from './form'

const Feedback = () => {
  const {isFeedbackDialogOpen, setIsFeedbackDialogOpen, location} =
    useFeedback()
  const handleCloseDialog = () => {
    setIsFeedbackDialogOpen(false, 'navigation')
  }
  return (
    <FeedbackDialog
      title="Tell me how you feel about it"
      isOpen={isFeedbackDialogOpen}
      handleCloseDialog={handleCloseDialog}
    >
      <FeedbackForm location={location} />
    </FeedbackDialog>
  )
}

export default Feedback
