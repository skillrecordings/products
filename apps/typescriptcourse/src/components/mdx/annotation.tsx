import React from 'react'
import {RoughNotation, RoughNotationGroup} from 'react-rough-notation'
import {motion, useReducedMotion} from 'framer-motion'
import {useIntersection} from 'react-use'
import type {types} from 'react-rough-notation'
import cx from 'classnames'

const Annotation: React.FC<{
  type?: types
  children: any
  className?: string
}> = ({type, children, className, ...props}) => {
  const shouldReduceMotion = useReducedMotion()
  const intersectionRef = React.useRef(null)
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: '0px',
    threshold: 1,
  })
  const isIntersecting =
    intersection && intersection.intersectionRatio < 1 ? false : true
  const [show, setShow] = React.useState(false)
  React.useEffect(() => {
    intersection && isIntersecting && setShow(isIntersecting)
  }, [intersection, isIntersecting])

  return (
    <motion.span ref={intersectionRef} className={cx('not-prose', className)}>
      <RoughNotation
        animationDuration={1000}
        animationDelay={200}
        animate={shouldReduceMotion ? false : true}
        show={show}
        type={type || 'highlight'}
        color="currentColor"
        {...props}
      >
        {children}
      </RoughNotation>
    </motion.span>
  )
}

export {Annotation}
