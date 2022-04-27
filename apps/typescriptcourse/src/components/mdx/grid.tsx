import React from 'react'
import {motion, useReducedMotion} from 'framer-motion'
import cx from 'classnames'

const AnimatedGrid: React.FC<{className?: string}> = ({
  children,
  className,
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion()
  const childrenArr = React.Children.toArray(children)
  const container = {
    hidden: {opacity: 0, scale: 0.95, transition: {}},
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.25,
      },
    },
  }

  const itemVariants = {
    // hidden: {opacity: 0, scale: 0.8, y: -20},
    // show: {
    //   opacity: 1,
    //   scale: 1,
    //   y: 0,
    //   transition: {
    //     // type: 'spring',
    //     // stiffness: 80,
    //     // mass: 0.15,
    //   },
    // },
  }

  return (
    <motion.div className={cx(className)}>
      <motion.ul
        // initial={shouldReduceMotion ? false : {opacity: 0, scale: 0.9, y: -50}}
        // whileInView={{
        //   opacity: 1,
        //   scale: 1,
        //   y: 0,
        //   transition: {type: 'spring', stiffness: 40, mass: 0.15},
        // }}
        // variants={container}
        initial={shouldReduceMotion ? false : 'hidden'}
        whileInView="show"
        variants={container}
        viewport={{once: true, amount: 0.5}}
        {...props}
      >
        {childrenArr.map(({props: {children: items}}: any) => {
          return items.map(({props: {children: item}}: any) => {
            return (
              <motion.li
                // whileInView={{scale: 1, transition: {delay: Math.random() * 1}}}
                // initial={{scale: 0}}
                variants={itemVariants}
                key={item}
              >
                {item}
              </motion.li>
            )
          })
        })}
      </motion.ul>
    </motion.div>
  )
}

export {AnimatedGrid}
