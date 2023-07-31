import {isNumber} from 'lodash'
import Image from 'next/image'

type imagesElemType = {
  imageUrl: string
  size: {
    width: number
    height: number
  }
}

type imagesObjType = {
  [key: string]: imagesElemType
}

export type SkeletonHandSeparatorProps = {
  number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  title: string
  subtitle: string
}

const SkeletonHandSeparator: React.FC<SkeletonHandSeparatorProps> = ({
  number,
  title,
  subtitle,
}) => {
  const handNumber = isNumber(number) && `hand-${number}`
  const data = handNumber && images[handNumber as keyof imagesObjType]
  return data ? (
    <div data-skeleton-hand-separator="" className="not-prose">
      <div data-skeleton-hand-separator-image-holder="">
        <Image
          src={data.imageUrl}
          width={data.size.width}
          height={data.size.height}
          alt="separator"
        />
      </div>
      {title && <h3 data-skeleton-hand-separator-title="">{title}</h3>}
      {subtitle && <h4 data-skeleton-hand-separator-subtitle="">{subtitle}</h4>}
    </div>
  ) : null
}

export default SkeletonHandSeparator

const images: imagesObjType = {
  'hand-1': {
    imageUrl:
      'https://res.cloudinary.com/badass-courses/image/upload/v1686881944/assets/skeleton-hands-separators/skeleton-hand-separator-01_2x_wmzynr.png',
    size: {
      width: 262,
      height: 91,
    },
  },
  'hand-2': {
    imageUrl:
      'https://res.cloudinary.com/badass-courses/image/upload/v1686881944/assets/skeleton-hands-separators/skeleton-hand-separator-02_2x_wm3urf.png',
    size: {
      width: 262,
      height: 91,
    },
  },
  'hand-3': {
    imageUrl:
      'https://res.cloudinary.com/badass-courses/image/upload/v1686881944/assets/skeleton-hands-separators/skeleton-hand-separator-03_2x_gtepgc.png',
    size: {
      width: 270,
      height: 91,
    },
  },
  'hand-4': {
    imageUrl:
      'https://res.cloudinary.com/badass-courses/image/upload/v1686881944/assets/skeleton-hands-separators/skeleton-hand-separator-04_2x_qasvbp.png',
    size: {
      width: 266,
      height: 91,
    },
  },
  'hand-5': {
    imageUrl:
      'https://res.cloudinary.com/badass-courses/image/upload/v1686881944/assets/skeleton-hands-separators/skeleton-hand-separator-05_2x_kqkfdm.png',
    size: {
      width: 272,
      height: 91,
    },
  },
  'hand-6': {
    imageUrl:
      'https://res.cloudinary.com/badass-courses/image/upload/v1686881945/assets/skeleton-hands-separators/skeleton-hand-separator-06_2x_unuggl.png',
    size: {
      width: 312,
      height: 91,
    },
  },
  'hand-7': {
    imageUrl:
      'https://res.cloudinary.com/badass-courses/image/upload/v1686881945/assets/skeleton-hands-separators/skeleton-hand-separator-07_2x_i20mbi.png',
    size: {
      width: 311,
      height: 91,
    },
  },
  'hand-8': {
    imageUrl:
      'https://res.cloudinary.com/badass-courses/image/upload/v1686881944/assets/skeleton-hands-separators/skeleton-hand-separator-08_2x_pu4kla.png',
    size: {
      width: 313,
      height: 91,
    },
  },
  'hand-9': {
    imageUrl:
      'https://res.cloudinary.com/badass-courses/image/upload/v1686881945/assets/skeleton-hands-separators/skeleton-hand-separator-09_2x_rzqyrz.png',
    size: {
      width: 312,
      height: 91,
    },
  },
  'hand-10': {
    imageUrl:
      'https://res.cloudinary.com/badass-courses/image/upload/v1686881945/assets/skeleton-hands-separators/skeleton-hand-separator-10_2x_gulogb.png',
    size: {
      width: 316,
      height: 91,
    },
  },
}
