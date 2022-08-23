import React from 'react'
import {motion, useReducedMotion} from 'framer-motion'
import {isObject} from 'lodash'

const AnimatedList: React.FC<React.PropsWithChildren<{className?: string}>> = ({
  children,
  className,
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion()
  const childrenArr = React.Children.toArray(children)
  const container = {
    hidden: {opacity: 0},
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
      },
    },
  }

  const itemVariants = {
    hidden: {opacity: 0, scale: 0.9, y: -15, rotateX: -50},
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {duration: 0.4, type: 'spring', stiffness: 50, mass: 0.2},
    },
  }

  return (
    <motion.div className={className}>
      <motion.ul
        initial={shouldReduceMotion ? false : 'hidden'}
        whileInView="show"
        variants={container}
        viewport={{once: true, amount: 0.35}}
        {...props}
      >
        {childrenArr.map(({props: {children: items}}: any) => {
          const itemsToMap = items.filter((item: any) => isObject(item))
          return itemsToMap.map(({props: {children: item}}: any) => {
            return (
              <motion.li variants={itemVariants} key={item}>
                {item}
              </motion.li>
            )
          })
        })}
      </motion.ul>
    </motion.div>
  )
}

const CheckList: React.FC<React.PropsWithChildren<{className?: string}>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={className}>
      <div className="list-check" {...props}>
        {children}
      </div>
    </div>
  )
}

export {CheckList, AnimatedList}
