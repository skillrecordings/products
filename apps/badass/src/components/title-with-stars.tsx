import * as React from 'react'
import Image from 'next/image'

const TitleWithStars: React.FC<React.PropsWithChildren> = ({children}) => {
  return (
    <div className="flex justify-center items-center space-x-2 md:space-x-4">
      <div className="relative w-4 h-5 md:w-8 md:h-10 -top-3 md:-top-6">
        <Image src="/assets/single-star-1.svg" alt="star" fill />
      </div>
      <h2 className="text-3xl md:text-5xl lg:text-[3.5rem] font-heading">
        {children}
      </h2>
      <div className="relative w-4 h-5 md:w-8 md:h-10 top-3 md:top-6">
        <Image src="/assets/single-star-2.svg" alt="star" fill />
      </div>
    </div>
  )
}
export default TitleWithStars
