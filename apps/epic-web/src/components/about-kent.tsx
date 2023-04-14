import React from 'react'

const AboutKent = () => {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-10 px-5 pb-32 sm:gap-16 md:flex-row">
      <img
        src="/kent-c-dodds.png"
        width={200}
        height={200}
        className="rounded-full bg-gray-200 dark:bg-gray-800"
        alt="Kent C. Dodds"
      />
      <div className="prose dark:prose-invert lg:prose-lg prose-a:underline prose-a:decoration-gray-300 prose-a:underline-offset-2 prose-a:transition hover:prose-a:decoration-indigo-300">
        <p>
          Kent C. Dodds is a world renowned speaker, teacher, and trainer and
          he&#39;s actively involved in the{' '}
          <a
            href="https://github.com/kentcdodds"
            rel="noopener noreferrer"
            target="_blank"
          >
            open source community
          </a>{' '}
          as a maintainer and contributor of hundreds of popular npm packages.
          He is the creator of{' '}
          <a href="https://epicreact.dev" target="_blank" rel="noreferrer">
            EpicReact.Dev
          </a>{' '}
          and{' '}
          <a
            href="https://testingjavascript.com"
            target="_blank"
            rel="noreferrer"
          >
            TestingJavaScript.com
          </a>
          . He&#39;s an instructor on{' '}
          <a
            href="https://egghead.io/q/resources-by-kent-c-dodds"
            target="_blank"
            rel="noreferrer"
          >
            egghead.io
          </a>{' '}
          and{' '}
          <a
            href="https://frontendmasters.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            Frontend Masters
          </a>
          . He&#39;s also a{' '}
          <a
            href="https://developers.google.com/community/experts/directory/profile/profile-kent-c-dodds"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google Developer Expert
          </a>
          . Kent is happily married and the father of four kids. He likes his
          family, code, JavaScript, and Remix.
        </p>
      </div>
    </section>
  )
}

export default AboutKent
