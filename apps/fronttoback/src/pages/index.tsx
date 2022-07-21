import Layout from 'components/layout'
import type {NextPage} from 'next'
import Image from 'next/image'

const Home: NextPage = () => {
  return (
    <Layout>
      <div className="relative w-full">
        <div className="absolute inset-0">
          <Image
            alt="Mountains"
            src="/images/background.webp"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        </div>
        <div className="relative min-h-screen pt-28">
          <div className="max-w-[38rem] mx-auto">
            <h3 className="uppercase font-medium">new course</h3>
            <h1 className="mt-14 text-6xl leading-[1.1]">
              Front to Back:
              <br />
              Backend for
              <br />
              Frontend Devs
            </h1>
            <h2 className="mt-8 text-[1.625rem] leading-tight tracking-tight">
              An interactive course designed to help JavaScript developers
              become proficient with backend development.
            </h2>
            <div className="space-y-6 mt-6">
              <p>
                For a lot of frontend developers, the back of the stack feels
                like a black box—a mysterious, and often scary discipline.
              </p>
              <p>
                But if your goal is to be a well-rounded engineer, you’ll need a
                comprehensive understanding of what is happening on the server
                and in your databases.
              </p>
              <p>
                If you want to claim the elusive title of full-stack developer
                and climb higher up the engineering career ladder, this message
                is for you.
              </p>
              <p>
                To be proficient in backend development, you need to understand:
              </p>
              <ul>
                <li>qwdqwdeqwd</li>
                <li>qwdqwdeqwd</li>
                <li>qwdqwdeqwd</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
