import type {NextPage} from 'next'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {
  SubscribeToConvertkitForm,
  redirectUrlBuilder,
} from '@skillrecordings/convertkit'

import Layout from 'components/layout'

const Subscribe = () => {
  const router = useRouter()
  return (
    <section className="bg-white text-[#27234f] rounded-lg lg:px-20 md:px-16 px-6 xl:px-24 lg:py-16 md:py-12 py-5 xl:py-20">
      <div className="text-center space-y-7 mb-6">
        <h3 className="text-[1.625rem]">
          Become proficient with backend development today!
        </h3>
        <p className="">
          Sign up for exclusive content and early-release lessons.
        </p>
      </div>
      <SubscribeToConvertkitForm
        onSuccess={(subscriber: any) => {
          if (subscriber) {
            const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
            router.push(redirectUrl)
          }
        }}
        actionLabel="Sign Up Today"
      />
      <p className="text-sm text-[#737373] text-center mt-4">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </section>
  )
}

const Home: NextPage = () => {
  return (
    <Layout>
      <div className="relative w-full">
        <div
          className="absolute inset-0"
          // style={{
          //   backgroundImage:
          //     'conic-gradient(from 47deg at 53% 55%, #ff6518 0%, #3a86c9 8%, #000000 29%, #000000 44%, #8748e1 59%, #9f00b7 76%, #ff6518 100%)',
          // }}
        >
          <Image
            alt="Mountains"
            src="/images/background.webp"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        </div>
        <div className="relative min-h-screen pt-12 md:pt-20 xl:pt-24 2xl:pt-28 pb-80">
          <div className="max-w-[40rem] px-4 mx-auto">
            <h3 className="uppercase font-medium">new course</h3>
            <h1 className="mt-8 md:mt-10 lg:mt-12 xl:mt-14 text-4xl md:text-5xl xl:text-6xl leading-[1.1]">
              Front to Back:
              <br />
              Backend for
              <br />
              Frontend Devs
            </h1>
            <h2 className="mt-4 md:mt-6 lg:mt-7 xl:mt-8 text-2xl md:text-3xl xl:text-[1.625rem] leading-tight tracking-tight">
              An interactive course designed to help JavaScript developers
              become proficient with backend development.
            </h2>
            <div className="space-y-6 mt-6">
              <p>
                For a lot of frontend developers, the back of the stack feels
                like a <em>black box</em>—a mysterious, and often scary
                discipline.
              </p>
              <p>
                But if your goal is to be a well-rounded engineer, you’ll need a
                comprehensive understanding of what is happening on the server
                and in your databases.
              </p>
              <p>
                If you want to claim the elusive title of{' '}
                <em>full-stack developer</em> and climb higher up the
                engineering career ladder,{' '}
                <strong>this message is for you</strong>.
              </p>
              <p>
                To be proficient in backend development, you need to understand:
              </p>
              <ul className="list-outside list-disc space-y-4 pl-4">
                <li className="">
                  <span>
                    How the web <em>actually</em> work{' '}
                  </span>
                  <ul className="list-outside list-[circle] pl-4">
                    <li className="">
                      <span>DNS and domains</span>
                    </li>
                    <li className="">
                      <span>Request/Response models</span>
                    </li>
                    <li className="">
                      <span>HTTP</span>
                    </li>
                    <li className="">
                      <span>Headers</span>
                    </li>
                    <li className="">
                      <span>Basics of caching</span>
                    </li>
                  </ul>
                </li>
                <li className="">
                  <span>How to architect servers </span>
                  <ul className="list-outside list-[circle] pl-4">
                    <li className="">
                      <span>Languages/flavors</span>
                    </li>
                    <li className="">
                      <span>Server setup</span>
                    </li>
                    <li className="">
                      <span>Server security</span>
                    </li>
                    <li className="">
                      <span>Application setup</span>
                    </li>
                  </ul>
                </li>
                <li className="">
                  <span>
                    How to build databases with design principles in mind
                  </span>
                  <ul className="list-outside list-[circle] pl-4">
                    <li className="">
                      <span>Relational vs. no-SQL</span>
                    </li>
                    <li className="">
                      <span>Compare various DBMSs</span>
                    </li>
                    <li className="">
                      <span>Self-hosting vs. DB as a service</span>
                    </li>
                    <li className="">
                      <span>Scaling</span>
                    </li>
                    <li className="">
                      <span>ORMs</span>
                    </li>
                  </ul>
                </li>
                <li className="">
                  <span>How to build APIs from scratch </span>
                  <ul className="list-outside list-[circle] pl-4">
                    <li className="">
                      <span>Endpoints</span>
                    </li>
                    <li className="">
                      <span>Design principles</span>
                    </li>
                    <li className="">
                      <span>Authentication basics</span>
                    </li>
                    <li className="">
                      <span>REST vs GraphQL</span>
                    </li>
                  </ul>
                </li>
              </ul>
              <p>
                <em>
                  <strong>And so much more…</strong>
                </em>
              </p>
              <p>
                This may seem like a lot, and trying to go it alone can feel
                overwhelming.
              </p>
              <p>The good news?</p>
              <p className="text-2xl leading-normal">
                I’m building <strong>Front to Back</strong>, an interactive
                course designed to help JavaScript developers become proficient
                with backend development.
              </p>
              <p>
                If you want to deeply learn the back of the stack with a
                practical, real-world approach, sign up below for exclusive
                content, and be the first to catch updates on the course.
              </p>
              <p>Hope to see you soon!</p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="max-w-[47rem] px-4 mx-auto -mt-[220px]">
          <Subscribe />
        </div>
        <div className="mt-14 space-y-6 max-w-[40rem] px-4 mx-auto">
          <p>
            Becoming proficient with backend development is a game-changer. All
            of the sudden, that black box of knowledge on the server is
            unlocked.
          </p>
          <p>
            Whether you want to architect full-stack applications on your own,
            provide more value across engineering teams, or simply move faster
            with your work—I want to help get you there.
          </p>
          <p>Now let's get to work.</p>
        </div>
      </div>
      <div className="py-32">
        <div className="max-w-[40rem] px-4 mx-auto">
          <h3 className="text-center text-[1.625rem]">Chance Strickland</h3>
          <div className="w-[300px] h-[300px] rounded-full mx-auto mt-6 overflow-hidden">
            <Image
              alt="Chance Strickland"
              src="/images/chance-strickland.webp"
              width={300}
              height={300}
              quality={100}
            />
          </div>
          <div className="mt-[4.5rem] flex flex-col items-center space-y-6">
            <div className="space-y-6 w-full">
              <p>
                Hi! I'm Chance, and I will be your{' '}
                <strong>Front to Back</strong> instructor.
              </p>
              <p>
                I am a software engineer building{' '}
                <a
                  href="https://www.radix-ui.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b-2 hover:opacity-75 duration-100"
                >
                  Radix UI
                </a>{' '}
                and the maintainer of{' '}
                <a
                  href="https://reach.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b-2 hover:opacity-75 duration-100"
                >
                  Reach UI
                </a>
                .
              </p>
              <p>
                I've also worked on{' '}
                <a
                  href="https://www.radix-ui.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b-2 hover:opacity-75 duration-100"
                >
                  Radix UI
                </a>{' '}
                and taught hundreds of developers how to build better full-stack
                React apps with{' '}
                <a
                  href="https://reacttraining.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b-2 hover:opacity-75 duration-100"
                >
                  React Training
                </a>
                .
              </p>
            </div>
            <div className="space-x-3 flex items-center">
              <a
                href="https://twitter.com/chancethedev"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1da1f2] flex justify-center items-center hover:opacity-75 duration-100"
              >
                <Image
                  alt="twitter"
                  src="/images/icons/twitter.svg"
                  width={20}
                  height={20}
                  quality={100}
                />
                <span className="sr-only">twitter</span>
              </a>
              <a
                href="https://www.linkedin.com/in/chaance/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#007bb5] flex justify-center items-center hover:opacity-75 duration-100"
              >
                <Image
                  alt="twitter"
                  src="/images/icons/linkedin.svg"
                  width={20}
                  height={20}
                  quality={100}
                />
                <span className="sr-only">linkedin</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
