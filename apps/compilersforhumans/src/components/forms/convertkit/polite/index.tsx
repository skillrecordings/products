import * as React from 'react'
import {useViewportScroll} from 'framer-motion'
import {useLocalStorage} from 'react-use'
import {Dialog} from '@reach/dialog'
import ConvertkitSubscribeForm from 'components/forms/convertkit'

function usePoliteConvertkitForm(
  threshold: 0.6 | 0.7 | 0.75 | 0.8 | 0.85 | 0.9, // 1 is 100% of page height
) {
  // TODO: get user preference from CK or Customer.io
  const [dismissed, setDismissed, _removeDismissedPreference] = useLocalStorage(
    'dismissed-polite-message',
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

const PoliteConvertkitForm = ({children, peakingContent}: any) => {
  const {
    peaking,
    handleClose,
    opened,
    dismissed,
    handleOpen,
    handleDismissForever,
  } = usePoliteConvertkitForm(0.7)

  return dismissed !== 'true' ? (
    <>
      <div
        className={`${
          peaking ? 'left-0 -rotate-3' : '-left-1/2 rotate-0'
        } fixed bottom-24 -translate-x-3 rounded-md bg-black transform transition-all ease-in-out duration-300  text-white text-lg`}
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
        <div className="pb-4">{children}</div>
        <ConvertkitSubscribeForm onSubmit={() => handleDismissForever()} />
      </Dialog>
    </>
  ) : null
}

export default PoliteConvertkitForm
export {usePoliteConvertkitForm}
