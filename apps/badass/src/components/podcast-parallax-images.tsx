import * as React from 'react'
import Image from 'next/legacy/image'
import {isNull} from 'lodash'
import cx from 'classnames'
import {motion} from 'framer-motion'

import MagicMushroom from '../../public/assets/magic-mushroom@2x.png'
import PurpleMushroom from '../../public/assets/purple-mushroom@2x.png'
import RedDiamond from '../../public/assets/red-diamond@2x.png'
import GreenDiamond from '../../public/assets/green-diamond@2x.png'
import Hammer from '../../public/assets/hammer@2x.png'
import ChantarelleMushroom from '../../public/assets/chantarelle-mushroom@2x.png'
import Stars1 from '../../public/assets/stars-1@2x.png'
import Stars2 from '../../public/assets/stars-2@2x.png'

const ParallaxImages: React.FC<any> = ({y}) => {
  const images = [
    Hammer,
    Stars1,
    MagicMushroom,
    Stars2,
    ChantarelleMushroom,
    PurpleMushroom,
    Stars1,
    RedDiamond,
    GreenDiamond,
  ]

  return (
    <motion.div className="grid pointer-events-none absolute top-0 h-[150%] max-w-screen-xl xl:px-16 xl:w-full md:w-[100%] w-[105%] grid-cols-2 z-10">
      {images.map((image, i) => {
        if (isNull(image)) {
          return <div />
        }
        return (
          <motion.div
            style={{y}}
            key={i}
            className={cx('lg:w-24 sm:w-24 w-16', {
              'justify-self-end': i % 2,
              'place-self-center': i % 2,
            })}
          >
            <div
              className={cx('', {
                'rotate-12': i % 2,
                '-rotate-12': !(i % 2),
              })}
            >
              <Image
                className="drop-shadow-xl"
                src={image}
                alt=""
                aria-hidden="true"
              />
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default ParallaxImages
