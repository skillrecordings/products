import React from 'react'
import {useInView, useReducedMotion} from 'framer-motion'
import {
  RoughNotation,
  RoughNotationGroup,
  RoughNotationProps,
} from 'react-rough-notation'

type Options = Omit<RoughNotationProps, 'children'> & InViewOptions
type InViewOptions = {
  amount?: 'some' | 'all' | number
  once?: boolean
}

const defaultOptions = {
  color: 'hsl(var(--primary))',
  strokeWidth: 2,
  amount: 0.5,
  once: false,
  type: 'underline',
  animate: true,
  animationDelay: 0,
  animationDuration: 800,
} as Options

const AnnotationGroup: React.FC<
  React.PropsWithChildren<{options?: Options}>
> = ({children, options}) => {
  const _options = {
    ...defaultOptions,
    ...options,
  }

  const ref = React.useRef(null)
  const isInView = useInView(ref, {
    amount: _options.amount,
    once: _options.once,
  })
  const shouldReduceMotion = useReducedMotion()

  return (
    <RoughNotationGroup show={isInView}>
      <RoughNotation
        animate={shouldReduceMotion ? false : _options.animate}
        type={_options.type}
        color={_options.color}
        strokeWidth={_options.strokeWidth}
        animationDelay={_options.animationDelay}
        animationDuration={_options.animationDuration}
      >
        {children}
      </RoughNotation>
    </RoughNotationGroup>
  )
}

const Annotation: React.FC<
  React.PropsWithChildren<{
    options?: Options
    className?: string
    as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
  }>
> = ({as = 'span', children, options, className = '', ...props}) => {
  const _options = {
    ...defaultOptions,
    ...options,
  }

  const ref = React.useRef(null)
  const isInView = useInView(ref, {
    amount: _options.amount,
    once: _options.once,
  })

  const shouldReduceMotion = useReducedMotion()

  const Component = as

  return (
    <Component ref={ref} className={className} {...props}>
      <RoughNotation
        show={isInView}
        animate={shouldReduceMotion ? false : _options.animate}
        type={_options.type}
        color={_options.color}
        strokeWidth={_options.strokeWidth}
        animationDelay={_options.animationDelay}
        animationDuration={_options.animationDuration}
      >
        {children}
      </RoughNotation>
    </Component>
  )
}

export {Annotation, AnnotationGroup}
