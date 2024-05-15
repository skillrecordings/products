import * as React from 'react'
import Link from 'next/link'
import {motion, useReducedMotion} from 'framer-motion'

interface FancyButton {
  tag: 'link' | 'button'
  href?: string
  type?: 'button' | 'submit' | 'reset'
}

const MotionLink = motion(Link)

const FancyButton: React.FC<React.PropsWithChildren<FancyButton>> = ({
  children,
  tag = 'link',
  href = '/',
  type = 'button',
  ...rest
}) => {
  const shouldReduceMotion = useReducedMotion()
  const [isHovered, setIsHovered] = React.useState(false)

  const hoverStart = {
    left: '0%',
    transition: {duration: 0.4, type: 'spring'},
  }

  const hoverEnd = {
    left: '150%',
    transition: {duration: 0.4, type: 'spring'},
  }

  const mandatoryProps = {
    onHoverStart: () => setIsHovered(true),
    onHoverEnd: () => setIsHovered(false),
    className:
      'relative mt-8 transform overflow-hidden rounded-lg bg-blue-500 px-5 py-3 font-bold text-white transition-all duration-150 ease-in-out hover:scale-110 hover:bg-blue-600 hover:shadow-lg flex',
  }

  const buttonContent = (
    <>
      {children}
      <motion.div
        initial={{
          left: '0%',
          width: 20,
          filter: 'blur(15px)',
          transform: 'skew(-30deg)',
          opacity: 0.5,
        }}
        animate={isHovered && !shouldReduceMotion ? hoverStart : hoverEnd}
        className="absolute left-0 top-0 -ml-8 h-full bg-white"
      />
    </>
  )

  return tag === 'link' ? (
    <MotionLink href={href} {...mandatoryProps} {...rest}>
      {buttonContent}
    </MotionLink>
  ) : (
    <motion.button type={type} {...mandatoryProps} {...rest}>
      {buttonContent}
    </motion.button>
  )
}

export default FancyButton
