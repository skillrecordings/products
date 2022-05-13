import React from 'react'
import {Dialog, Transition} from '@headlessui/react'
import {useFeedback} from 'context/feedback-context'
import {XIcon} from '@heroicons/react/solid'

const FeedbackDialog: React.FC = ({children}) => {
  const {isFeedbackDialogOpen, setIsFeedbackDialogOpen} = useFeedback()
  const closeButtonRef = React.useRef<HTMLButtonElement>(null)
  const handleCloseDialog = () => {
    setIsFeedbackDialogOpen(false, 'navigation')
  }

  return (
    <Transition appear show={isFeedbackDialogOpen} as={React.Fragment}>
      <Dialog
        initialFocus={closeButtonRef}
        open={isFeedbackDialogOpen}
        onClose={handleCloseDialog}
        as="div"
        className="relative z-50"
      >
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-25"
            aria-hidden="true"
          />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h1"
                  className="text-xl border-b border-gray-200 font-bold leading-6 text-gray-900 pb-3 w-full mb-3 inline-block"
                >
                  Tell us what you think!
                </Dialog.Title>
                <div className="mt-2">{children}</div>
                <CloseButton
                  ref={closeButtonRef}
                  handleCloseDialog={handleCloseDialog}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

type CloseButtonProps = {
  handleCloseDialog: () => void
}

const CloseButton = React.forwardRef<HTMLButtonElement, CloseButtonProps>(
  ({handleCloseDialog}, ref) => {
    return (
      <div className="absolute top-2 right-2">
        <button
          ref={ref}
          type="button"
          className="inline-flex justify-center rounded-md hover:bg-gray-100 hover:shadow-inner border border-transparent p-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition"
          onClick={handleCloseDialog}
        >
          <XIcon className="w-5 h-5" aria-hidden="true" />
          <span className="sr-only">Close feedback dialog</span>
        </button>
      </div>
    )
  },
)

export default FeedbackDialog
