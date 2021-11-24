import KentCDodds from '../../public/images/kent-c-dodds@2x.jpg'
import HeaderImage from '../../public/images/hero@2x.jpg'
import HeroMobile from '../../public/images/hero-mobile@2x.jpg'
import Image from 'next/image'
import {scroller} from 'react-scroll'

const Hero = () => {
  return (
    <header className="relative z-0 min-h-[100vh] flex md:flex-row flex-col-reverse items-center justify-center bg-white">
      <div>
        <div className="flex flex-col items-center justify-center space-y-5 h-full w-full">
          <div className="md:flex hidden items-center justify-center max-w-2xl">
            <Image
              src={HeaderImage}
              quality={100}
              priority={true}
              loading="eager"
              alt=""
              placeholder="blur"
            />
          </div>
          <div className="md:hidden flex items-center justify-center max-w-2xl p-5">
            <Image
              src={HeroMobile}
              quality={100}
              priority={true}
              loading="eager"
              alt=""
              placeholder="blur"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center border-opacity-90 px-5 md:pt-0 pt-32">
        <div className="max-w-screen-sm mx-auto flex flex-col justify-center md:items-start items-center w-full md:text-left text-center">
          <h1 className="lg:text-5xl md:text-4xl text-3xl font-extrabold">
            The Proven Path to Building Professional-grade Well Tested React
            Apps
          </h1>
          <h2 className="lg:text-xl sm:text-lg pt-4 leading-tight text-primary-600">
            Now available at an unbeatable price
          </h2>
          <button
            type="button"
            className="mt-4 flex items-center justify-center text-center bg-gradient-to-t from-blue-600 to-blue-500 rounded-md text-white px-8 py-3 font-medium shadow-md hover:scale-105 transition-all ease-in-out duration-200 hover:shadow-lg border border-blue-700 border-opacity-20"
            onClick={() => scroller.scrollTo('buy', {smooth: true})}
          >
            Buy Now
          </button>
          {/* <div className="pt-8 flex items-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden">
              <Image src={KentCDodds} alt="Kent C. Dodds" placeholder="blur" />
            </div>
            <div className="pl-2 text-lg font-medium">Kent C. Dodds</div>
          </div> */}
        </div>
      </div>
    </header>
  )
}

export default Hero
