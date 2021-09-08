import KentCDodds from '../../public/images/kent-c-dodds@2x.jpg'
import HeaderImage from '../../public/images/hero@2x.jpg'
import HeroMobile from '../../public/images/hero-mobile@2x.jpg'
import Image from 'next/image'

const Hero = ({currentPrice}: any) => {
  return (
    <header className="relative z-0 min-h-[100vh] flex md:flex-row flex-col items-center justify-center md:-mx-10 -mx-5 md:-mt-10 -mt-5 bg-white">
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
          <div className="md:hidden flex items-center justify-center max-w-2xl">
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
        <div>
          <div className="text-white text-center">
            Save{' '}
            <span className="tabular-nums font-medium">
              $
              {currentPrice ? (
                599 + 332 - currentPrice
              ) : (
                <span className="opacity-0">000</span>
              )}
            </span>{' '}
            with bundled pricing.
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center border-opacity-90 px-5">
        <div className="max-w-screen-sm mx-auto flex flex-col justify-center md:items-start items-center w-full md:text-left text-center">
          <h1 className="lg:text-5xl md:text-4xl text-3xl font-extrabold">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </h1>
          <h2 className="lg:text-xl sm:text-lg pt-4 leading-tight text-primary-600">
            Praesent id sapien at massa egestas pulvinar
          </h2>
          <div className="pt-8 flex items-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden">
              <Image src={KentCDodds} alt="Kent C. Dodds" placeholder="blur" />
            </div>
            <div className="pl-2 text-lg font-medium">Kent C. Dodds</div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Hero
