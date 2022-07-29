import * as React from 'react'
import {useViewportScroll} from 'framer-motion'
import {useLocalStorage} from 'react-use'
import {Dialog} from '@reach/dialog'
import SubscribeToConvertkitForm, {
  SubscribeFormProps,
} from '../subscribe-to-convertkit'

//TODO: separate the styling and the behavior so that it can be customized

function usePopupConvertkitForm(
  threshold: 0.6 | 0.7 | 0.75 | 0.8 | 0.85 | 0.9, // 1 is 100% of page height
) {
  // TODO: get user preference from CK or Customer.io
  const [dismissed, setDismissed, _removeDismissedPreference] = useLocalStorage(
    'dismissed-popup-form',
    'false',
  )

  const {scrollYProgress} = useViewportScroll()
  const [peaking, setPeaking] = React.useState<boolean>(false)
  const [opened, setOpened] = React.useState<boolean>(false)
  const [closed, setClosed] = React.useState<boolean>(false)

  scrollYProgress.onChange((y) => {
    if (dismissed !== 'true') {
      const yRound = Number(y.toFixed(1))
      if (yRound === threshold) {
        setPeaking(opened ? false : closed ? false : true)
      }
    }
  })

  function handleOpen() {
    setOpened(true)
    setPeaking(false)
  }

  function handleClose() {
    setClosed(true)
    setPeaking(false)
  }

  function handleDismissForever() {
    setClosed(true)
    setOpened(false)
    setDismissed('true')
  }

  return {
    peaking,
    handleClose,
    opened,
    dismissed,
    handleOpen,
    handleDismissForever,
  }
}

type PopupConvertkitFormProps = {
  children?: React.ReactNode
  peakingContent?: React.ReactNode
  subscribeFormProps?: SubscribeFormProps
}

const PopupConvertkitForm: React.FC<
  React.PropsWithChildren<PopupConvertkitFormProps>
> = ({children, peakingContent, subscribeFormProps}) => {
  const {
    peaking,
    handleClose,
    opened,
    dismissed,
    handleOpen,
    handleDismissForever,
  } = usePopupConvertkitForm(0.7)

  return dismissed !== 'true' ? (
    <>
      <div
        className={`${
          peaking ? 'left-0 -rotate-3' : '-left-1/2 rotate-0'
        } fixed bottom-24 -translate-x-3 rounded-md bg-black transition-all ease-in-out duration-300  text-white text-lg`}
      >
        <div className="max-w-md pl-10 p-5">
          {peakingContent}
          <div className="space-x-2 pt-4">
            <button
              className="bg-white text-black px-4 py-2 rounded-md"
              onClick={() => handleOpen()}
            >
              Yes!
            </button>
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded-md"
              onClick={() => handleDismissForever()}
            >
              No
            </button>
            <button onClick={() => handleClose()} className="p-2">
              ×
            </button>
          </div>
        </div>
      </div>
      <Dialog
        isOpen={opened}
        onDismiss={() => handleDismissForever()}
        aria-label="subscribe"
      >
        {children ? (
          children
        ) : (
          <SubscribeToConvertkitForm {...subscribeFormProps} />
        )}
      </Dialog>
    </>
  ) : null
}

export default PopupConvertkitForm
export {usePopupConvertkitForm}
