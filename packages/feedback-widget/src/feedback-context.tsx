import React from 'react'
import FeedbackDialog from './feedback-dialog'

type FeedbackContextType = {
  isFeedbackDialogOpen: boolean
  setIsFeedbackDialogOpen: (value: boolean, location?: string) => void
  feedbackComponent: React.ReactElement | null
  location: string
}

const defaultFeedbackContext: FeedbackContextType = {
  isFeedbackDialogOpen: false,
  setIsFeedbackDialogOpen: () => {},
  feedbackComponent: <FeedbackDialog />,
  location: '',
}

export const useFeedback = () => {
  const context = React.useContext(FeedbackContext)
  return context
}

export const FeedbackContext = React.createContext(defaultFeedbackContext)

export const FeedbackProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] =
    React.useState<boolean>(false)
  const [location, setLocation] = React.useState<string>('navigation')

  return (
    <FeedbackContext.Provider
      value={{
        isFeedbackDialogOpen,
        setIsFeedbackDialogOpen: (value, location) => {
          location && setLocation(location)
          setIsFeedbackDialogOpen(value)
        },
        feedbackComponent: <FeedbackDialog />,
        location,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  )
}
