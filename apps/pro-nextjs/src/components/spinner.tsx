import * as React from 'react'
import {AnimationControls, AnimationProps, motion} from 'framer-motion'

const Spinner: React.FunctionComponent<
  React.PropsWithChildren<{
    className?: string
  }>
> = ({className = '', ...rest}) => {
  const css = `.nc-loop-slideshow-anim-48-icon-f,.nc-loop-slideshow-anim-48-icon-f>*{--animation-duration:0.8s}.nc-loop-slideshow-anim-48-icon-f{transform-origin:50% 50%;animation:nc-loop-slideshow-anim-48 var(--animation-duration) infinite cubic-bezier(.215,.61,.355,1)}.nc-loop-slideshow-anim-48-icon-f>:nth-child(1){transform-origin:-8px 24px;transform:scale(.7)}.nc-loop-slideshow-anim-48-icon-f>:nth-child(2){transform-origin:8px 24px;animation:nc-loop-slideshow-anim-48-scale-up var(--animation-duration) infinite cubic-bezier(.215,.61,.355,1)}.nc-loop-slideshow-anim-48-icon-f>:nth-child(3){transform-origin:50% 50%;transform:scale(.7);animation:nc-loop-slideshow-anim-48-scale-down var(--animation-duration) infinite cubic-bezier(.215,.61,.355,1)}.nc-loop-slideshow-anim-48-icon-f>:nth-child(4){transform-origin:40px 24px;transform:scale(.7)}@keyframes nc-loop-slideshow-anim-48{0%{transform:translateX(0)}100%{transform:translateX(16px)}}@keyframes nc-loop-slideshow-anim-48-scale-down{0%{transform:scale(1)}100%{transform:scale(.7)}}@keyframes nc-loop-slideshow-anim-48-scale-up{0%{transform:scale(.7)}100%{transform:scale(1)}}`
  return (
    <AnimatedLogo className={className} {...rest} />
    // <svg
    //   className={className}
    //   aria-hidden="true"
    //   height="48"
    //   width="48"
    //   viewBox="0 0 48 48"
    //   xmlns="http://www.w3.org/2000/svg"
    //   {...rest}
    // >
    //   <g fill="currentColor">
    //     <g className="nc-loop-slideshow-anim-48-icon-f">
    //       <rect fill="currentColor" height="38" width="14" x="-15" y="5" />
    //       <rect fill="currentColor" height="38" width="14" x="1" y="5" />
    //       <rect fill="currentColor" height="38" width="14" x="17" y="5" />
    //       <rect fill="currentColor" height="38" width="14" x="33" y="5" />
    //     </g>
    //     <style>{css}</style>
    //   </g>
    // </svg>
  )
}

export default Spinner

export const AnimatedLogo: React.FC<{
  className?: string
  duration?: number
}> = ({className = '', duration, ...rest}) => {
  return (
    <>
      <svg
        className={className}
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...rest}
      >
        <g clip-path="url(#clip0_100_902)">
          <rect width="48" height="48" fill="transparent" />
          <mask
            id="mask0_100_902"
            style={{maskType: 'alpha'}}
            maskUnits="userSpaceOnUse"
            x="0"
            y="3"
            width="48"
            height="42"
          >
            <AnimatedPaths
              duration={duration}
              animate={{
                y: ['-200%', '0%'],
                x: ['-200%', '0%'],
              }}
            />
            <AnimatedPaths
              duration={duration}
              animate={{
                y: ['-150%', '50%'],
                x: ['-150%', '50%'],
              }}
            />
            {/* <AnimatedPaths
            duration={duration}
              animate={{
                y: ['-100%', '100%'],
                x: ['-100%', '100%'],
              }}
            /> */}
            <AnimatedPaths
              duration={duration}
              animate={{
                y: ['-50%', '50%'],
                x: ['-50%', '50%'],
              }}
            />
            <AnimatedPaths
              duration={duration}
              animate={{
                y: ['0%', '100%'],
                x: ['0%', '100%'],
              }}
            />
            {/* <AnimatedPaths
            duration={duration}
              animate={{
                y: ['50%', '150%'],
                x: ['50%', '150%'],
              }}
            /> */}
            {/* <AnimatedPaths
            duration={duration}
              animate={{
                y: ['100%', '200%'],
                x: ['100%', '200%'],
              }}
            /> */}
          </mask>

          <g mask="url(#mask0_100_902)">
            <path
              d="M39.7783 36.0591C40.8026 36.0591 41.7946 35.81 42.685 35.3332L38.8075 42.0615C37.7616 43.8764 35.8881 44.96 33.7962 44.96C31.7044 44.96 29.8309 43.8764 28.785 42.0615L13.5767 15.6779C12.4741 13.7674 10.422 12.5806 8.22165 12.5806C7.19769 12.5806 6.20567 12.8296 5.31494 13.3064L9.19204 6.57854C10.238 4.76361 12.1115 3.68002 14.2033 3.68002C16.2955 3.68002 18.1687 4.76361 19.2146 6.57854L34.4233 32.9621C35.5258 34.8723 37.5779 36.0591 39.7783 36.0591Z"
              fill="currentColor"
            />
            <path
              d="M39.0842 7.04294C37.8886 4.96864 35.6611 3.68002 33.2705 3.68002H26.2494L43.5928 33.7739L47.1035 27.6824C48.2988 25.6084 48.2988 23.0316 47.1035 20.9576L39.0842 7.04294Z"
              fill="currentColor"
            />
            <path
              d="M8.91551 41.5971C10.1108 43.6714 12.3383 44.9596 14.7293 44.9596H21.7504L4.40694 14.8658L0.896221 20.9576C-0.298741 23.0312 -0.298741 25.6081 0.896221 27.6824L8.91551 41.5971Z"
              fill="currentColor"
            />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_100_902">
            <rect width="48" height="48" fill="transparent" />
          </clipPath>
        </defs>
      </svg>
    </>
  )
}

const AnimatedPaths: React.FC<{
  transition?: AnimationProps['transition']
  animate?: any
  duration?: number
}> = ({transition, animate, duration = 2}) => {
  return (
    <>
      {[
        'M39.7783 36.0591C40.8026 36.0591 41.7946 35.81 42.685 35.3332L38.8075 42.0615C37.7616 43.8764 35.8881 44.96 33.7962 44.96C31.7044 44.96 29.8309 43.8764 28.785 42.0615L13.5767 15.6779C12.4741 13.7674 10.422 12.5806 8.22165 12.5806C7.19769 12.5806 6.20567 12.8296 5.31494 13.3064L9.19204 6.57854C10.238 4.76361 12.1115 3.68002 14.2033 3.68002C16.2955 3.68002 18.1687 4.76361 19.2146 6.57854L34.4233 32.9621C35.5258 34.8723 37.5779 36.0591 39.7783 36.0591Z',
        'M39.0842 7.04294C37.8886 4.96864 35.6611 3.68002 33.2705 3.68002H26.2494L43.5928 33.7739L47.1035 27.6824C48.2988 25.6084 48.2988 23.0316 47.1035 20.9576L39.0842 7.04294Z',
        'M8.91551 41.5971C10.1108 43.6714 12.3383 44.9596 14.7293 44.9596H21.7504L4.40694 14.8658L0.896221 20.9576C-0.298741 23.0312 -0.298741 25.6081 0.896221 27.6824L8.91551 41.5971Z',
      ].map((d) => {
        return (
          <motion.path
            animate={animate}
            transition={
              transition
                ? {...transition}
                : {
                    duration: duration,
                    ease: 'linear',
                    delay: 0,
                    repeatType: 'loop',
                    repeat: Infinity,
                  }
            }
            d={d}
            fill="white"
          />
        )
      })}
    </>
  )
}
