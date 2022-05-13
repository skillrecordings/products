import React from 'react'
import FeedbackDialog from 'components/feedback'

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

export const FeedbackProvider: React.FC<any> = ({children}) => {
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
