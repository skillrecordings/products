import React from 'react'
import {RoughNotation} from 'react-rough-notation'
import {motion, useReducedMotion} from 'framer-motion'
import {useIntersection} from 'react-use'
import type {RoughNotationProps} from 'react-rough-notation'
import cx from 'classnames'

type AnnotationProps = {
  children: any
  className?: string
} & RoughNotationProps

const Annotation: React.FC<React.PropsWithChildren<AnnotationProps>> = ({
  type,
  children,
  className,
  ...props
}) => {
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
        animationDuration={500}
        animationDelay={200}
        animate={shouldReduceMotion ? false : true}
        show={show}
        type={type || 'highlight'}
        color="currentColor"
        padding={0}
        iterations={1}
        {...props}
      >
        {children}
      </RoughNotation>
    </motion.span>
  )
}

const SimpleAnnotation: React.FC<React.PropsWithChildren<AnnotationProps>> = ({
  type,
  children,
  className,
  ...props
}) => {
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
    <motion.span
      ref={intersectionRef}
      className={cx('not-prose relative z-10', className)}
      initial={{
        backgroundImage: 'linear-gradient(rgb(37, 99, 235), rgb(37, 99, 235))',
        backgroundPosition: '0% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '0% 3px',
      }}
      whileInView={{backgroundSize: '100% 3px'}}
      transition={{duration: 1, type: 'spring', stiffness: 50}}
    >
      {children}
    </motion.span>
  )
}

export {Annotation, SimpleAnnotation}
