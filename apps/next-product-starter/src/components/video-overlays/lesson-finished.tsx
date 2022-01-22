import React from 'react'
import {useVideo} from '@skillrecordings/player'
import router from 'next/router'
import {motion} from 'framer-motion'

const LessonFinishedOverlay: React.FC<{nextResource?: any}> = ({
  nextResource,
}) => {
  const videoService = useVideo()
  const DURATION = 8
  const [seconds, setSeconds] = React.useState<number>(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds + 1)
    }, 1000)
    const timeout = setTimeout(() => {
      nextResource &&
        router.push(`/video/${nextResource.slug}`).then(() => {
          videoService.send('PLAY')
        })
    }, DURATION * 1000)
    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  // TODO: Focus management (+aria)
  return (
    <div className="z-50 absolute left-0 top-0 bg-black bg-opacity-80 backdrop-blur-xl w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-lg">
        share
        <button
          onClick={() => {
            videoService.send('PLAY')
            videoService.send({type: 'SET_OVERLAY', overlay: null})
          }}
        >
          Replay
          <svg
            width="20"
            height="22"
            viewBox="0 0 20 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.0273 0.86084L12.0242 9.97597L15.0151 6.98507C17.7212 9.69112 17.7212 14.2487 15.0151 16.9547C13.7333 18.379 11.8818 19.0911 10.0303 19.0911C8.17879 19.0911 6.32728 18.379 5.04547 16.9547C2.33941 14.2487 2.33941 9.69112 5.04547 6.98507C5.90001 6.13052 7.0394 5.4184 8.32122 5.13356L7.46667 2.4275C5.75759 2.85477 4.19092 3.70932 2.90911 4.99113C-0.936337 8.83658 -0.936337 15.1032 2.90911 19.0911C4.76062 20.9426 7.32425 21.9396 9.88788 21.9396C12.5939 21.9396 15.0151 20.9426 16.8666 19.0911C20.7121 15.2457 20.7121 8.979 16.8666 4.99113L20 1.85781L11.0273 0.86084Z"
              fill="currentColor"
            />
          </svg>
        </button>
        {nextResource && (
          <>
            Up next: {nextResource.title}
            <button
              onClick={() => {
                router.push(`/video/${nextResource.slug}`).then(() => {
                  videoService.send('PLAY')
                })
              }}
            >
              <svg
                width="50"
                height="50"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.circle
                  transition={{duration: DURATION, ease: 'linear'}}
                  animate={{pathLength: [0, 1]}}
                  cx="25"
                  cy="25"
                  r="22.5"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <path
                  d="M29 24.9991C29 24.6731 28.841 24.3671 28.573 24.1801L18.573 17.1801C18.269 16.9661 17.869 16.9421 17.538 17.1121C17.207 17.2851 17 17.6261 17 17.9991V32.0001C17 32.3731 17.207 32.7151 17.538 32.8871C17.869 33.0571 18.268 33.0331 18.573 32.8191L28.573 25.8191C28.841 25.6331 29 25.3271 29 25.0011C29 25.0001 29 25.0001 29 24.9991C29 25.0001 29 25.0001 29 24.9991Z"
                  fill="currentColor"
                />
                <path
                  d="M32 33C31.448 33 31 32.553 31 32V18C31 17.447 31.448 17 32 17C32.552 17 33 17.447 33 18V32C33 32.553 32.552 33 32 33Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default LessonFinishedOverlay
