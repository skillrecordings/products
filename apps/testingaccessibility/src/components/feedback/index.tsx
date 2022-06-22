import {useFeedback} from 'context/feedback-context'
import FeedbackDialog from '../dialog'
import FeedbackForm from './form'

const Feedback = () => {
  const {isFeedbackDialogOpen, setIsFeedbackDialogOpen} = useFeedback()
  const handleCloseDialog = () => {
    setIsFeedbackDialogOpen(false, 'navigation')
  }
  return (
    <FeedbackDialog
      title="Tell us what you think!"
      isOpen={isFeedbackDialogOpen}
      handleCloseDialog={handleCloseDialog}
    >
      <FeedbackForm />
    </FeedbackDialog>
  )
}

export default Feedback
