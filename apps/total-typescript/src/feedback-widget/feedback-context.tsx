import React from 'react'
import FeedbackDialog from './feedback-dialog'

type FeedbackContextType = {
  isFeedbackDialogOpen: boolean
  setIsFeedbackDialogOpen: (value: boolean, location?: string) => void
  feedbackComponent: React.ReactElement
  location: string
}

const defaultFeedbackContext: FeedbackContextType = {
  isFeedbackDialogOpen: false,
  setIsFeedbackDialogOpen: () => {},
  feedbackComponent: <></>,
  location: '',
}

export function useFeedback() {
  return React.useContext(FeedbackContext)
}

export const FeedbackContext = React.createContext(defaultFeedbackContext)

export const FeedbackProvider: React.FC<React.PropsWithChildren<any>> = ({
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
          console.log('location', location, value)
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
