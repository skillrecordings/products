import type {NextPage} from 'next'

const Home: NextPage = () => {
  return (
    <>
      <div className="relative w-full">
        <div className="flex:auto flex-col text-center items-center bg-black">
          <h1 className="pt-52 h-screen text-4xl md:text-6xl xl:text-7xl 2xl:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
            Type errors are ✨annoying✨
          </h1>
        </div>
      </div>
    </>
  )
}

export default Home
