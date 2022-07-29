import type {NextPage} from 'next'
import Image from 'next/image'

const Home: NextPage = () => {
  return (
    <>
      <div className="relative w-full">
        <div className="bg-black">
          <div className="flex h-screen justify-center items-center">
            <div className="text-center">
              <h1 className="pb-10 text-5xl md:text-6xl xl:text-7xl 2xl:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-500">
                Type errors are ✨annoying✨
              </h1>
              <div className="text-white font-bold pt-10 px-20 sm:text-xl md:text-2xl xl:text-4xl 2xl:text-6xl">
                <p>
                  {' '}
                  When you’re used to the carefree life of declaring variables
                  without worrying about what they’ll eventually become or the
                  functions they’ll interact with, adding types just seems
                  like...
                </p>
                <p className="pt-6 pb-20">
                  {' '}
                  a bunch of extra work for little reward.
                </p>
                <a href="#intro">
                  <Image
                    width={40}
                    height={20}
                    src="https://res.cloudinary.com/tsforjs/image/upload/v1658263809/website/chevrondown_nnqrfs.png"
                    alt="down button"
                  />
                </a>
              </div>
            </div>
          </div>
          <div>
            <div className="justify-center items-center" id="intro">
              <div className="text-center">
                <div className="pb-10 text-5xl md:text-6xl xl:text-7xl 2xl:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-500">
                  <p>
                    Typescript{' '}
                    <span className="text-teal-400 font-normal italic">
                      for{' '}
                    </span>{' '}
                    Javascript{' '}
                  </p>
                  <p>Developers</p>
                </div>
                <p className="inline-block px-5 py-1 text-xs tracking-wider rounded-full sm:text-sm bg-gradient-to-r from-purple-300 to-pink-300">
                  NEW COURSE
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
