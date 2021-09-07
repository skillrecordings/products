import * as React from 'react'
import {useViewportScroll} from 'framer-motion'
import {useLocalStorage} from 'react-use'
import {Dialog} from '@reach/dialog'
import SubscribeForm from '../subscribe-form'

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
    setOpened(false)
    setClosed(true)
    setPeaking(false)
  }

  function handleDismissForever() {
    // setClosed(true)
    // setOpened(false)
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

  return (
    <>
      {dismissed !== ' true' ? (
        <div
          className={`${
            peaking ? 'left-0 -rotate-3' : '-left-full sm:-left-1/2 rotate-0'
          } fixed bottom-24 -translate-x-3 shadow-2xl bg-blue-600 rounded-xl transform transition-all ease-in-out duration-300  text-white text-lg`}
        >
          <div className="max-w-md p-6 pl-10">
            {peakingContent}
            <div className="pt-4 space-x-2">
              <button
                type="button"
                className="px-3 py-1 text-white bg-transparent rounded-md bg-gray-900 bg-opacity-20"
                onClick={() => handleDismissForever()}
              >
                No
              </button>
              <button
                type="button"
                className="px-3 py-1 text-gray-900 bg-white rounded-md"
                onClick={() => handleOpen()}
              >
                Sí, por supuesto
              </button>
              <button
                onClick={() => handleClose()}
                className="absolute p-2 text-lg top-1 right-1"
              >
                <svg
                  focusable="false"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                >
                  <g fill="currentColor">
                    <path
                      d="M10.707,1.293a1,1,0,0,0-1.414,0L6,4.586,2.707,1.293A1,1,0,0,0,1.293,2.707L4.586,6,1.293,9.293a1,1,0,1,0,1.414,1.414L6,7.414l3.293,3.293a1,1,0,0,0,1.414-1.414L7.414,6l3.293-3.293A1,1,0,0,0,10.707,1.293Z"
                      fill="currentColor"
                    ></path>
                  </g>
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <Dialog
        isOpen={opened}
        onDismiss={() => handleClose()}
        aria-label="subscribe"
        className="relative w-full max-w-screen-sm rounded-3xl shadow-xl bg-gray-100 dark:bg-gray-800 backdrop-filter backdrop-blur-3xl dark:bg-opacity-80 bg-opacity-80 opacity-0 secondary-animation"
      >
        <SubscribeForm
          className="p-5"
          onSubmit={() => handleDismissForever()}
        />
        <button
          className="absolute p-3 bg-gray-100 rounded-full top-3 right-3 hover:bg-gray-200 dark:bg-gray-600"
          type="button"
          aria-label="close"
          onClick={() => handleClose()}
        >
          <svg
            focusable="false"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
          >
            <g fill="currentColor">
              <path
                d="M10.707,1.293a1,1,0,0,0-1.414,0L6,4.586,2.707,1.293A1,1,0,0,0,1.293,2.707L4.586,6,1.293,9.293a1,1,0,1,0,1.414,1.414L6,7.414l3.293,3.293a1,1,0,0,0,1.414-1.414L7.414,6l3.293-3.293A1,1,0,0,0,10.707,1.293Z"
                fill="currentColor"
              />
            </g>
          </svg>
        </button>
      </Dialog>
    </>
  )
}

export default PoliteConvertkitForm
export {usePoliteConvertkitForm}
